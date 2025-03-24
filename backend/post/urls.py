from django.urls import path
from .views import PostListView, UpvotePostView, DownvotePostView, PublishPostView, UserPostsView, PurchasePostView

urlpatterns = [
    path('', PostListView.as_view(), name='post-list'),
    path('<int:post_id>/upvote/', UpvotePostView.as_view(), name='post-upvote'),
    path('<int:post_id>/downvote/', DownvotePostView.as_view(), name='post-downvote'),
    path('publish/', PublishPostView.as_view(), name='post-publish'),
    path('user/<int:user_id>/', UserPostsView.as_view(), name='user-posts'),
    path('purchase/<int:post_id>/<str:author_name>/<str:buyer_username>/', PurchasePostView.as_view(), name='post-purchase'),

]
