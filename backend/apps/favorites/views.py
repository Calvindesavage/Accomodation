from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics

from .models import Favorite
from .serializers import FavoriteSerializer, FavoriteToggleSerializer
from apps.listings.models import Listing


class FavoriteListView(generics.ListAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related(
            'listing', 'listing__residence'
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request):
    serializer = FavoriteToggleSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    listing_id = serializer.validated_data['listing_id']

    try:
        listing = Listing.objects.get(id=listing_id)
    except Listing.DoesNotExist:
        return Response({'detail': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

    favorite, created = Favorite.objects.get_or_create(user=request.user, listing=listing)
    if not created:
        favorite.delete()
        return Response({'detail': 'Removed from favorites.', 'is_favorited': False})
    return Response({'detail': 'Added to favorites.', 'is_favorited': True}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_favorite(request, listing_id):
    is_fav = Favorite.objects.filter(user=request.user, listing_id=listing_id).exists()
    return Response({'is_favorited': is_fav})
