from .models import Notification


class NotificationService:
    @staticmethod
    def create(recipient, notification_type, title, message, link=''):
        return Notification.objects.create(
            recipient=recipient,
            notification_type=notification_type,
            title=title,
            message=message,
            link=link,
        )

    @staticmethod
    def notify_booking_request(booking):
        landlord = booking.listing.residence.landlord
        NotificationService.create(
            recipient=landlord,
            notification_type=Notification.NotificationType.BOOKING_REQUEST,
            title='New Booking Request',
            message=f'{booking.student.full_name} requested to book {booking.listing.title}.',
            link=f'/dashboard/bookings/{booking.id}',
        )

    @staticmethod
    def notify_booking_accepted(booking):
        NotificationService.create(
            recipient=booking.student,
            notification_type=Notification.NotificationType.BOOKING_ACCEPTED,
            title='Booking Accepted',
            message=f'Your booking for {booking.listing.title} has been accepted.',
            link=f'/bookings/{booking.id}',
        )

    @staticmethod
    def notify_booking_rejected(booking):
        NotificationService.create(
            recipient=booking.student,
            notification_type=Notification.NotificationType.BOOKING_REJECTED,
            title='Booking Rejected',
            message=f'Your booking for {booking.listing.title} was rejected.',
            link=f'/bookings/{booking.id}',
        )

    @staticmethod
    def notify_new_message(conversation, sender):
        for participant in conversation.participants.exclude(id=sender.id):
            NotificationService.create(
                recipient=participant,
                notification_type=Notification.NotificationType.NEW_MESSAGE,
                title='New Message',
                message=f'{sender.full_name} sent you a message.',
                link=f'/messages/{conversation.id}',
            )

    @staticmethod
    def notify_payment_received(payment):
        landlord = payment.booking.listing.residence.landlord
        NotificationService.create(
            recipient=landlord,
            notification_type=Notification.NotificationType.PAYMENT_RECEIVED,
            title='Payment Received',
            message=f'R{payment.amount} received for {payment.booking.listing.title}.',
            link=f'/dashboard/payments',
        )
