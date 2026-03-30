from django.contrib import admin
from .models import MaintenanceRequest


@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'tenant', 'residence', 'priority', 'status', 'created_at')
    list_filter = ('status', 'priority')
    search_fields = ('title', 'tenant__email', 'residence__name')
