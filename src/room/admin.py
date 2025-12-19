from django.contrib import admin
from django.utils.html import format_html
from room.models import Room


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_no', 'hotel_info', 'floor_no', 'capacity', 'price_display', 'availability_badge', 'created_at')
    list_filter = ('is_available', 'hotel', 'floor_no', 'capacity')
    search_fields = ('room_no', 'hotel__name', 'hotel__city', 'details')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')
    list_per_page = 25

    fieldsets = (
        ('Room Information', {
            'fields': ('hotel', 'room_no', 'floor_no', 'capacity', 'is_available')
        }),
        ('Pricing', {
            'fields': ('price',)
        }),
        ('Details', {
            'fields': ('details',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

    def hotel_info(self, obj):
        """Display hotel name and city"""
        if obj.hotel:
            return f"{obj.hotel.name} ({obj.hotel.city})"
        return "—"
    hotel_info.short_description = 'Hotel'

    def price_display(self, obj):
        """Display price formatted"""
        return f"${obj.price:.2f}"
    price_display.short_description = 'Price/Night'
    price_display.admin_order_field = 'price'

    def availability_badge(self, obj):
        """Display availability with colored badge"""
        if obj.is_available:
            return format_html(
                '<span style="background-color: #198754; color: white; padding: 3px 10px; border-radius: 3px;">Available</span>'
            )
        return format_html(
            '<span style="background-color: #ffc107; color: black; padding: 3px 10px; border-radius: 3px;">Occupied</span>'
        )
    availability_badge.short_description = 'Availability'
