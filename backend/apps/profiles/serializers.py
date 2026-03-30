from rest_framework import serializers
from .models import StudentProfile, LandlordProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    user_name = serializers.ReadOnlyField(source='user.full_name')

    class Meta:
        model = StudentProfile
        fields = ('id', 'user', 'user_email', 'user_name', 'university', 'student_number',
                  'budget_min', 'budget_max', 'preferred_location', 'preferred_room_type',
                  'bio', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')


class LandlordProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    user_name = serializers.ReadOnlyField(source='user.full_name')
    is_verified = serializers.ReadOnlyField()

    class Meta:
        model = LandlordProfile
        fields = ('id', 'user', 'user_email', 'user_name', 'business_name',
                  'verification_status', 'is_verified', 'id_document',
                  'contact_email', 'contact_phone', 'bio', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'verification_status', 'created_at', 'updated_at')
