from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

def home_view(request):
    """
    Home page view displaying hero section, about, skills, and featured projects.
    """
    return render(request, 'portfolio/home.html')

def portfolio_view(request):
    """
    Portfolio page view displaying all projects and technologies.
    """
    return render(request, 'portfolio/portfolio.html')

def contact_view(request):
    """
    Contact page view with contact form and information.
    """
    if request.method == 'POST':
        # Handle form submission
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        # Here you would typically save to database or send email
        # For now, we'll just return a success message
        return render(request, 'portfolio/contact.html', {
            'success_message': 'Thank you for your message! I\'ll get back to you soon.'
        })
    
    return render(request, 'portfolio/contact.html')
