"""
URL configuration for main app
"""
from django.urls import path
from . import views
from . import api_views

app_name = 'main'

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('portfolio/', views.PortfolioView.as_view(), name='portfolio'),
    path('portfolio/<int:pk>/', views.ProjectDetailView.as_view(), name='project_detail'),
    path('about/', views.AboutView.as_view(), name='about'),
    path('about/<int:pk>/', views.AgentDetailView.as_view(), name='agent_detail'),
    path('contact/', views.ContactView.as_view(), name='contact'),
    path('payment/', views.PaymentView.as_view(), name='payment'),
    
    # API endpoints for Web3 payments
    path('api/payment/info/', api_views.get_payment_info, name='payment_info'),
    path('api/payment/verify/', api_views.verify_payment, name='verify_payment'),
    path('api/payment/fiat/', api_views.process_fiat_payment, name='fiat_payment'),
    path('api/download/<str:token>/', api_views.download_business_card, name='download_card'),
]

