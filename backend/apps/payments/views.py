from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer
from apps.users.permissions import IsStudent


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'payment_type', 'method']
    ordering_fields = ['created_at', 'amount']
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.is_student:
            return Payment.objects.filter(payer=user).select_related('booking', 'booking__listing')
        if user.is_landlord:
            return Payment.objects.filter(
                booking__listing__residence__landlord=user
            ).select_related('booking', 'booking__listing', 'payer')
        return Payment.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsStudent()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(payer=self.request.user)
