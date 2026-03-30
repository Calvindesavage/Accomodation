from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    payer_name = serializers.ReadOnlyField(source='payer.full_name')
    booking_listing = serializers.ReadOnlyField(source='booking.listing.title')

    class Meta:
        model = Payment
        fields = ('id', 'booking', 'payer', 'payer_name', 'booking_listing',
                  'amount', 'payment_type', 'method', 'status', 'transaction_id',
                  'paid_at', 'created_at')
        read_only_fields = ('id', 'payer', 'status', 'transaction_id', 'paid_at', 'created_at')


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('booking', 'amount', 'payment_type', 'method')

    def validate_booking(self, value):
        user = self.context['request'].user
        if value.student != user:
            raise serializers.ValidationError('You can only pay for your own bookings.')
        if value.status != 'accepted':
            raise serializers.ValidationError('Booking must be accepted before payment.')
        return value
