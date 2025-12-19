from django.urls import path
from .views import HotelViewset

app_name = 'hotel'

hotel_list = HotelViewset.as_view({
    'get': 'list',
    'post': 'create'
})
hotel_detail = HotelViewset.as_view({
    'get': 'retrieve',
    'patch': 'update',
    'put': 'update',
    'delete': 'destroy'
})

urlpatterns = [
    path('', hotel_list, name='hotel-list'),
    path('<int:pk>/', hotel_detail, name='hotel-detail'),
]

