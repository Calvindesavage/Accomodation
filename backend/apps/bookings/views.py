from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Booking
from .serializers import (
    BookingListSerializer, BookingDetailSerializer,
    BookingCreateSerializer, BookingActionSerializer
)
from .services import BookingService
from apps.users.permissions import IsStudent, IsLandlord


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingListSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status']
    ordering_fields = ['created_at', 'move_in_date']

    def get_queryset(self):
        user = self.request.user
        if user.is_student:
            return Booking.objects.filter(student=user).select_related('listing', 'listing__residence')
        if user.is_landlord:
            return Booking.objects.filter(
                listing__residence__landlord=user
            ).select_related('listing', 'listing__residence', 'student')
        return Booking.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BookingDetailSerializer
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingListSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsStudent()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = BookingService.create_booking(
            student=request.user,
            listing=serializer.validated_data['listing'],
            move_in_date=serializer.validated_data['move_in_date'],
            move_out_date=serializer.validated_data.get('move_out_date'),
            message=serializer.validated_data.get('message', ''),
        )
        return Response(BookingListSerializer(booking).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsLandlord])
    def accept(self, request, pk=None):
        booking = self.get_object()
        booking = BookingService.accept_booking(booking, request.user)
        return Response(BookingListSerializer(booking).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsLandlord])
    def reject(self, request, pk=None):
        serializer = BookingActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = self.get_object()
        booking = BookingService.reject_booking(booking, request.user, serializer.validated_data.get('reason', ''))
        return Response(BookingListSerializer(booking).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsStudent])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        booking = BookingService.cancel_booking(booking, request.user)
        return Response(BookingListSerializer(booking).data)
