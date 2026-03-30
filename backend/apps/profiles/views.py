from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import StudentProfile, LandlordProfile
from .serializers import StudentProfileSerializer, LandlordProfileSerializer
from apps.users.permissions import IsStudent, IsLandlord


class StudentProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_object(self):
        obj, _ = StudentProfile.objects.get_or_create(user=self.request.user)
        return obj


class LandlordProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = LandlordProfileSerializer
    permission_classes = [IsAuthenticated, IsLandlord]

    def get_object(self):
        obj, _ = LandlordProfile.objects.get_or_create(user=self.request.user)
        return obj
