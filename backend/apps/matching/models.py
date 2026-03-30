from django.conf import settings
from django.db import models
from apps.listings.models import Listing


class CompatibilityQuestion(models.Model):
    """Questions auto-generated for roommate compatibility matching."""
    class Category(models.TextChoices):
        LIFESTYLE = 'lifestyle', 'Lifestyle'
        CLEANLINESS = 'cleanliness', 'Cleanliness'
        SCHEDULE = 'schedule', 'Schedule'
        SOCIAL = 'social', 'Social'
        STUDY = 'study', 'Study Habits'

    text = models.CharField(max_length=500)
    category = models.CharField(max_length=20, choices=Category.choices)
    options = models.JSONField(
        help_text='List of answer options, e.g. ["Early bird","Night owl"]'
    )
    weight = models.FloatField(default=1.0, help_text='Importance weight for matching score')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'compatibility_questions'
        ordering = ['order', 'id']

    def __str__(self):
        return self.text


class StudentAnswer(models.Model):
    """A student's answer to a compatibility question."""
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='compatibility_answers'
    )
    question = models.ForeignKey(
        CompatibilityQuestion, on_delete=models.CASCADE, related_name='answers'
    )
    answer = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_answers'
        unique_together = ('student', 'question')

    def __str__(self):
        return f'{self.student.email} - {self.question.text[:40]}: {self.answer}'


class RoommateMatch(models.Model):
    """Stores computed roommate match results for a listing."""
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='roommate_matches')
    student_a = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matches_as_a'
    )
    student_b = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matches_as_b'
    )
    compatibility_score = models.FloatField(help_text='Score from 0.0 to 1.0')
    breakdown = models.JSONField(
        default=dict, blank=True,
        help_text='Per-category score breakdown'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'roommate_matches'
        ordering = ['-compatibility_score']
        unique_together = ('listing', 'student_a', 'student_b')

    def __str__(self):
        pct = int(self.compatibility_score * 100)
        return f'{self.student_a.email} ↔ {self.student_b.email} ({pct}%)'
