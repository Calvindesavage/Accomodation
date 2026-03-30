from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        'name': 'ResPlug API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth/',
            'profiles': '/api/profiles/',
            'residences': '/api/residences/',
            'listings': '/api/listings/',
            'bookings': '/api/bookings/',
            'payments': '/api/payments/',
            'reviews': '/api/reviews/',
            'messages': '/api/messages/',
            'notifications': '/api/notifications/',
            'favorites': '/api/favorites/',
            'maintenance': '/api/maintenance/',
        }
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/auth/', include('apps.users.urls')),
    path('api/profiles/', include('apps.profiles.urls')),
    path('api/residences/', include('apps.residences.urls')),
    path('api/listings/', include('apps.listings.urls')),
    path('api/bookings/', include('apps.bookings.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/messages/', include('apps.messaging.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/favorites/', include('apps.favorites.urls')),
    path('api/maintenance/', include('apps.maintenance.urls')),
    path('api/matching/', include('apps.matching.urls')),
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
