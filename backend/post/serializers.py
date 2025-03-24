from rest_framework import serializers
from .models import Post, Attachment

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['file']

class PostSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    userId = serializers.IntegerField(source='user.id')
    isSubscribed = serializers.SerializerMethodField()
    purchase = serializers.SerializerMethodField()
    upvotes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    downvotes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
    'id', 'title', 'tags', 'description', 'contentType', 'price',
    'created_at', 'userId', 'username',
    'upvotes', 'downvotes', 'isSubscribed', 'purchase',
    'attachments' 
]
    def get_username(self, obj):
        return obj.user.username if obj.user else "Anonymous"

    def get_isSubscribed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user.subscribers.filter(id=request.user.id).exists()
        return False

    def get_purchase(self, obj):
        return [user.id for user in obj.purchase.all()]


class PostCreateSerializer(serializers.ModelSerializer):
    attachments = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )

    class Meta:
        model = Post
        fields = ['title', 'tags', 'description', 'contentType', 'price', 'attachments']

    def create(self, validated_data):
        attachments = validated_data.pop('attachments', [])
        user = self.context['user']
        post = Post.objects.create(user=user, **validated_data)

        for file in attachments:
            Attachment.objects.create(post=post, file=file)

        return post
