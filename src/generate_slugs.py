#!/usr/bin/env python
"""
Script to generate slugs for existing hotels
"""
from hotel.models import Hotel

# Get all hotels without slugs (empty string or None)
hotels_without_slugs = Hotel.objects.filter(slug='')
print(f'Found {hotels_without_slugs.count()} hotels without slugs')

# Generate slugs by saving each hotel (the save method will auto-generate slugs)
for hotel in hotels_without_slugs:
    print(f'Generating slug for: {hotel.name}')
    hotel.save()
    print(f'  -> Slug: {hotel.slug}')

print('\n✅ All slugs generated successfully!')

# Show all hotels with their slugs
all_hotels = Hotel.objects.all()
print(f'\nTotal hotels: {all_hotels.count()}')
for hotel in all_hotels:
    print(f'  - {hotel.name}: {hotel.slug}')

