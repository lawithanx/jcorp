from django.db import models
from django.urls import reverse
from django.utils import timezone


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


class Payment(models.Model):
    """Payment model for tracking crypto transactions"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('confirmed', 'Confirmed'),
        ('failed', 'Failed'),
        ('expired', 'Expired'),
    ]
    
    transaction_hash = models.CharField(max_length=66, unique=True, db_index=True)
    from_address = models.CharField(max_length=42)
    to_address = models.CharField(max_length=42)
    amount_wei = models.DecimalField(max_digits=30, decimal_places=0, help_text='Amount in Wei')
    amount_eth = models.DecimalField(max_digits=18, decimal_places=8, help_text='Amount in ETH')
    network = models.CharField(max_length=20, default='ethereum', help_text='Blockchain network')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    confirmations = models.IntegerField(default=0)
    required_confirmations = models.IntegerField(default=3)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    download_token = models.CharField(max_length=64, unique=True, null=True, blank=True)
    download_expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
    
    def __str__(self):
        return f"Payment {self.transaction_hash[:10]}... - {self.status}"
    
    def is_verified(self):
        return self.status == 'confirmed' and self.confirmations >= self.required_confirmations
    
    def is_download_valid(self):
        if not self.is_verified():
            return False
        if self.download_expires_at and self.download_expires_at < timezone.now():
            return False
        return True
