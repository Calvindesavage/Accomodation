from django.contrib import admin
from .models import StudentProfile, LandlordProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'university', 'student_number')
    search_fields = ('user__email', 'university', 'student_number')


@admin.register(LandlordProfile)
class LandlordProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'business_name', 'verification_status')
    list_filter = ('verification_status',)
    search_fields = ('user__email', 'business_name')
