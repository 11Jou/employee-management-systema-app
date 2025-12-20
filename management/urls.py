from django.urls import path
from .views import *

urlpatterns = [
    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('companies/<int:pk>/', CompanyListView.as_view(), name='company-detail'),
    
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    path('departments/<int:pk>/', DepartmentListView.as_view(), name='department-detail'),
    
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('employees/<int:pk>/', EmployeeListView.as_view(), name='employee-detail'),
    
    path('employees/create/', EmployeeCreateView.as_view(), name='employee-create'),
    path('employees/update/<int:pk>/', EmployeeUpdateView.as_view(), name='employee-update'),
    
    path('employees/delete/<int:pk>/', EmployeeDeleteView.as_view(), name='employee-delete'),
    
]
    
