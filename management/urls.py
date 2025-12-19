from django.urls import path
from .views import CompanyListView, DepartmentListView

urlpatterns = [
    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('companies/<int:pk>/', CompanyListView.as_view(), name='company-detail'),
    
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    path('departments/<int:pk>/', DepartmentListView.as_view(), name='department-detail'),
]