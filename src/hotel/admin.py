from django.contrib import admin
from django.utils.html import format_html
from hotel.models import Hotel


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('image_thumbnail', 'name', 'location', 'landlord_info', 'rating_display', 'contact_info', 'status_badge', 'created_at')
    list_filter = ('is_active', 'star_rating', 'city', 'country', 'created_at')
    search_fields = ('name', 'city', 'country', 'landlord__email', 'landlord__first_name', 'landlord__last_name')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by', 'room_count', 'image_preview')
    list_per_page = 25

    fieldsets = (
        ('Hotel Information', {
            'fields': ('name', 'description', 'image', 'image_preview', 'star_rating', 'is_active')
        }),
        ('Location', {
            'fields': ('address', 'city', 'country')
        }),
        ('Contact', {
            'fields': ('phone_no', 'email')
        }),
        ('Ownership', {
            'fields': ('landlord',)
        }),
        ('Statistics', {
            'fields': ('room_count',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

    def location(self, obj):
        """Display city and country"""
        return f"{obj.city}, {obj.country}"
    location.short_description = 'Location'

    def landlord_info(self, obj):
        """Display landlord information"""
        if obj.landlord:
            return f"{obj.landlord.first_name} {obj.landlord.last_name}" if obj.landlord.first_name else obj.landlord.email
        return "—"
    landlord_info.short_description = 'Landlord'

    def rating_display(self, obj):
        """Display star rating with stars"""
        stars = '⭐' * obj.star_rating
        return format_html(
            '<span style="font-size: 16px;">{}</span>',
            stars
        )
    rating_display.short_description = 'Rating'
    rating_display.admin_order_field = 'star_rating'

    def contact_info(self, obj):
        """Display contact information"""
        return obj.phone_no or obj.email or "—"
    contact_info.short_description = 'Contact'

    def status_badge(self, obj):
        """Display active status with colored badge"""
        if obj.is_active:
            return format_html(
                '<span style="background-color: #198754; color: white; padding: 3px 10px; border-radius: 3px;">Active</span>'
            )
        return format_html(
            '<span style="background-color: #6c757d; color: white; padding: 3px 10px; border-radius: 3px;">Inactive</span>'
        )
    status_badge.short_description = 'Status'

    def room_count(self, obj):
        """Display number of rooms in this hotel"""
        count = obj.rooms.count()
        return format_html(
            '<strong style="font-size: 16px; color: #0d6efd;">{}</strong> rooms',
            count
        )
    room_count.short_description = 'Total Rooms'

    def image_thumbnail(self, obj):
        """Display small thumbnail in list view"""
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.image.url
            )
        return format_html('<span style="color: #999;">No image</span>')
    image_thumbnail.short_description = 'Image'

    def image_preview(self, obj):
        """Display larger image preview in detail view"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 300px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />',
                obj.image.url
            )
        return format_html('<span style="color: #999;">No image uploaded</span>')
    image_preview.short_description = 'Image Preview'
