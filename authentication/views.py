from django.shortcuts import render
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


class CustomObtainPairView(TokenObtainPairView):
    serializer_class = CustomObtainPairSerializer
    
    
class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer
    
    