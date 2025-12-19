from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import requests
import json

# Import models
from hotel.models import Hotel
from room.models import Room
from booking.models import Booking
from customer.models import Customer
from payment.models import Payment
from account.models import Account

# API Base URL
API_BASE_URL = 'http://localhost:8000/api'


def index(request):
    """Home page"""
    return render(request, 'frontend/index.html')


def login_view(request):
    """Login page"""
    return render(request, 'frontend/login.html')


def admin_login_view(request):
    """Admin Login page - Special login for administrators"""
    return render(request, 'admin/login.html')


def register_view(request):
    """Register page"""
    return render(request, 'frontend/register.html')


def dashboard(request):
    """User Dashboard - Authentication handled via JavaScript/API tokens"""
    return render(request, 'frontend/dashboard.html')


def admin_dashboard(request):
    """Admin Dashboard - Full system access"""
    return render(request, 'admin/dashboard.html')


def landlord_dashboard(request):
    """Landlord Dashboard - Manage hotels and rooms"""
    return render(request, 'landlord/landlord_dashboard.html')


def landlord_hotels(request):
    """Landlord Hotels List"""
    return render(request, 'landlord/hotels_list.html')


def landlord_hotel_detail(request, slug):
    """Landlord Hotel Detail - View specific hotel using slug"""
    from hotel.models import Hotel
    hotel = get_object_or_404(Hotel, slug=slug)
    return render(request, 'landlord/hotel_detail.html', {'hotel': hotel})


def landlord_rooms(request):
    """Landlord Rooms List"""
    return render(request, 'landlord/rooms_list.html')


def landlord_room_detail(request, pk):
    """Landlord Room Detail"""
    from room.models import Room
    room = get_object_or_404(Room, pk=pk)
    return render(request, 'landlord/room_detail.html', {'room': room})


def landlord_bookings(request):
    """Landlord Bookings List"""
    return render(request, 'landlord/bookings_list.html')


def landlord_booking_detail(request, pk):
    """Landlord Booking Detail"""
    from booking.models import Booking
    booking = get_object_or_404(Booking, pk=pk)
    return render(request, 'landlord/booking_detail.html', {'booking': booking})


def hotels(request):
    """Hotels management page"""
    return render(request, 'frontend/hotels.html')


def rooms(request):
    """Rooms management page - Authentication handled via JavaScript/API tokens"""
    return render(request, 'frontend/rooms.html')


def customers(request):
    """Customers management page - Authentication handled via JavaScript/API tokens"""
    return render(request, 'frontend/customers.html')


def bookings(request):
    """Bookings management page - Authentication handled via JavaScript/API tokens"""
    return render(request, 'frontend/bookings.html')


def payments(request):
    """Payments management page - Authentication handled via JavaScript/API tokens"""
    return render(request, 'frontend/payments.html')


# ============================================
# ADMIN PANEL VIEWS (Separate from Django Admin)
# ============================================

def admin_hotels(request):
    """Admin Hotels List Page"""
    hotels = Hotel.objects.all().select_related('landlord').order_by('-created_at')
    context = {
        'hotels': hotels,
        'total_count': hotels.count(),
    }
    return render(request, 'admin/hotels_list.html', context)


def admin_hotel_detail(request, slug):
    """Admin Hotel Detail Page - Using slug"""
    hotel = get_object_or_404(Hotel, slug=slug)
    rooms = hotel.rooms.all()
    context = {
        'hotel': hotel,
        'rooms': rooms,
        'rooms_count': rooms.count(),
    }
    return render(request, 'admin/hotel_detail.html', context)


def admin_rooms(request):
    """Admin Rooms List Page"""
    rooms = Room.objects.all().select_related('hotel').order_by('-created_at')
    context = {
        'rooms': rooms,
        'total_count': rooms.count(),
    }
    return render(request, 'admin/rooms_list.html', context)


def admin_room_detail(request, pk):
    """Admin Room Detail Page"""
    room = get_object_or_404(Room, pk=pk)
    bookings = Booking.objects.filter(room=room).order_by('-created_at')
    context = {
        'room': room,
        'bookings': bookings,
        'bookings_count': bookings.count(),
    }
    return render(request, 'admin/room_detail.html', context)


def admin_bookings(request):
    """Admin Bookings List Page"""
    bookings = Booking.objects.all().select_related('room', 'room__hotel').order_by('-created_at')
    context = {
        'bookings': bookings,
        'total_count': bookings.count(),
    }
    return render(request, 'admin/bookings_list.html', context)


def admin_booking_detail(request, pk):
    """Admin Booking Detail Page"""
    booking = get_object_or_404(Booking, pk=pk)
    payments = Payment.objects.filter(booking=booking).order_by('-created_at')
    total_paid = sum(p.amount for p in payments)
    context = {
        'booking': booking,
        'payments': payments,
        'total_paid': total_paid,
        'balance': booking.discounted_price - total_paid,
    }
    return render(request, 'admin/booking_detail.html', context)


def admin_customers(request):
    """Admin Customers List Page"""
    customers = Customer.objects.all().order_by('-created_at')
    context = {
        'customers': customers,
        'total_count': customers.count(),
    }
    return render(request, 'admin/customers_list.html', context)


def admin_customer_detail(request, pk):
    """Admin Customer Detail Page"""
    customer = get_object_or_404(Customer, pk=pk)
    # Get bookings for this customer by phone number
    bookings = Booking.objects.filter(customer_phone_no=customer.phone_no).order_by('-created_at')
    context = {
        'customer': customer,
        'bookings': bookings,
        'bookings_count': bookings.count(),
    }
    return render(request, 'admin/customer_detail.html', context)


def admin_payments(request):
    """Admin Payments List Page"""
    payments = Payment.objects.all().select_related('booking', 'booking__room').order_by('-created_at')
    total_amount = sum(p.amount for p in payments)
    context = {
        'payments': payments,
        'total_count': payments.count(),
        'total_amount': total_amount,
    }
    return render(request, 'admin/payments_list.html', context)


def admin_payment_detail(request, pk):
    """Admin Payment Detail Page"""
    payment = get_object_or_404(Payment, pk=pk)
    context = {
        'payment': payment,
    }
    return render(request, 'admin/payment_detail.html', context)


def admin_users(request):
    """Admin Users List Page"""
    users = Account.objects.all().order_by('-date_joined')
    context = {
        'users': users,
        'total_count': users.count(),
        'admin_count': users.filter(role='ADMIN').count(),
        'landlord_count': users.filter(role='LANDLORD').count(),
        'user_count': users.filter(role='USER').count(),
    }
    return render(request, 'admin/users_list.html', context)


def admin_user_detail(request, pk):
    """Admin User Detail Page"""
    user = get_object_or_404(Account, pk=pk)
    # Get hotels if landlord
    hotels = Hotel.objects.filter(landlord=user) if user.role == 'LANDLORD' else []
    context = {
        'user': user,
        'hotels': hotels,
        'hotels_count': len(hotels),
    }
    return render(request, 'admin/user_detail.html', context)
