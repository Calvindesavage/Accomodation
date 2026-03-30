from itertools import combinations
from django.db.models import Q
from .models import CompatibilityQuestion, StudentAnswer, RoommateMatch
from apps.bookings.models import Booking


class MatchingService:
    @staticmethod
    def get_default_questions():
        """Return the default set of compatibility questions to seed the DB."""
        return [
            {
                'text': 'What is your sleep schedule like?',
                'category': 'schedule',
                'options': ['Early bird (before 10pm)', 'Night owl (after midnight)', 'Somewhere in between'],
                'weight': 1.5, 'order': 1,
            },
            {
                'text': 'How do you feel about noise in shared spaces?',
                'category': 'lifestyle',
                'options': ['I prefer silence', 'Some background noise is fine', 'I like music/TV on often'],
                'weight': 1.3, 'order': 2,
            },
            {
                'text': 'How often do you clean shared areas?',
                'category': 'cleanliness',
                'options': ['Daily', 'Every few days', 'Weekly', 'When it looks dirty'],
                'weight': 1.5, 'order': 3,
            },
            {
                'text': 'How do you feel about having guests over?',
                'category': 'social',
                'options': ['Rarely or never', 'Occasionally with notice', 'Frequently, I love hosting'],
                'weight': 1.2, 'order': 4,
            },
            {
                'text': 'What is your study style?',
                'category': 'study',
                'options': ['I study in complete silence', 'I can study with background noise', 'I mostly study outside the room'],
                'weight': 1.0, 'order': 5,
            },
            {
                'text': 'How would you describe your personality?',
                'category': 'social',
                'options': ['Introvert', 'Ambivert', 'Extrovert'],
                'weight': 1.0, 'order': 6,
            },
            {
                'text': 'Do you smoke or vape?',
                'category': 'lifestyle',
                'options': ['No, and I prefer a non-smoking roommate', 'No, but I don\'t mind', 'Yes, occasionally', 'Yes, regularly'],
                'weight': 1.8, 'order': 7,
            },
            {
                'text': 'How do you feel about sharing food and groceries?',
                'category': 'lifestyle',
                'options': ['I prefer to keep everything separate', 'I\'m open to sharing some things', 'Let\'s share everything!'],
                'weight': 0.8, 'order': 8,
            },
            {
                'text': 'What temperature do you prefer in the room?',
                'category': 'lifestyle',
                'options': ['Cool (windows open, fan on)', 'Moderate', 'Warm (heater, windows closed)'],
                'weight': 0.7, 'order': 9,
            },
            {
                'text': 'How do you handle conflicts?',
                'category': 'social',
                'options': ['I address issues immediately', 'I prefer to cool off first, then talk', 'I tend to avoid confrontation'],
                'weight': 1.0, 'order': 10,
            },
        ]

    @staticmethod
    def seed_questions():
        """Create default questions if none exist."""
        if CompatibilityQuestion.objects.exists():
            return
        for q_data in MatchingService.get_default_questions():
            CompatibilityQuestion.objects.create(**q_data)

    @staticmethod
    def compute_pair_score(student_a, student_b):
        """
        Compute compatibility score between two students based on their answers.
        Returns (score: float 0-1, breakdown: dict).
        """
        questions = CompatibilityQuestion.objects.filter(is_active=True)
        answers_a = {
            sa.question_id: sa.answer
            for sa in StudentAnswer.objects.filter(student=student_a, question__in=questions)
        }
        answers_b = {
            sa.question_id: sa.answer
            for sa in StudentAnswer.objects.filter(student=student_b, question__in=questions)
        }

        total_weight = 0.0
        weighted_score = 0.0
        breakdown = {}

        for q in questions:
            if q.id not in answers_a or q.id not in answers_b:
                continue

            total_weight += q.weight
            a_answer = answers_a[q.id]
            b_answer = answers_b[q.id]

            # Exact match = 1.0, adjacent option = 0.5, different = 0.0
            if a_answer == b_answer:
                q_score = 1.0
            else:
                try:
                    options = q.options
                    idx_a = options.index(a_answer)
                    idx_b = options.index(b_answer)
                    distance = abs(idx_a - idx_b)
                    max_distance = len(options) - 1
                    q_score = max(0.0, 1.0 - (distance / max_distance)) if max_distance > 0 else 0.0
                except (ValueError, ZeroDivisionError):
                    q_score = 0.0

            weighted_score += q_score * q.weight
            breakdown[q.category] = breakdown.get(q.category, [])
            breakdown[q.category].append(q_score)

        # Average per category
        category_scores = {}
        for cat, scores in breakdown.items():
            category_scores[cat] = round(sum(scores) / len(scores), 3)

        overall = round(weighted_score / total_weight, 3) if total_weight > 0 else 0.0
        return overall, category_scores

    @staticmethod
    def compute_matches_for_listing(listing):
        """
        For a shared room listing, find all accepted bookings,
        filter by same gender, compute pairwise scores, and store results.
        """
        if listing.max_occupants <= 1:
            return []

        # Get all accepted bookings for this listing
        accepted_bookings = Booking.objects.filter(
            listing=listing,
            status=Booking.Status.ACCEPTED,
        ).select_related('student')

        students = [b.student for b in accepted_bookings]

        # Also include pending bookings so matches can inform acceptance
        pending_bookings = Booking.objects.filter(
            listing=listing,
            status=Booking.Status.PENDING,
        ).select_related('student')
        students += [b.student for b in pending_bookings]

        # Deduplicate
        seen = set()
        unique_students = []
        for s in students:
            if s.id not in seen:
                seen.add(s.id)
                unique_students.append(s)
        students = unique_students

        if len(students) < 2:
            return []

        # Group by gender for same-gender pairing
        gender_groups = {}
        for s in students:
            g = s.gender or 'UNKNOWN'
            gender_groups.setdefault(g, []).append(s)

        results = []
        for gender, group in gender_groups.items():
            if gender == 'UNKNOWN' or len(group) < 2:
                continue
            for student_a, student_b in combinations(group, 2):
                # Ensure consistent ordering (lower id first)
                if student_a.id > student_b.id:
                    student_a, student_b = student_b, student_a

                score, breakdown = MatchingService.compute_pair_score(student_a, student_b)

                match, _ = RoommateMatch.objects.update_or_create(
                    listing=listing,
                    student_a=student_a,
                    student_b=student_b,
                    defaults={
                        'compatibility_score': score,
                        'breakdown': breakdown,
                    }
                )
                results.append(match)

        return results

    @staticmethod
    def get_matches_for_student(student, listing=None):
        """Get all roommate matches involving this student, optionally for a specific listing."""
        qs = RoommateMatch.objects.filter(
            Q(student_a=student) | Q(student_b=student)
        ).select_related('student_a', 'student_b', 'listing', 'listing__residence')

        if listing:
            qs = qs.filter(listing=listing)

        return qs

    @staticmethod
    def has_completed_questionnaire(student):
        """Check if a student has answered all active questions."""
        active_count = CompatibilityQuestion.objects.filter(is_active=True).count()
        answered_count = StudentAnswer.objects.filter(
            student=student,
            question__is_active=True
        ).count()
        return answered_count >= active_count and active_count > 0
