from django.contrib import admin
from .models import Project, ProjectImage, Partner


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'classification', 'project_type', 'created_date', 'is_active']
    list_filter = ['classification', 'project_type', 'is_active', 'created_date']
    search_fields = ['title', 'description', 'technologies']
    list_editable = ['is_active']
    inlines = [ProjectImageInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'classification', 'description', 'project_type')
        }),
        ('Technical Details', {
            'fields': ('technologies', 'github_url', 'live_url')
        }),
        ('Media', {
            'fields': ('featured_image',)
        }),
        ('Documentation', {
            'fields': ('white_paper', 'specifications')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ['project', 'order', 'caption']
    list_filter = ['project']
    ordering = ['project', 'order']


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'created_date', 'is_active']
    list_filter = ['is_active', 'created_date']
    search_fields = ['name', 'description']
    list_editable = ['is_active', 'order']
    fieldsets = (
        ('Agent Information', {
            'fields': ('name', 'description', 'profile_picture')
        }),
        ('Display', {
            'fields': ('order', 'is_active')
        }),
    )
