from django.db.models import Q
from rest_framework.exceptions import ValidationError

from .models import Booking


class BookingService:
    @staticmethod
    def check_overlap(listing, move_in_date, move_out_date, exclude_booking_id=None):
        overlapping = Booking.objects.filter(
            listing=listing,
            status__in=[Booking.Status.PENDING, Booking.Status.ACCEPTED],
        ).filter(
            Q(move_in_date__lt=move_out_date, move_out_date__gt=move_in_date) |
            Q(move_in_date__lt=move_out_date, move_out_date__isnull=True)
        )
        if exclude_booking_id:
            overlapping = overlapping.exclude(id=exclude_booking_id)
        return overlapping.exists()

    @staticmethod
    def create_booking(student, listing, move_in_date, move_out_date=None, message=''):
        if student == listing.residence.landlord:
            raise ValidationError({'detail': 'Landlords cannot book their own listings.'})
        if listing.availability != 'available':
            raise ValidationError({'detail': 'This listing is not currently available.'})
        if move_out_date and BookingService.check_overlap(listing, move_in_date, move_out_date):
            raise ValidationError({'detail': 'This listing is already booked for the selected dates.'})
        return Booking.objects.create(
            student=student, listing=listing,
            move_in_date=move_in_date, move_out_date=move_out_date, message=message,
        )

    @staticmethod
    def accept_booking(booking, landlord):
        if booking.listing.residence.landlord != landlord:
            raise ValidationError({'detail': 'Not authorized.'})
        if booking.status != Booking.Status.PENDING:
            raise ValidationError({'detail': 'Only pending bookings can be accepted.'})
        booking.status = Booking.Status.ACCEPTED
        booking.save()

        # Auto-compute roommate matches for shared rooms
        if booking.listing.max_occupants > 1:
            from apps.matching.services import MatchingService
            MatchingService.compute_matches_for_listing(booking.listing)

        return booking

    @staticmethod
    def reject_booking(booking, landlord, reason=''):
        if booking.listing.residence.landlord != landlord:
            raise ValidationError({'detail': 'Not authorized.'})
        if booking.status != Booking.Status.PENDING:
            raise ValidationError({'detail': 'Only pending bookings can be rejected.'})
        booking.status = Booking.Status.REJECTED
        booking.rejection_reason = reason
        booking.save()
        return booking

    @staticmethod
    def cancel_booking(booking, user):
        if booking.student != user:
            raise ValidationError({'detail': 'Not authorized.'})
        if booking.status not in [Booking.Status.PENDING, Booking.Status.ACCEPTED]:
            raise ValidationError({'detail': 'This booking cannot be cancelled.'})
        booking.status = Booking.Status.CANCELLED
        booking.save()
        return booking
