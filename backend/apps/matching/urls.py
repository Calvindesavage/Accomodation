from django.urls import path
from . import views

app_name = 'matching'

urlpatterns = [
    path('questions/', views.questions_list, name='questions'),
    path('submit/', views.submit_answers, name='submit-answers'),
    path('my-answers/', views.my_answers, name='my-answers'),
    path('status/', views.questionnaire_status, name='questionnaire-status'),
    path('my-matches/', views.my_matches, name='my-matches'),
    path('compute/', views.compute_matches, name='compute-matches'),
    path('listing/<int:listing_id>/', views.listing_matches, name='listing-matches'),
]
