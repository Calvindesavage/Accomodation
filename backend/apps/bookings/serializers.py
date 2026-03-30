from rest_framework import serializers
from .models import Booking
from apps.listings.serializers import ListingListSerializer
from apps.users.serializers import UserSerializer


class BookingListSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.full_name')
    student_email = serializers.ReadOnlyField(source='student.email')
    listing_title = serializers.ReadOnlyField(source='listing.title')
    listing_price = serializers.ReadOnlyField(source='listing.price')
    residence_name = serializers.ReadOnlyField(source='listing.residence.name')

    class Meta:
        model = Booking
        fields = ('id', 'student', 'student_name', 'student_email', 'listing',
                  'listing_title', 'listing_price', 'residence_name',
                  'status', 'move_in_date', 'move_out_date', 'message', 'created_at')
        read_only_fields = ('id', 'student', 'status', 'created_at')


class BookingDetailSerializer(BookingListSerializer):
    listing_detail = ListingListSerializer(source='listing', read_only=True)

    class Meta(BookingListSerializer.Meta):
        fields = BookingListSerializer.Meta.fields + (
            'listing_detail', 'rejection_reason', 'updated_at'
        )


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('listing', 'move_in_date', 'move_out_date', 'message')

    def validate(self, attrs):
        if attrs.get('move_out_date') and attrs['move_out_date'] <= attrs['move_in_date']:
            raise serializers.ValidationError({'move_out_date': 'Must be after move-in date.'})
        return attrs


class BookingActionSerializer(serializers.Serializer):
    reason = serializers.CharField(required=False, default='')
