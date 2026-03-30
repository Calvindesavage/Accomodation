from django.conf import settings
from django.db import models


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        BOOKING_REQUEST = 'booking_request', 'New Booking Request'
        BOOKING_ACCEPTED = 'booking_accepted', 'Booking Accepted'
        BOOKING_REJECTED = 'booking_rejected', 'Booking Rejected'
        BOOKING_CANCELLED = 'booking_cancelled', 'Booking Cancelled'
        NEW_MESSAGE = 'new_message', 'New Message'
        PAYMENT_RECEIVED = 'payment_received', 'Payment Received'
        REVIEW_POSTED = 'review_posted', 'New Review'
        LISTING_ALERT = 'listing_alert', 'Listing Alert'
        MAINTENANCE_UPDATE = 'maintenance_update', 'Maintenance Update'

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications'
    )
    notification_type = models.CharField(max_length=30, choices=NotificationType.choices)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
        ]

    def __str__(self):
        return f'{self.notification_type} → {self.recipient.email}'
