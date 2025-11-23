from django.urls import path, include
from account.api.views import registration_view, ChangePasswordView, current_user_view

from rest_framework.authtoken.views import obtain_auth_token

app_name = 'account'


urlpatterns = [
    path('register', registration_view, name='register'),
    path('login', obtain_auth_token, name='login'),
    path('me', current_user_view, name='current-user'),
    path('change-password', ChangePasswordView.as_view(), name='change-password'),
]