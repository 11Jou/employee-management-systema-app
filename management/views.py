from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from project.permission import IsManagerOrAdmin, IsAdmin
from .serializers import *
from django.db import transaction
from core.utils import CustomResponse
from core.swagger_docs import employee_create_schema, employee_update_schema
from core.paginate import GlobalPagination
import logging


logger = logging.getLogger(__name__)

class CompanyListView(ListAPIView):
    """View for listing companies - accessible by Manager or Admin"""
    
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    pagination_class = GlobalPagination
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return CustomResponse.success(
            data=response.data,
            message="Companies retrieved successfully"
        )
        
class CompanyListAllView(ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return CustomResponse.success(
            data=response.data,
            message="Companies retrieved successfully"
        )

    
    
class CompanyDetailView(RetrieveAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)

        return CustomResponse.success(
            data=response.data,
            message="Company retrieved successfully"
        )

    
        
        
class DepartmentListView(ListAPIView):
    """View for listing departments - accessible by Manager or Admin"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    pagination_class = GlobalPagination
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return CustomResponse.success(
            data=response.data,
            message="Departments retrieved successfully"
        )
        

class DepartmentListAllView(ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return CustomResponse.success(
            data=response.data,
            message="Departments retrieved successfully"
        )

class DepartmentDetailView(RetrieveAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)

        return CustomResponse.success(
            data=response.data,
            message="Department retrieved successfully"
        )
        
class EmployeeListView(ListAPIView):
    """View for listing employees - accessible by Manager or Admin"""
    queryset = Employee.objects.all()
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeSerializer
    pagination_class = GlobalPagination
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return CustomResponse.success(
            data=response.data,
            message="Employees retrieved successfully"
        )
        

class EmployeeDetailView(RetrieveAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)

        return CustomResponse.success(
            data=response.data,
            message="Employee retrieved successfully"
        )

    
        
        

class EmployeeCreateView(APIView):
    """View for creating employees - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeUpdateCreateSerializer
    
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
    serializer_class = EmployeeUpdateCreateSerializer
    
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
    serializer_class = EmployeeUpdateCreateSerializer
    
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
        
        
class DashboardView(APIView):
    """View for dashboard - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    
    def get(self, request):
        try:
            companies = Company.objects.all().count()
            departments = Department.objects.all().count()
            employees = Employee.objects.all().count()
            return CustomResponse.success(
                data={
                    "total_companies": companies,
                    "total_departments": departments,
                    "total_employees": employees
                },
                message="Dashboard retrieved successfully"
            )
        except Exception as e:
            return CustomResponse.error(
                errors={'error': str(e)},
                message="Failed to retrieve dashboard"
            )
        
class UpdateEmployeeStatusView(APIView):
    """View for updating employee status - accessible by Manager or Admin"""
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    serializer_class = EmployeeSerializer
    
    def post(self, request, pk):
        try:
            with transaction.atomic():
                employee = Employee.objects.select_for_update().get(id=pk)
                new_status = request.data.get('status')
                
                if not new_status:
                    return CustomResponse.error(
                        errors={'status': 'Status is required'},
                        message="Status field is required"
                    )
                
                employee.status = new_status
                employee.save()
                
                serializer = self.serializer_class(employee, context={'request': request})
                return CustomResponse.success(
                    data=serializer.data,
                    message="Employee status updated successfully"
                )
        except Employee.DoesNotExist:
            return CustomResponse.not_found(message="Employee not found")
        
        
        
class EmployeeHiredListView(ListAPIView):
    queryset = Employee.objects.filter(status='hired')
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    pagination_class = GlobalPagination
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return CustomResponse.success(
            data=response.data,
            message="Hired employees retrieved successfully"
        )
        
        
class UserAccountListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = GlobalPagination
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return CustomResponse.success(
            data=response.data,
            message="User accounts retrieved successfully"
        )
