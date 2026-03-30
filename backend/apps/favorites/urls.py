from django.urls import path
from . import views

app_name = 'favorites'

urlpatterns = [
    path('', views.FavoriteListView.as_view(), name='favorite-list'),
    path('toggle/', views.toggle_favorite, name='toggle-favorite'),
    path('check/<int:listing_id>/', views.check_favorite, name='check-favorite'),
]
