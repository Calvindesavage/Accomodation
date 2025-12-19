from django.contrib import admin
from django.utils.html import format_html
from customer.models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone_no', 'gender', 'country', 'created_at')
    list_filter = ('gender', 'country', 'occupation', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone_no', 'address', 'country', 'occupation')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')
    list_per_page = 25

    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'gender')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone_no', 'address', 'country')
        }),
        ('Additional Information', {
            'fields': ('occupation', 'details')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

    def full_name(self, obj):
        """Display full name"""
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = 'Full Name'
    full_name.admin_order_field = 'first_name'
