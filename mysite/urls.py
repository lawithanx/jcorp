"""
URL configuration for mysite project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('main.urls')),  # API routes
]

# Serve React app (both in development and production)
react_build_path = os.path.join(settings.BASE_DIR, 'frontend', 'build')
if os.path.exists(react_build_path):
    # Serve React static files (JS, CSS, images, etc.)
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': os.path.join(react_build_path, 'static')}),
    ]
    # Serve React public assets (videos, favicon, manifest, etc.)
    urlpatterns += [
        re_path(r'^videos/(?P<path>.*)$', serve, {'document_root': os.path.join(react_build_path, 'videos')}),
        re_path(r'^(favicon\.ico|logo\d+\.png|manifest\.json|robots\.txt)$', serve, {'document_root': react_build_path}),
    ]
    # Serve React index.html for all non-API/admin routes (exclude videos and other assets)
    urlpatterns += [
        re_path(r'^(?!api|admin|media|static|videos|favicon\.ico|logo\d+\.png|manifest\.json|robots\.txt).*$', TemplateView.as_view(template_name='index.html')),
    ]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
