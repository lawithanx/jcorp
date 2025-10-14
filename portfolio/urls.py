from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    path('', views.home_view, name='home'),
    path('portfolio/', views.portfolio_view, name='portfolio'),
    path('contact/', views.contact_view, name='contact'),
]
