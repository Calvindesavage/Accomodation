import django_filters
from .models import Listing


class ListingFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    room_type = django_filters.CharFilter(field_name='room_type')
    city = django_filters.CharFilter(field_name='residence__city', lookup_expr='icontains')
    amenity = django_filters.CharFilter(method='filter_by_amenity')
    available_from = django_filters.DateFilter(field_name='available_from', lookup_expr='lte')

    class Meta:
        model = Listing
        fields = ['min_price', 'max_price', 'room_type', 'city', 'amenity',
                  'availability', 'is_featured', 'available_from']

    def filter_by_amenity(self, queryset, name, value):
        amenity_names = [a.strip() for a in value.split(',')]
        return queryset.filter(residence__amenities__name__in=amenity_names).distinct()
