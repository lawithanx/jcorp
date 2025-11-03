"""
URL configuration for main app
"""
from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('portfolio/', views.PortfolioView.as_view(), name='portfolio'),
    path('portfolio/<int:pk>/', views.ProjectDetailView.as_view(), name='project_detail'),
    path('about/', views.AboutView.as_view(), name='about'),
    path('about/<int:pk>/', views.AgentDetailView.as_view(), name='agent_detail'),
    path('contact/', views.ContactView.as_view(), name='contact'),
]

