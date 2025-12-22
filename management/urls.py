from django.urls import path
from .views import *

urlpatterns = [
    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('companies/all/', CompanyListAllView.as_view(), name='company-list-all'),
    path('companies/<int:pk>/', CompanyDetailView.as_view(), name='company-detail'),
    
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    path('departments/all/', DepartmentListAllView.as_view(), name='department-list-all'),
    path('departments/<int:pk>/', DepartmentDetailView.as_view(), name='department-detail'),
    
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('employees/hired/', EmployeeHiredListView.as_view(), name='employee-hired-list'),
    path('employees/<int:pk>/', EmployeeDetailView.as_view(), name='employee-detail'),
    
    path('employees/create/', EmployeeCreateView.as_view(), name='employee-create'),
    path('employees/update/<int:pk>/', EmployeeUpdateView.as_view(), name='employee-update'),
    
    path('employees/delete/<int:pk>/', EmployeeDeleteView.as_view(), name='employee-delete'),
    path('employees/status/<int:pk>/', UpdateEmployeeStatusView.as_view(), name='employee-status-update'),
    
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('user-accounts/', UserAccountListView.as_view(), name='user-account-list'),
    
]
    
