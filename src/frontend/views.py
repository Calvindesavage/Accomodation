from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import requests
import json

# API Base URL
API_BASE_URL = 'http://localhost:8000/api'


def index(request):
    """Home page"""
    return render(request, 'frontend/index.html')


def login_view(request):
    """Login page"""
    return render(request, 'frontend/login.html')


def register_view(request):
    """Register page"""
    return render(request, 'frontend/register.html')


def dashboard(request):
    """Dashboard page - Authentication handled via JavaScript/API tokens"""
    return render(request, 'frontend/dashboard.html')


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
