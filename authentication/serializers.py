from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer


class CustomObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['name'] = user.name
        token['role'] = user.role  # Use custom role field
        return token
    
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
            refresh = self.get_token(self.user)
            data['refresh'] = str(refresh)
            data['access'] = str(refresh.access_token)
            return data
        except Exception as e:
            raise serializers.ValidationError(e)
        
        
class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
            refresh = self.get_token(self.user)
            data['refresh'] = str(refresh)
            data['access'] = str(refresh.access_token)
            return data
        except Exception as e:
            raise serializers.ValidationError(e)