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
    
    def get(self, request, pk=None):
        if pk:
            company = Company.objects.get(id=pk)
            serializer = self.serializer_class(company, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            companies = Company.objects.all()
            serializer = self.serializer_class(companies, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        
class DepartmentListView(APIView):
    """View for listing departments - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = DepartmentSerializer
    
    def get(self, request, pk=None):
        if pk:
            department = Department.objects.get(id=pk)
            serializer = self.serializer_class(department, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            departments = Department.objects.all()
            serializer = self.serializer_class(departments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        
