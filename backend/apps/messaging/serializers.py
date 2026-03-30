from rest_framework import serializers
from .models import Conversation, Message
from apps.users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.full_name')

    class Meta:
        model = Message
        fields = ('id', 'conversation', 'sender', 'sender_name', 'content', 'is_read', 'created_at')
        read_only_fields = ('id', 'sender', 'created_at')


class ConversationListSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    last_message = MessageSerializer(read_only=True)
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ('id', 'participants', 'last_message', 'unread_count', 'created_at', 'updated_at')

    def get_unread_count(self, obj):
        user = self.context.get('request')
        if user:
            return obj.messages.filter(is_read=False).exclude(sender=user.user).count()
        return 0


class ConversationDetailSerializer(ConversationListSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta(ConversationListSerializer.Meta):
        fields = ConversationListSerializer.Meta.fields + ('messages',)


class StartConversationSerializer(serializers.Serializer):
    recipient_id = serializers.IntegerField()
    message = serializers.CharField()
