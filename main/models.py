from django.db import models
from django.urls import reverse


class Project(models.Model):
    """Project model for portfolio dossier"""
    title = models.CharField(max_length=200)
    classification = models.CharField(max_length=50, default='CLASSIFIED', help_text='e.g., CLASSIFIED, CONFIDENTIAL')
    description = models.TextField()
    project_type = models.CharField(max_length=100, blank=True)
    technologies = models.CharField(max_length=500, blank=True, help_text='Comma-separated list')
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    featured_image = models.ImageField(upload_to='projects/', blank=True, null=True)
    white_paper = models.FileField(upload_to='projects/whitepapers/', blank=True, null=True, help_text='PDF, DOCX, or other document file')
    specifications = models.TextField(blank=True, help_text='Project specifications or technical details')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_date']
    
    def __str__(self):
        return self.title
    
    def get_technologies_list(self):
        """Return technologies as a list"""
        if self.technologies:
            return [tech.strip() for tech in self.technologies.split(',') if tech.strip()]
        return []
    
    def get_absolute_url(self):
        return reverse('main:project_detail', kwargs={'pk': self.pk})


class ProjectImage(models.Model):
    """Additional images for projects"""
    project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='projects/images/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'id']
    
    def __str__(self):
        return f"{self.project.title} - Image {self.order}"


class Partner(models.Model):
    """Agent model for about page"""
    name = models.CharField(max_length=200)
    description = models.TextField()
    profile_picture = models.ImageField(upload_to='agents/', blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text='Display order')
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Agent'
        verbose_name_plural = 'Agents'
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('main:agent_detail', kwargs={'pk': self.pk})
