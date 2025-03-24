from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from accounts.models import CustomUser
from .serializers import PostSerializer, PostCreateSerializer
from rest_framework.parsers import JSONParser
import json

class PostListView(APIView):
    def get(self, request):
        posts = Post.objects.all().order_by('-id')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

class UpvotePostView(APIView):
    def post(self, request, post_id):
        print("=== UPVOTE REQUEST ===")
        print("Post ID:", post_id)

        try:
            raw_data = request.body.decode('utf-8')
            data = json.loads(raw_data)
            print("Parsed Data:", data)

            user_id = data.get('userId')
            if not user_id:
                return Response({'error': 'Missing userId'}, status=400)

            user = CustomUser.objects.get(id=user_id)
            post = Post.objects.get(id=post_id)

            post.downvotes.remove(user)
            post.upvotes.add(user)

            serializer = PostSerializer(post)
            return Response(serializer.data)

        except Exception as e:
            print("❌ Upvote error:", e)
            return Response({'error': str(e)}, status=400)


class DownvotePostView(APIView):
    parser_classes = [JSONParser]  # 👈 also apply here

    def post(self, request, post_id):
        print("=== DOWNVOTE REQUEST ===")
        print("Post ID:", post_id)
        print("Request Data:", request.data)

        try:
            user_id = request.data.get('userId')
            if not user_id:
                return Response({'error': 'Missing userId'}, status=400)

            user = CustomUser.objects.get(id=user_id)
            post = Post.objects.get(id=post_id)

            post.upvotes.remove(user)
            post.downvotes.add(user)

            serializer = PostSerializer(post)
            return Response(serializer.data)

        except Exception as e:
            print("❌ Downvote error:", e)
            return Response({'error': str(e)}, status=400)


from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

class PublishPostView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        print("========== POST PUBLISH ==========")
        print("Incoming data:", request.data)

        username = request.data.get("username")
        if not username:
            return Response({"error": "Missing username"}, status=400)

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid username"}, status=400)

        serializer = PostCreateSerializer(data=request.data, context={'user': user})
        if serializer.is_valid():
            post = serializer.save()
            return Response({"message": "Post created", "id": post.id}, status=201)
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=400)

class UserPostsView(APIView):
    def get(self, request, user_id):
        posts = Post.objects.filter(user_id=user_id)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

# posts/views.py
class PurchasePostView(APIView):
    def post(self, request, post_id, author_name, buyer_username):
        try:
            buyer = CustomUser.objects.get(username=buyer_username)
            post = Post.objects.get(id=post_id)
            if buyer in post.purchase.all():
                return Response({'message': 'Already purchased'}, status=200)
            
            if buyer.balance < post.price:
                return Response({'message': 'Insufficient balance'}, status=402)

            # Deduct and add balance (optional logic)
            buyer.balance -= post.price
            buyer.save()
            post.purchase.add(buyer)

            serializer = PostSerializer(post)
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({'error': str(e)}, status=400)
