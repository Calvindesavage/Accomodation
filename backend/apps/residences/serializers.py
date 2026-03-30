from rest_framework import serializers
from .models import Residence, ResidenceImage, Amenity


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ('id', 'name', 'icon')


class ResidenceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResidenceImage
        fields = ('id', 'image', 'is_primary', 'created_at')
        read_only_fields = ('id', 'created_at')


class ResidenceListSerializer(serializers.ModelSerializer):
    landlord_name = serializers.ReadOnlyField(source='landlord.full_name')
    amenities = AmenitySerializer(many=True, read_only=True)
    images = ResidenceImageSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

    class Meta:
        model = Residence
        fields = ('id', 'landlord', 'landlord_name', 'name', 'description', 'address',
                  'city', 'province', 'postal_code', 'latitude', 'longitude',
                  'total_rooms', 'total_beds',
                  'amenities', 'images', 'virtual_tour_video', 'average_rating', 'review_count',
                  'is_active', 'created_at')
        read_only_fields = ('id', 'landlord', 'created_at')


class ResidenceDetailSerializer(ResidenceListSerializer):
    class Meta(ResidenceListSerializer.Meta):
        fields = ResidenceListSerializer.Meta.fields + ('rules', 'updated_at')


class ResidenceCreateSerializer(serializers.ModelSerializer):
    amenity_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False, default=[]
    )

    class Meta:
        model = Residence
        fields = ('id', 'name', 'description', 'address', 'city', 'province', 'postal_code',
                  'latitude', 'longitude', 'total_rooms', 'total_beds', 'rules', 'virtual_tour_video', 'amenity_ids')
        read_only_fields = ('id',)

    def create(self, validated_data):
        amenity_ids = validated_data.pop('amenity_ids', [])
        residence = Residence.objects.create(
            landlord=self.context['request'].user, **validated_data
        )
        if amenity_ids:
            amenities = Amenity.objects.filter(id__in=amenity_ids)
            for amenity in amenities:
                amenity.residences.add(residence)
        return residence

    def update(self, instance, validated_data):
        amenity_ids = validated_data.pop('amenity_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if amenity_ids is not None:
            instance.amenities.clear()
            amenities = Amenity.objects.filter(id__in=amenity_ids)
            for amenity in amenities:
                amenity.residences.add(instance)
        return instance
