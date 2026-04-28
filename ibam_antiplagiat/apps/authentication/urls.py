from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import AuthViewSet

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', AuthViewSet.as_view({'get': 'me'}), name='auth_me'),
    path('dashboard/', AuthViewSet.as_view({'get': 'dashboard'}), name='auth_dashboard'),
]
