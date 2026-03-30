from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Residence, ResidenceImage, Amenity
from .serializers import (
    ResidenceListSerializer, ResidenceDetailSerializer,
    ResidenceCreateSerializer, ResidenceImageSerializer, AmenitySerializer
)
from .services import ResidenceService
from apps.users.permissions import IsLandlord, IsOwnerOrReadOnly


class ResidenceViewSet(viewsets.ModelViewSet):
    queryset = Residence.objects.filter(is_active=True).prefetch_related('amenities', 'images')
    filterset_fields = ['city', 'province']
    search_fields = ['name', 'address', 'city', 'description']
    ordering_fields = ['created_at', 'name']
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_serializer_class(self):
        if self.action == 'list':
            return ResidenceListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return ResidenceCreateSerializer
        return ResidenceDetailSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        if self.action == 'create':
            return [IsAuthenticated(), IsLandlord()]
        return [IsAuthenticated(), IsOwnerOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], parser_classes=[parsers.MultiPartParser],
            permission_classes=[IsAuthenticated, IsLandlord])
    def upload_image(self, request, pk=None):
        residence = self.get_object()
        if residence.landlord != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        image = request.FILES.get('image')
        if not image:
            return Response({'detail': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)
        is_primary = request.data.get('is_primary', 'false').lower() == 'true'
        img = ResidenceService.add_image(residence, image, is_primary)
        return Response(ResidenceImageSerializer(img).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsLandlord])
    def my_residences(self, request):
        qs = ResidenceService.get_landlord_residences(request.user)
        serializer = ResidenceListSerializer(qs, many=True)
        return Response(serializer.data)


class AmenityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [AllowAny]
    pagination_class = None
