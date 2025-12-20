from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from project.permission import IsManagerOrAdmin
from .serializers import *
from authentication.models import User
from django.db import transaction


class CompanyListView(APIView):
    """View for listing companies - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = CompanySerializer
    
    def get(self, request, pk=None):
        if pk:
            try:
                company = Company.objects.get(id=pk)
                serializer = self.serializer_class(company, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Company.DoesNotExist:
                return Response(
                    {'error': 'Company not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
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
            try:
                department = Department.objects.get(id=pk)
                serializer = self.serializer_class(department, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Department.DoesNotExist:
                return Response(
                    {'error': 'Department not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            departments = Department.objects.all()
            serializer = self.serializer_class(departments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        
class EmployeeListView(APIView):
    """View for listing employees - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeSerializer
    
    def get(self, request, pk=None):
        if pk:
            try:
                employee = Employee.objects.get(id=pk)
                serializer = self.serializer_class(employee, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Employee.DoesNotExist:
                return Response(
                    {'error': 'Employee not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            employees = Employee.objects.all()
            serializer = self.serializer_class(employees, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        

class EmployeeCreateView(APIView):
    """View for creating employees - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

class EmployeeUpdateView(APIView):
    """View for updating employees - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeSerializer
    
    def patch(self, request, pk):
        try:
            with transaction.atomic():
                employee = Employee.objects.select_for_update().get(id=pk)
                serializer = self.serializer_class(employee, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    
class EmployeeDeleteView(APIView):
    """View for deleting employees - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeSerializer
    
    def delete(self, request, pk):
        try:
            with transaction.atomic():
                employee = Employee.objects.select_for_update().get(id=pk)
                employee.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee not found'},
                status=status.HTTP_404_NOT_FOUND
            )
