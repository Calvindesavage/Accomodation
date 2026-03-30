from django.db import models
from apps.residences.models import Residence


class Listing(models.Model):
    class RoomType(models.TextChoices):
        SINGLE = 'single', 'Single'
        SHARED = 'shared', 'Shared'
        BACHELOR = 'bachelor', 'Bachelor'
        ENSUITE = 'ensuite', 'En-suite'

    class AvailabilityStatus(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        OCCUPIED = 'occupied', 'Occupied'
        RESERVED = 'reserved', 'Reserved'

    residence = models.ForeignKey(Residence, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    deposit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    room_type = models.CharField(max_length=20, choices=RoomType.choices, default=RoomType.SINGLE)
    availability = models.CharField(
        max_length=20, choices=AvailabilityStatus.choices, default=AvailabilityStatus.AVAILABLE
    )
    available_from = models.DateField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    max_occupants = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'listings'
        ordering = ['-is_featured', '-created_at']
        indexes = [
            models.Index(fields=['price']),
            models.Index(fields=['room_type']),
            models.Index(fields=['availability']),
            models.Index(fields=['is_featured']),
        ]

    def __str__(self):
        return f'{self.title} - R{self.price}/month'

    @property
    def landlord(self):
        return self.residence.landlord


class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='listings/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'listing_images'
        ordering = ['-is_primary', '-created_at']

    def __str__(self):
        return f'Image for {self.listing.title}'
