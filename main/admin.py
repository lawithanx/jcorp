from django.contrib import admin
from .models import Project, ProjectImage, Partner, Payment


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


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_hash_short', 'from_address_short', 'amount_eth', 'status', 'confirmations', 'created_at']
    list_filter = ['status', 'network', 'created_at']
    search_fields = ['transaction_hash', 'from_address', 'to_address']
    readonly_fields = ['transaction_hash', 'from_address', 'to_address', 'amount_wei', 'amount_eth', 'network', 
                      'confirmations', 'created_at', 'updated_at', 'verified_at', 'download_token', 'download_expires_at']
    fieldsets = (
        ('Transaction Details', {
            'fields': ('transaction_hash', 'from_address', 'to_address', 'network')
        }),
        ('Payment Information', {
            'fields': ('amount_wei', 'amount_eth', 'status', 'confirmations', 'required_confirmations')
        }),
        ('Download', {
            'fields': ('download_token', 'download_expires_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'verified_at')
        }),
    )
    
    def transaction_hash_short(self, obj):
        return f"{obj.transaction_hash[:10]}...{obj.transaction_hash[-8:]}" if obj.transaction_hash else "-"
    transaction_hash_short.short_description = 'Transaction Hash'
    
    def from_address_short(self, obj):
        return f"{obj.from_address[:8]}...{obj.from_address[-6:]}" if obj.from_address else "-"
    from_address_short.short_description = 'From Address'
