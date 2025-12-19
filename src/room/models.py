from django.db import models
from django.utils.translation import ugettext_lazy as _

from base.models import BaseModel

class Room(BaseModel):
    hotel          = models.ForeignKey('hotel.Hotel', on_delete=models.CASCADE, related_name='rooms', null=True, blank=True)
    room_no        = models.CharField(verbose_name='room_no', max_length=100)
    floor_no       = models.IntegerField()
    capacity       = models.IntegerField()
    price          = models.FloatField()
    details        = models.TextField(max_length=500, null=True, blank=True)
    is_available   = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.hotel.name} - Room {self.room_no}"

    class Meta:
        ordering = ['-created_at']
        db_table = 'rooms'
        verbose_name = _('Room')
        verbose_name_plural = _('Rooms')
        unique_together = [['hotel', 'room_no']]  # Room number unique per hotel
        indexes = [
            models.Index(fields=['room_no']),
            models.Index(fields=['floor_no']),
            models.Index(fields=['capacity']),
            models.Index(fields=['hotel'])
        ]
