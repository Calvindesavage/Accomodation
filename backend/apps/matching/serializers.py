from rest_framework import serializers
from .models import CompatibilityQuestion, StudentAnswer, RoommateMatch


class CompatibilityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompatibilityQuestion
        fields = ('id', 'text', 'category', 'options', 'order')


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = ('id', 'question', 'answer', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class SubmitAnswersSerializer(serializers.Serializer):
    """Accepts a list of {question: id, answer: str} to submit all at once."""
    answers = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField()),
        min_length=1,
    )

    def validate_answers(self, value):
        for item in value:
            if 'question' not in item or 'answer' not in item:
                raise serializers.ValidationError(
                    'Each answer must have "question" (id) and "answer" (text).'
                )
            try:
                int(item['question'])
            except (ValueError, TypeError):
                raise serializers.ValidationError(
                    f'Invalid question id: {item["question"]}'
                )
        return value


class RoommateMatchSerializer(serializers.ModelSerializer):
    student_a_name = serializers.ReadOnlyField(source='student_a.full_name')
    student_a_email = serializers.ReadOnlyField(source='student_a.email')
    student_a_gender = serializers.ReadOnlyField(source='student_a.gender')
    student_b_name = serializers.ReadOnlyField(source='student_b.full_name')
    student_b_email = serializers.ReadOnlyField(source='student_b.email')
    student_b_gender = serializers.ReadOnlyField(source='student_b.gender')
    listing_title = serializers.ReadOnlyField(source='listing.title')
    residence_name = serializers.ReadOnlyField(source='listing.residence.name')
    compatibility_percentage = serializers.SerializerMethodField()

    class Meta:
        model = RoommateMatch
        fields = (
            'id', 'listing', 'listing_title', 'residence_name',
            'student_a', 'student_a_name', 'student_a_email', 'student_a_gender',
            'student_b', 'student_b_name', 'student_b_email', 'student_b_gender',
            'compatibility_score', 'compatibility_percentage', 'breakdown',
            'created_at',
        )

    def get_compatibility_percentage(self, obj):
        return int(obj.compatibility_score * 100)
