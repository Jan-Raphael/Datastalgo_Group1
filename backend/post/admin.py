from django.contrib import admin
from .models import Post, Attachment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'contentType', 'created_at')
    search_fields = ('title', 'tags', 'user__username')
    list_filter = ('contentType',)

@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('post', 'file')
