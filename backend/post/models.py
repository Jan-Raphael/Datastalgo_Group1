from django.db import models
from django.conf import settings

class Post(models.Model):
    CONTENT_CHOICES = (
        (0, 'Free'),
        (1, 'Subscription'),
        (2, 'Premium'),
    )

    title = models.CharField(max_length=255)
    tags = models.CharField(max_length=255)
    contentType = models.IntegerField(choices=CONTENT_CHOICES, default=0)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='upvoted_posts', blank=True)
    downvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='downvoted_posts', blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    purchase = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='purchased_posts', blank=True)

    def __str__(self):
        return self.title

class Attachment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='attachments/')