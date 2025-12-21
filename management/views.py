from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from project.permission import IsManagerOrAdmin
from .serializers import *
from authentication.models import User
from django.db import transaction
from core.utils import CustomResponse
from core.swagger_docs import employee_create_schema, employee_update_schema


class CompanyListView(APIView):
    """View for listing companies - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = CompanySerializer
    
    def get(self, request, pk=None):
        if pk:
            try:
                company = Company.objects.get(id=pk)
                serializer = self.serializer_class(company, context={'request': request})
                return CustomResponse.success(
                    data=serializer.data,
                    message="Company retrieved successfully"
                )
            except Company.DoesNotExist:
                return CustomResponse.not_found(message="Company not found")
        else:
            companies = Company.objects.all()
            serializer = self.serializer_class(companies, many=True)
            return CustomResponse.success(
                data=serializer.data,
                message="Companies retrieved successfully"
            )
        
        
class DepartmentListView(APIView):
    """View for listing departments - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = DepartmentSerializer
    
    def get(self, request, pk=None):
        if pk:
            try:
                department = Department.objects.get(id=pk)
                serializer = self.serializer_class(department, context={'request': request})
                return CustomResponse.success(
                    data=serializer.data,
                    message="Department retrieved successfully"
                )
            except Department.DoesNotExist:
                return CustomResponse.not_found(message="Department not found")
        else:
            departments = Department.objects.all()
            serializer = self.serializer_class(departments, many=True)
            return CustomResponse.success(
                data=serializer.data,
                message="Departments retrieved successfully"
            )
        
        
class EmployeeListView(APIView):
    """View for listing employees - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeSerializer
    
    def get(self, request, pk=None):
        if pk:
            try:
                employee = Employee.objects.get(id=pk)
                serializer = self.serializer_class(employee, context={'request': request})
                return CustomResponse.success(
                    data=serializer.data,
                    message="Employee retrieved successfully"
                )
            except Employee.DoesNotExist:
                return CustomResponse.not_found(message="Employee not found")
        else:
            employees = Employee.objects.all()
            serializer = self.serializer_class(employees, many=True)
            return CustomResponse.success(
                data=serializer.data,
                message="Employees retrieved successfully"
            )
        
        

class EmployeeCreateView(APIView):
    """View for creating employees - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeSerializer
    
    @employee_create_schema
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return CustomResponse.created(
                data=serializer.data,
                message="Employee created successfully"
            )
        return CustomResponse.error(
            errors=serializer.errors,
            message="Failed to create employee"
        )
        
        

class EmployeeUpdateView(APIView):
    """View for updating employees - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeUpdateSerializer
    
    @employee_update_schema
    def patch(self, request, pk):
        try:
            with transaction.atomic():
                employee = Employee.objects.select_for_update().get(id=pk)
                serializer = self.serializer_class(employee, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return CustomResponse.success(
                        data=serializer.data,
                        message="Employee updated successfully"
                    )
                print(serializer.errors)
                return CustomResponse.error(
                    errors=serializer.errors,
                    message="Failed to update employee"
                )
        except Employee.DoesNotExist:
            return CustomResponse.not_found(message="Employee not found")
    
    
class EmployeeDeleteView(APIView):
    """View for deleting employees - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeSerializer
    
    def delete(self, request, pk):
        try:
            with transaction.atomic():
                employee = Employee.objects.select_for_update().get(id=pk)
                employee.delete()
                return CustomResponse.success(
                data=None,
                message="Employee deleted successfully"
            )
        except Employee.DoesNotExist:
            return CustomResponse.not_found(message="Employee not found")
