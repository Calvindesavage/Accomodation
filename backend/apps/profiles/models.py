from django.conf import settings
from django.db import models


class StudentProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_profile'
    )
    university = models.CharField(max_length=255, blank=True, default='')
    student_number = models.CharField(max_length=50, blank=True, default='')
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    preferred_location = models.CharField(max_length=255, blank=True, default='')
    preferred_room_type = models.CharField(max_length=50, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_profiles'

    def __str__(self):
        return f'Student: {self.user.full_name}'


class LandlordProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='landlord_profile'
    )
    business_name = models.CharField(max_length=255, blank=True, default='')
    verification_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('verified', 'Verified'), ('rejected', 'Rejected')],
        default='pending',
    )
    id_document = models.FileField(upload_to='landlord_docs/', blank=True, null=True)
    contact_email = models.EmailField(blank=True, default='')
    contact_phone = models.CharField(max_length=20, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'landlord_profiles'

    def __str__(self):
        return f'Landlord: {self.user.full_name}'

    @property
    def is_verified(self):
        return self.verification_status == 'verified'
