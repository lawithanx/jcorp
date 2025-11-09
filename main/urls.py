"""
URL configuration for main app
Only API routes - React handles all frontend routes
"""
from django.urls import path
from . import api_views

app_name = 'main'

urlpatterns = [
    # API endpoints for Web3 payments
    path('payment/info/', api_views.get_payment_info, name='payment_info'),
    path('payment/verify/', api_views.verify_payment, name='verify_payment'),
    path('payment/fiat/', api_views.process_fiat_payment, name='fiat_payment'),
    path('download/<str:token>/', api_views.download_business_card, name='download_card'),
]
