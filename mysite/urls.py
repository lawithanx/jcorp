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
    path('', include('main.urls')),  # Django templates
]

# Serve React app in production (when built)
if not settings.DEBUG:
    # Serve React build files
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    ]
    # Serve React index.html for all non-API routes
    react_build_path = os.path.join(settings.BASE_DIR, 'frontend', 'build')
    if os.path.exists(react_build_path):
        urlpatterns += [
            re_path(r'^(?!api|admin|media|static).*$', TemplateView.as_view(template_name='index.html')),
        ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
