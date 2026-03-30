from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.full_name')
    residence_name = serializers.ReadOnlyField(source='residence.name')

    class Meta:
        model = Review
        fields = ('id', 'student', 'student_name', 'residence', 'residence_name',
                  'rating', 'comment', 'created_at', 'updated_at')
        read_only_fields = ('id', 'student', 'created_at', 'updated_at')


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('residence', 'rating', 'comment')

    def validate(self, attrs):
        user = self.context['request'].user
        if Review.objects.filter(student=user, residence=attrs['residence']).exists():
            raise serializers.ValidationError({'detail': 'You have already reviewed this residence.'})
        return attrs
