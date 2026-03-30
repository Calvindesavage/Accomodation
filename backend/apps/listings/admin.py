from django.contrib import admin
from .models import Listing, ListingImage


class ListingImageInline(admin.TabularInline):
    model = ListingImage
    extra = 1


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'residence', 'price', 'room_type', 'availability', 'is_featured')
    list_filter = ('room_type', 'availability', 'is_featured', 'is_active')
    search_fields = ('title', 'residence__name')
    inlines = [ListingImageInline]
