from rest_framework import serializers

from room.models import Room


class RoomSerializer(serializers.ModelSerializer):
    hotel_name = serializers.SerializerMethodField()
    hotel_city = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = ('created_by', 'updated_by', 'created_at', 'updated_at')
        extra_kwargs = {
            'room_no': {'required': False},
            'floor_no': {'required': False},
            'price': {'required': False}
        }

    def get_hotel_name(self, obj):
        return obj.hotel.name if obj.hotel else None

    def get_hotel_city(self, obj):
        return obj.hotel.city if obj.hotel else None
