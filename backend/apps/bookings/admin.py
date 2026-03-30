from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'listing', 'status', 'move_in_date', 'created_at')
    list_filter = ('status',)
    search_fields = ('student__email', 'listing__title')
