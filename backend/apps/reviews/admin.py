from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('student', 'residence', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('student__email', 'residence__name')
