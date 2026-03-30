from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CompatibilityQuestion, StudentAnswer, RoommateMatch
from .serializers import (
    CompatibilityQuestionSerializer,
    StudentAnswerSerializer,
    SubmitAnswersSerializer,
    RoommateMatchSerializer,
)
from .services import MatchingService
from apps.users.permissions import IsStudent, IsLandlord
from apps.listings.models import Listing


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def questions_list(request):
    """Get all active compatibility questions."""
    MatchingService.seed_questions()
    questions = CompatibilityQuestion.objects.filter(is_active=True)
    serializer = CompatibilityQuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsStudent])
def submit_answers(request):
    """Submit answers to all compatibility questions at once."""
    serializer = SubmitAnswersSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    answers_data = serializer.validated_data['answers']
    saved = []
    for item in answers_data:
        q_id = int(item['question'])
        try:
            question = CompatibilityQuestion.objects.get(id=q_id, is_active=True)
        except CompatibilityQuestion.DoesNotExist:
            continue

        if item['answer'] not in question.options:
            return Response(
                {'detail': f'Invalid answer for question {q_id}. Must be one of: {question.options}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        answer, _ = StudentAnswer.objects.update_or_create(
            student=request.user,
            question=question,
            defaults={'answer': item['answer']},
        )
        saved.append(answer)

    return Response({
        'detail': f'Saved {len(saved)} answers.',
        'completed': MatchingService.has_completed_questionnaire(request.user),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def my_answers(request):
    """Get the current student's answers."""
    answers = StudentAnswer.objects.filter(student=request.user).select_related('question')
    serializer = StudentAnswerSerializer(answers, many=True)
    return Response({
        'answers': serializer.data,
        'completed': MatchingService.has_completed_questionnaire(request.user),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def questionnaire_status(request):
    """Check if the student has completed the questionnaire."""
    return Response({
        'completed': MatchingService.has_completed_questionnaire(request.user),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_matches(request):
    """Get roommate matches for the current student, optionally filtered by listing."""
    listing_id = request.query_params.get('listing')
    listing = None
    if listing_id:
        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response({'detail': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

    matches = MatchingService.get_matches_for_student(request.user, listing=listing)
    serializer = RoommateMatchSerializer(matches, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsLandlord])
def compute_matches(request):
    """Landlord triggers match computation for a specific listing."""
    listing_id = request.data.get('listing')
    if not listing_id:
        return Response({'detail': 'listing is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        listing = Listing.objects.get(id=listing_id)
    except Listing.DoesNotExist:
        return Response({'detail': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

    if listing.residence.landlord != request.user:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

    if listing.max_occupants <= 1:
        return Response({'detail': 'Matching only applies to shared rooms (max_occupants > 1).'},
                        status=status.HTTP_400_BAD_REQUEST)

    results = MatchingService.compute_matches_for_listing(listing)
    serializer = RoommateMatchSerializer(results, many=True)
    return Response({
        'detail': f'Computed {len(results)} match(es).',
        'matches': serializer.data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsLandlord])
def listing_matches(request, listing_id):
    """Landlord views all computed matches for a listing."""
    try:
        listing = Listing.objects.get(id=listing_id)
    except Listing.DoesNotExist:
        return Response({'detail': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

    if listing.residence.landlord != request.user:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

    matches = RoommateMatch.objects.filter(listing=listing).select_related(
        'student_a', 'student_b', 'listing'
    )
    serializer = RoommateMatchSerializer(matches, many=True)
    return Response(serializer.data)
