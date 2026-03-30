from rest_framework import serializers
from .models import Listing, ListingImage
from apps.residences.serializers import AmenitySerializer


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ('id', 'image', 'is_primary', 'created_at')
        read_only_fields = ('id', 'created_at')


class ListingListSerializer(serializers.ModelSerializer):
    residence_name = serializers.ReadOnlyField(source='residence.name')
    residence_city = serializers.ReadOnlyField(source='residence.city')
    residence_address = serializers.ReadOnlyField(source='residence.address')
    residence_latitude = serializers.ReadOnlyField(source='residence.latitude')
    residence_longitude = serializers.ReadOnlyField(source='residence.longitude')
    landlord_name = serializers.ReadOnlyField(source='residence.landlord.full_name')
    amenities = AmenitySerializer(source='residence.amenities', many=True, read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField(source='residence.average_rating')

    class Meta:
        model = Listing
        fields = ('id', 'residence', 'residence_name', 'residence_city', 'residence_address',
                  'residence_latitude', 'residence_longitude', 'landlord_name',
                  'title', 'description', 'price', 'deposit', 'room_type',
                  'availability', 'available_from', 'is_featured', 'max_occupants',
                  'amenities', 'images', 'average_rating', 'created_at')


class ListingDetailSerializer(ListingListSerializer):
    class Meta(ListingListSerializer.Meta):
        fields = ListingListSerializer.Meta.fields + ('updated_at', 'is_active')


class ListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ('id', 'residence', 'title', 'description', 'price', 'deposit',
                  'room_type', 'availability', 'available_from', 'is_featured', 'max_occupants')
        read_only_fields = ('id',)

    def validate_residence(self, value):
        if value.landlord != self.context['request'].user:
            raise serializers.ValidationError('You can only create listings for your own residences.')
        return value
