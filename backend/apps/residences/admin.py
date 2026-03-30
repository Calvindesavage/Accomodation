from django.contrib import admin
from .models import Residence, ResidenceImage, Amenity


class ResidenceImageInline(admin.TabularInline):
    model = ResidenceImage
    extra = 1


@admin.register(Residence)
class ResidenceAdmin(admin.ModelAdmin):
    list_display = ('name', 'landlord', 'city', 'province', 'is_active', 'created_at')
    list_filter = ('is_active', 'city', 'province')
    search_fields = ('name', 'address', 'landlord__email')
    inlines = [ResidenceImageInline]


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon')
    search_fields = ('name',)
