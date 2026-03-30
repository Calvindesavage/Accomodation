from django.db.models import Q
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Conversation, Message
from .serializers import (
    ConversationListSerializer, ConversationDetailSerializer,
    MessageSerializer, StartConversationSerializer
)
from django.contrib.auth import get_user_model

User = get_user_model()


class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(
            participants=self.request.user
        ).prefetch_related('participants', 'messages')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ConversationDetailSerializer
        return ConversationListSerializer

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        conversation = self.get_object()
        content = request.data.get('content', '').strip()
        if not content:
            return Response({'detail': 'Message cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)
        message = Message.objects.create(
            conversation=conversation, sender=request.user, content=content
        )
        conversation.save()  # updates updated_at
        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        conversation = self.get_object()
        conversation.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
        return Response({'detail': 'Messages marked as read.'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_conversation(request):
    serializer = StartConversationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    recipient_id = serializer.validated_data['recipient_id']
    message_content = serializer.validated_data['message']

    try:
        recipient = User.objects.get(id=recipient_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    if recipient == request.user:
        return Response({'detail': 'Cannot message yourself.'}, status=status.HTTP_400_BAD_REQUEST)

    # Check for existing conversation
    existing = Conversation.objects.filter(
        participants=request.user
    ).filter(participants=recipient)
    if existing.exists():
        conversation = existing.first()
    else:
        conversation = Conversation.objects.create()
        conversation.participants.add(request.user, recipient)

    Message.objects.create(conversation=conversation, sender=request.user, content=message_content)
    conversation.save()
    return Response(
        ConversationDetailSerializer(conversation, context={'request': request}).data,
        status=status.HTTP_201_CREATED
    )
