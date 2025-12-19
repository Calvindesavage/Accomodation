from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html

from account.models import Account


class AccountAdmin(UserAdmin):
    list_display = ('email', 'full_name', 'role_badge', 'date_joined', 'last_login',
                    'status_badge', 'is_admin', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    readonly_fields = ('id', 'date_joined', 'last_login')
    list_filter = ('role', 'is_active', 'is_admin', 'is_staff', 'is_superuser', 'date_joined')
    ordering = ('-date_joined',)

    filter_horizontal = ()

    fieldsets = (
        ('Account Information', {
            'fields': ('email', 'password')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name')
        }),
        ('Role & Permissions', {
            'fields': ('role', 'is_active', 'is_admin', 'is_staff', 'is_superuser')
        }),
        ('Important Dates', {
            'fields': ('date_joined', 'last_login'),
            'classes': ('collapse',)
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )

    def full_name(self, obj):
        """Display full name"""
        return f"{obj.first_name} {obj.last_name}" if obj.first_name or obj.last_name else "—"
    full_name.short_description = 'Full Name'

    def role_badge(self, obj):
        """Display role with colored badge"""
        colors = {
            'ADMIN': '#dc3545',
            'LANDLORD': '#0d6efd',
            'USER': '#198754'
        }
        color = colors.get(obj.role, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color, obj.role
        )
    role_badge.short_description = 'Role'

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


admin.site.register(Account, AccountAdmin)