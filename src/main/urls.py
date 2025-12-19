from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_swagger.views import get_swagger_view

# Customize Django Admin
admin.site.site_header = "Hotel Booking System Administration"
admin.site.site_title = "Hotel Booking Admin"
admin.site.index_title = "Welcome to Hotel Booking System Admin Portal"

schema_view = get_swagger_view(title='Hotel Booking System API')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/account/', include('account.api.urls', 'account_api')),
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('api/hotel/', include('hotel.api.urls', 'hotel_api')),
    path('api/customer/', include('customer.api.urls', 'customer_api')),
    path('api/room/', include('room.api.urls', 'room_api')),
    path('api/booking/', include('booking.api.urls', 'booking_api')),
    path('api/payment/', include('payment.api.urls', 'payment_api')),

    path('', include('frontend.urls', 'frontend')),

    path('swagger/', schema_view)
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
