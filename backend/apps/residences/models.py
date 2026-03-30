from django.conf import settings
from django.db import models


class Residence(models.Model):
    landlord = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='residences'
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10, blank=True, default='')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    total_rooms = models.PositiveIntegerField(default=0)
    total_beds = models.PositiveIntegerField(default=0)
    rules = models.TextField(blank=True, default='')
    virtual_tour_video = models.FileField(upload_to='residences/videos/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'residences'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        from apps.reviews.models import Review
        avg = Review.objects.filter(residence=self).aggregate(models.Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    @property
    def review_count(self):
        from apps.reviews.models import Review
        return Review.objects.filter(residence=self).count()


class ResidenceImage(models.Model):
    residence = models.ForeignKey(Residence, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='residences/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'residence_images'
        ordering = ['-is_primary', '-created_at']

    def __str__(self):
        return f'Image for {self.residence.name}'


class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True, default='')
    residences = models.ManyToManyField(Residence, related_name='amenities', blank=True)

    class Meta:
        db_table = 'amenities'
        verbose_name_plural = 'Amenities'
        ordering = ['name']

    def __str__(self):
        return self.name
