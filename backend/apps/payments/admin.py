from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'payer', 'booking', 'amount', 'payment_type', 'method', 'status')
    list_filter = ('status', 'payment_type', 'method')
    search_fields = ('payer__email', 'transaction_id')
