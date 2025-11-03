"""
Views for main app
"""
from django.views.generic import TemplateView, ListView, DetailView
from .models import Project, Partner


class HomeView(TemplateView):
    """Home page with video background"""
    template_name = 'main/home.html'


class PortfolioView(ListView):
    """Portfolio page - FBI dossier view with tabs"""
    model = Project
    template_name = 'main/portfolio.html'
    context_object_name = 'projects'
    
    def get_queryset(self):
        return Project.objects.filter(is_active=True).order_by('id')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        projects = context['projects']
        
        # Get selected project ID from URL parameter
        selected_id = self.request.GET.get('project', None)
        
        if selected_id:
            selected_project = projects.filter(pk=selected_id).first()
        else:
            # Default to first project if none selected
            selected_project = projects.first() if projects else None
        
        context['selected_project'] = selected_project
        context['projects'] = projects
        return context


class ProjectDetailView(DetailView):
    """Project detail view"""
    model = Project
    template_name = 'main/project_detail.html'
    context_object_name = 'project'


class AboutView(ListView):
    """About page - single agent dossier view"""
    model = Partner
    template_name = 'main/about.html'
    context_object_name = 'agents'
    
    def get_queryset(self):
        return Partner.objects.filter(is_active=True)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Get the first active agent
        agent = Partner.objects.filter(is_active=True).first()
        context['agent'] = agent
        return context


class AgentDetailView(DetailView):
    """Agent detail view"""
    model = Partner
    template_name = 'main/agent_detail.html'
    context_object_name = 'agent'


class ContactView(TemplateView):
    """Contact page"""
    template_name = 'main/contact.html'
