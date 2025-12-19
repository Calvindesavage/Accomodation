from rest_framework import viewsets, mixins, permissions, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from hotel.models import Hotel
from hotel.api.serializers import HotelSerializer, HotelListSerializer, HotelCreateSerializer
from base.helpers.pagination import CustomPagination


class HotelViewset(mixins.ListModelMixin,
                   mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   viewsets.GenericViewSet):
    queryset = Hotel.objects.filter(is_active=True)
    serializer_class = HotelSerializer
    pagination_class = CustomPagination
    lookup_field = 'pk'
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend, filters.SearchFilter]
    ordering_fields = ['-created_at', 'name', 'star_rating']
    search_fields = ['name', 'city', 'country']
    filterset_fields = ['city', 'country', 'star_rating', 'landlord']
    
    def get_permissions(self):
        """
        GET (list, retrieve) - Public (AllowAny)
        POST (create) - Landlord & Admin only
        PUT/PATCH/DELETE - Landlord (own hotels) & Admin only
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Admin - sees all hotels
        Landlord - sees only their hotels (for edit/delete)
        User/Public - sees all active hotels
        """
        queryset = super().get_queryset()
        user = self.request.user
        
        # For list and retrieve, show all active hotels
        if self.action in ['list', 'retrieve']:
            return queryset
        
        # For create/update/delete, filter by ownership
        if user.is_authenticated:
            if user.is_role_admin():
                return Hotel.objects.all()  # Admin sees all
            elif user.is_role_landlord():
                return queryset.filter(landlord=user)  # Landlord sees only their hotels
        
        return queryset.none()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return HotelListSerializer
        elif self.action == 'create':
            return HotelCreateSerializer
        return HotelSerializer
    
    def perform_create(self, serializer):
        """Set landlord to current user and created_by"""
        user = self.request.user
        
        # Only landlords and admins can create hotels
        if not (user.is_role_landlord() or user.is_role_admin()):
            raise permissions.PermissionDenied("Only landlords and admins can create hotels")
        
        # If admin is creating, they must specify landlord in request
        # If landlord is creating, set themselves as landlord
        if user.is_role_landlord():
            serializer.save(landlord=user, created_by=user.email)
        else:
            # Admin must provide landlord_id in request data
            landlord_id = self.request.data.get('landlord_id')
            if not landlord_id:
                raise serializers.ValidationError("Admin must specify landlord_id")
            serializer.save(created_by=user.email)
    
    def perform_update(self, serializer):
        """Only allow landlord to update their own hotels, or admin to update any"""
        hotel = self.get_object()
        user = self.request.user
        
        if not user.is_role_admin() and hotel.landlord != user:
            raise permissions.PermissionDenied("You can only update your own hotels")
        
        serializer.save(updated_by=user.email)
    
    def perform_destroy(self, instance):
        """Soft delete - only landlord can delete their own hotels, or admin can delete any"""
        user = self.request.user
        
        if not user.is_role_admin() and instance.landlord != user:
            raise permissions.PermissionDenied("You can only delete your own hotels")
        
        instance.is_active = False
        instance.save()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

