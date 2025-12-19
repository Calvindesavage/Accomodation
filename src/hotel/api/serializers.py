from rest_framework import serializers
from hotel.models import Hotel


class HotelSerializer(serializers.ModelSerializer):
    landlord_name = serializers.SerializerMethodField()
    landlord_email = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = '__all__'
        read_only_fields = ('created_by', 'updated_by', 'created_at', 'updated_at', 'landlord', 'slug')

    def get_landlord_name(self, obj):
        return f"{obj.landlord.first_name} {obj.landlord.last_name}"

    def get_landlord_email(self, obj):
        return obj.landlord.email


class HotelListSerializer(serializers.ModelSerializer):
    landlord_name = serializers.SerializerMethodField()
    landlord_email = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = ['id', 'name', 'slug', 'city', 'country', 'phone_no', 'star_rating', 'landlord_name', 'landlord_email', 'is_active', 'image', 'image_url']

    def get_landlord_name(self, obj):
        return f"{obj.landlord.first_name} {obj.landlord.last_name}"

    def get_landlord_email(self, obj):
        return obj.landlord.email

    def get_image_url(self, obj):
        """Return full URL for image"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class HotelCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating hotels - landlord is set from request.user"""

    class Meta:
        model = Hotel
        fields = ['name', 'description', 'image', 'address', 'city', 'country', 'phone_no', 'email', 'star_rating']

