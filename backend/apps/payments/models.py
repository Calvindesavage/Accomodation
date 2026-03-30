from django.conf import settings
from django.db import models
from apps.bookings.models import Booking


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'
        REFUNDED = 'refunded', 'Refunded'

    class Method(models.TextChoices):
        PAYFAST = 'payfast', 'PayFast'
        OZOW = 'ozow', 'Ozow'
        EFT = 'eft', 'EFT'
        CASH = 'cash', 'Cash'

    class PaymentType(models.TextChoices):
        DEPOSIT = 'deposit', 'Deposit'
        RENT = 'rent', 'Rent'
        OTHER = 'other', 'Other'

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    payer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=20, choices=PaymentType.choices, default=PaymentType.RENT)
    method = models.CharField(max_length=20, choices=Method.choices, default=Method.EFT)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    transaction_id = models.CharField(max_length=255, blank=True, default='')
    gateway_response = models.JSONField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']

    def __str__(self):
        return f'Payment #{self.id} - R{self.amount} ({self.status})'
