from django.urls import path
from . import views

app_name = 'frontend'

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('login/admin/', views.admin_login_view, name='admin_login'),
    path('register/', views.register_view, name='register'),
    path('dashboard/', views.dashboard, name='dashboard'),

    # Landlord Dashboard Routes (slug-based, separate from Django admin)
    path('landlord-panel/', views.landlord_dashboard, name='landlord_dashboard'),
    path('landlord-panel/hotels/', views.landlord_hotels, name='landlord_hotels'),
    path('landlord-panel/hotels/<slug:slug>/', views.landlord_hotel_detail, name='landlord_hotel_detail'),
    path('landlord-panel/rooms/', views.landlord_rooms, name='landlord_rooms'),
    path('landlord-panel/rooms/<int:pk>/', views.landlord_room_detail, name='landlord_room_detail'),
    path('landlord-panel/bookings/', views.landlord_bookings, name='landlord_bookings'),
    path('landlord-panel/bookings/<int:pk>/', views.landlord_booking_detail, name='landlord_booking_detail'),

    # Admin Dashboard Routes (slug-based, separate from Django admin)
    path('admin-panel/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-panel/hotels/', views.admin_hotels, name='admin_hotels'),
    path('admin-panel/hotels/<slug:slug>/', views.admin_hotel_detail, name='admin_hotel_detail'),
    path('admin-panel/rooms/', views.admin_rooms, name='admin_rooms'),
    path('admin-panel/rooms/<int:pk>/', views.admin_room_detail, name='admin_room_detail'),
    path('admin-panel/bookings/', views.admin_bookings, name='admin_bookings'),
    path('admin-panel/bookings/<int:pk>/', views.admin_booking_detail, name='admin_booking_detail'),
    path('admin-panel/customers/', views.admin_customers, name='admin_customers'),
    path('admin-panel/customers/<int:pk>/', views.admin_customer_detail, name='admin_customer_detail'),
    path('admin-panel/payments/', views.admin_payments, name='admin_payments'),
    path('admin-panel/payments/<int:pk>/', views.admin_payment_detail, name='admin_payment_detail'),
    path('admin-panel/users/', views.admin_users, name='admin_users'),
    path('admin-panel/users/<int:pk>/', views.admin_user_detail, name='admin_user_detail'),

    # Old routes (keep for backward compatibility)
    path('hotels/', views.hotels, name='hotels'),
    path('rooms/', views.rooms, name='rooms'),
    path('customers/', views.customers, name='customers'),
    path('bookings/', views.bookings, name='bookings'),
    path('payments/', views.payments, name='payments'),
]

