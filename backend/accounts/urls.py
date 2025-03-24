from django.urls import path
from .views import SignupView, AvatarView, UserProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('avatar/<int:user_id>/', AvatarView.as_view(), name='avatar-view'),
    path('user/<str:username>/', UserProfileView.as_view(), name='user-profile'),
]
