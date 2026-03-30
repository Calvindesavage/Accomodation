from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'messaging'

router = DefaultRouter()
router.register('conversations', views.ConversationViewSet, basename='conversation')

urlpatterns = [
    path('start/', views.start_conversation, name='start-conversation'),
    path('', include(router.urls)),
]
