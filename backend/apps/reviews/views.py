from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from apps.users.permissions import IsStudent, IsOwnerOrReadOnly


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    filterset_fields = ['residence', 'rating']
    ordering_fields = ['created_at', 'rating']

    def get_queryset(self):
        return Review.objects.select_related('student', 'residence').all()

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        if self.action == 'create':
            return [IsAuthenticated(), IsStudent()]
        return [IsAuthenticated(), IsOwnerOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
