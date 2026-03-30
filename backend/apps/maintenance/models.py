from django.conf import settings
from django.db import models
from apps.residences.models import Residence


class MaintenanceRequest(models.Model):
    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        IN_PROGRESS = 'in_progress', 'In Progress'
        RESOLVED = 'resolved', 'Resolved'
        CLOSED = 'closed', 'Closed'

    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        URGENT = 'urgent', 'Urgent'

    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='maintenance_requests'
    )
    residence = models.ForeignKey(
        Residence, on_delete=models.CASCADE, related_name='maintenance_requests'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    landlord_notes = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='maintenance/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'maintenance_requests'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} ({self.status})'
