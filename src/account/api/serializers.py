from rest_framework import serializers

from account.models import Account


class RegistrationSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = Account
        fields = ['email', 'first_name', 'last_name', 'role', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': False}
        }

    def save(self):
        # Default role is USER if not specified
        role = self.validated_data.get('role', Account.USER)

        account = Account(
            email = self.validated_data['email'],
            first_name = self.validated_data['first_name'],
            last_name = self.validated_data['last_name'],
            role = role,
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({'message': 'Passwords must match'})

        account.set_password(password)
        account.save()
        return account


class AccountSerializer(serializers.ModelSerializer):
    """Serializer for user profile information"""

    class Meta:
        model = Account
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'date_joined', 'last_login', 'is_active', 'is_admin', 'is_staff']
        read_only_fields = ['id', 'email', 'date_joined', 'last_login', 'is_active', 'is_admin', 'is_staff']


class ChangePasswordSerializer(serializers.Serializer):
    model = Account
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)