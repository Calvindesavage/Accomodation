from django.contrib import admin
from django.utils.html import format_html
from payment.models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking_info', 'amount_display', 'payment_method_badge', 'created_at')
    list_filter = ('payment_method', 'created_at')
    search_fields = ('booking__room__room_no', 'booking__customer__first_name', 'booking__customer__last_name', 'amount')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')
    date_hierarchy = 'created_at'
    list_per_page = 25

    fieldsets = (
        ('Payment Information', {
            'fields': ('booking', 'amount', 'payment_method')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

    def booking_info(self, obj):
        """Display booking information"""
        if obj.booking and obj.booking.room:
            return f"Booking #{obj.booking.id} - Room {obj.booking.room.room_no}"
        return f"Booking #{obj.booking.id}" if obj.booking else "—"
    booking_info.short_description = 'Booking'

    def amount_display(self, obj):
        """Display amount formatted"""
        return f"${obj.amount:.2f}"
    amount_display.short_description = 'Amount'
    amount_display.admin_order_field = 'amount'

    def payment_method_badge(self, obj):
        """Display payment method with colored badge"""
        colors = {
            'cash': '#198754',
            'bkash': '#e91e63',
            'nagad': '#ff9800',
            'upay': '#9c27b0',
            'card': '#2196f3',
            'others': '#6c757d'
        }
        color = colors.get(obj.payment_method, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px; text-transform: uppercase;">{}</span>',
            color, obj.payment_method
        )
    payment_method_badge.short_description = 'Payment Method'
