from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from project.permission import IsManagerOrAdmin
from .serializers import *


class CompanyListView(APIView):
    """View for listing companies - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = CompanySerializer
    
    def get(self, request):
        companies = Company.objects.all()
        serializer = self.serializer_class(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)