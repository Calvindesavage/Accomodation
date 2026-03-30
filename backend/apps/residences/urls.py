from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'residences'

router = DefaultRouter()
router.register('', views.ResidenceViewSet, basename='residence')

amenity_router = DefaultRouter()
amenity_router.register('', views.AmenityViewSet, basename='amenity')

urlpatterns = [
    path('amenities/', include(amenity_router.urls)),
    path('', include(router.urls)),
]
