import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'
        user = self.scope.get('user')

        if not user or user.is_anonymous:
            await self.close()
            return

        is_participant = await self.check_participant(user.id, self.conversation_id)
        if not is_participant:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get('content', '').strip()
        if not content:
            return

        user = self.scope['user']
        message = await self.save_message(user.id, self.conversation_id, content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': message.id,
                    'sender': user.id,
                    'sender_name': user.full_name,
                    'content': content,
                    'created_at': message.created_at.isoformat(),
                }
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def check_participant(self, user_id, conversation_id):
        return Conversation.objects.filter(
            id=conversation_id, participants__id=user_id
        ).exists()

    @database_sync_to_async
    def save_message(self, user_id, conversation_id, content):
        conversation = Conversation.objects.get(id=conversation_id)
        message = Message.objects.create(
            conversation=conversation, sender_id=user_id, content=content
        )
        conversation.save()
        return message
