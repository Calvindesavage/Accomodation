from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import MaintenanceRequest
from .serializers import MaintenanceRequestSerializer, MaintenanceUpdateSerializer
from apps.users.permissions import IsStudent, IsLandlord


class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'priority', 'residence']
    ordering_fields = ['created_at', 'priority']

    def get_queryset(self):
        user = self.request.user
        if user.is_student:
            return MaintenanceRequest.objects.filter(tenant=user).select_related('residence')
        if user.is_landlord:
            return MaintenanceRequest.objects.filter(
                residence__landlord=user
            ).select_related('residence', 'tenant')
        return MaintenanceRequest.objects.none()

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsStudent()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsLandlord])
    def update_status(self, request, pk=None):
        maintenance = self.get_object()
        if maintenance.residence.landlord != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = MaintenanceUpdateSerializer(maintenance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(MaintenanceRequestSerializer(maintenance).data)
