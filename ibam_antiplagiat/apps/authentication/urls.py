from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from .views import AuthViewSet, CustomTokenObtainPairView

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', AuthViewSet.as_view({'get': 'me'}), name='auth_me'),
    path('dashboard/', AuthViewSet.as_view({'get': 'dashboard'}), name='auth_dashboard'),
]
