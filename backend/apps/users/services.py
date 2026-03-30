from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthService:
    @staticmethod
    def get_tokens_for_user(user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @staticmethod
    def register_user(validated_data):
        user = User.objects.create_user(**validated_data)
        tokens = AuthService.get_tokens_for_user(user)
        return user, tokens

    @staticmethod
    def change_password(user, new_password):
        user.set_password(new_password)
        user.save()
