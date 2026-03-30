from rest_framework import serializers
from .models import MaintenanceRequest


class MaintenanceRequestSerializer(serializers.ModelSerializer):
    tenant_name = serializers.ReadOnlyField(source='tenant.full_name')
    residence_name = serializers.ReadOnlyField(source='residence.name')

    class Meta:
        model = MaintenanceRequest
        fields = ('id', 'tenant', 'tenant_name', 'residence', 'residence_name',
                  'title', 'description', 'priority', 'status', 'landlord_notes',
                  'image', 'created_at', 'updated_at')
        read_only_fields = ('id', 'tenant', 'status', 'landlord_notes', 'created_at', 'updated_at')


class MaintenanceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRequest
        fields = ('status', 'landlord_notes')
