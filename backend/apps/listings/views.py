from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Listing, ListingImage
from .serializers import (
    ListingListSerializer, ListingDetailSerializer,
    ListingCreateSerializer, ListingImageSerializer
)
from .filters import ListingFilter
from apps.users.permissions import IsLandlord


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.filter(is_active=True).select_related(
        'residence', 'residence__landlord'
    ).prefetch_related('residence__amenities', 'images')
    filterset_class = ListingFilter
    search_fields = ['title', 'description', 'residence__name', 'residence__address', 'residence__city']
    ordering_fields = ['price', 'created_at', 'is_featured']

    def get_serializer_class(self):
        if self.action == 'list':
            return ListingListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return ListingCreateSerializer
        return ListingDetailSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        if self.action == 'create':
            return [IsAuthenticated(), IsLandlord()]
        return [IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.residence.landlord != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.residence.landlord != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'], parser_classes=[parsers.MultiPartParser],
            permission_classes=[IsAuthenticated, IsLandlord])
    def upload_image(self, request, pk=None):
        listing = self.get_object()
        if listing.residence.landlord != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        image = request.FILES.get('image')
        if not image:
            return Response({'detail': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)
        is_primary = request.data.get('is_primary', 'false').lower() == 'true'
        if is_primary:
            ListingImage.objects.filter(listing=listing).update(is_primary=False)
        img = ListingImage.objects.create(listing=listing, image=image, is_primary=is_primary)
        return Response(ListingImageSerializer(img).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsLandlord])
    def my_listings(self, request):
        qs = Listing.objects.filter(residence__landlord=request.user)
        serializer = ListingListSerializer(qs, many=True)
        return Response(serializer.data)
