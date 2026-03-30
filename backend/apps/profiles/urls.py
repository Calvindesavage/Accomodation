from django.urls import path
from . import views

app_name = 'profiles'

urlpatterns = [
    path('student/', views.StudentProfileView.as_view(), name='student-profile'),
    path('landlord/', views.LandlordProfileView.as_view(), name='landlord-profile'),
]
