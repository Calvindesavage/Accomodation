from rest_framework import permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, filters, mixins, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from base.helpers import CustomPagination
from room.models import Room
from hotel.models import Hotel
from .serializers import RoomSerializer


class RoomViewset(mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    queryset = Room.objects.filter(is_available=True)
    serializer_class = RoomSerializer
    pagination_class = CustomPagination
    lookup_field = 'pk'
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['-created_at', 'price']

    filterset_fields = [
        'room_no', 'floor_no', 'capacity', 'hotel', 'is_available'
    ]

    def get_permissions(self):
        """
        GET (list, retrieve) - Public (AllowAny)
        POST (create) - Landlord (own hotels) & Admin only
        PUT/PATCH/DELETE - Landlord (own hotels) & Admin only
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Admin - sees all rooms
        Landlord - sees rooms in their hotels
        User/Public - sees all available rooms
        """
        queryset = super().get_queryset()
        user = self.request.user

        # For list and retrieve, show all available rooms
        if self.action in ['list', 'retrieve']:
            return queryset

        # For create/update/delete, filter by hotel ownership
        if user.is_authenticated:
            if user.is_role_admin():
                return Room.objects.all()  # Admin sees all
            elif user.is_role_landlord():
                return queryset.filter(hotel__landlord=user)  # Landlord sees only rooms in their hotels

        return queryset.none()

    def perform_create(self, serializer):
        """Only landlord can add rooms to their hotels, admin can add to any hotel"""
        user = self.request.user
        hotel_id = self.request.data.get('hotel')

        if not hotel_id:
            raise serializers.ValidationError("Hotel is required")

        try:
            hotel = Hotel.objects.get(id=hotel_id)
        except Hotel.DoesNotExist:
            raise serializers.ValidationError("Hotel not found")

        # Check permissions
        if not user.is_role_admin() and hotel.landlord != user:
            raise PermissionDenied("You can only add rooms to your own hotels")

        serializer.save(created_by=user.email)

    def perform_update(self, serializer):
        """Only landlord can update rooms in their hotels, admin can update any"""
        room = self.get_object()
        user = self.request.user

        if not user.is_role_admin() and room.hotel.landlord != user:
            raise PermissionDenied("You can only update rooms in your own hotels")

        serializer.save(updated_by=user.email)

    def perform_destroy(self, instance):
        """Soft delete - mark as unavailable"""
        user = self.request.user

        if not user.is_role_admin() and instance.hotel.landlord != user:
            raise PermissionDenied("You can only delete rooms in your own hotels")

        instance.is_available = False
        instance.save()

    def list(self, request, *args, **kwargs):
        return super(RoomViewset, self).list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

