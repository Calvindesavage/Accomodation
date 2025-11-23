from django.urls import path
from . import views

app_name = 'frontend'

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('rooms/', views.rooms, name='rooms'),
    path('customers/', views.customers, name='customers'),
    path('bookings/', views.bookings, name='bookings'),
    path('payments/', views.payments, name='payments'),
]

