from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'listings'

router = DefaultRouter()
router.register('', views.ListingViewSet, basename='listing')

urlpatterns = [
    path('', include(router.urls)),
]
