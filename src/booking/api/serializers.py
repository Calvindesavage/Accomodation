from rest_framework import serializers

from booking.models import Booking


class BookingSerializer(serializers.ModelSerializer):
    room_no = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('created_by', 'updated_by', 'created_at', 'updated_at')

    def get_room_no(self, obj):
        return obj.room.room_no if obj.room else None


class BookingListSerializer(serializers.ModelSerializer):
    room_no = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        exclude = ('created_by', 'updated_by', 'created_at', 'updated_at')

    def get_room_no(self, obj):
        return obj.room.room_no if obj.room else None
