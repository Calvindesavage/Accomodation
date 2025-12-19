from django.contrib import admin
from django.utils.html import format_html
from booking.models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'room_info', 'customer_phone_no', 'booking_start_time', 'booking_end_time', 'price_display', 'booking_status', 'created_at')
    list_filter = ('booking_start_time', 'booking_end_time', 'created_at')
    search_fields = ('room__room_no', 'room__hotel__name', 'customer_phone_no')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')
    date_hierarchy = 'booking_start_time'
    list_per_page = 25

    fieldsets = (
        ('Booking Information', {
            'fields': ('room', 'customer_phone_no')
        }),
        ('Dates & Times', {
            'fields': ('booking_time', 'booking_start_time', 'booking_end_time', 'last_checkin_time', 'last_checkout_time')
        }),
        ('Pricing', {
            'fields': ('price', 'discounted_price')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

    def room_info(self, obj):
        """Display room and hotel information"""
        if obj.room and obj.room.hotel:
            return f"Room {obj.room.room_no} - {obj.room.hotel.name}"
        elif obj.room:
            return f"Room {obj.room.room_no}"
        return "—"
    room_info.short_description = 'Room'

    def price_display(self, obj):
        """Display price formatted"""
        return f"${obj.price:.2f}" if obj.price else "—"
    price_display.short_description = 'Total Price'
    price_display.admin_order_field = 'price'

    def booking_status(self, obj):
        """Display booking status based on dates"""
        from django.utils import timezone
        now = timezone.now()

        if obj.booking_end_time and obj.booking_end_time < now:
            return format_html(
                '<span style="background-color: #6c757d; color: white; padding: 3px 10px; border-radius: 3px;">Completed</span>'
            )
        elif obj.booking_start_time and obj.booking_start_time <= now <= (obj.booking_end_time or now):
            return format_html(
                '<span style="background-color: #198754; color: white; padding: 3px 10px; border-radius: 3px;">Active</span>'
            )
        else:
            return format_html(
                '<span style="background-color: #0d6efd; color: white; padding: 3px 10px; border-radius: 3px;">Upcoming</span>'
            )
    booking_status.short_description = 'Status'
