"""
Swagger/OpenAPI documentation schemas for Management API endpoints.
"""
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from management.serializers import EmployeeUpdateCreateSerializer


# Swagger decorators for Employee endpoints

employee_create_schema = swagger_auto_schema(
    operation_summary="Create a new employee",
    operation_description="Create a new employee. The department must belong to the specified company.",
    request_body=EmployeeUpdateCreateSerializer,
    responses={
        201: openapi.Response(description="Employee created successfully"),
        400: openapi.Response(description="Validation error"),
    },
    security=[{'Bearer': []}]
)

employee_update_schema = swagger_auto_schema(
    operation_summary="Update an existing employee",
    operation_description="Update an existing employee by ID. Partial updates are supported.",
    request_body=EmployeeUpdateCreateSerializer,
    responses={
        200: openapi.Response(description="Employee updated successfully"),
        400: openapi.Response(description="Validation error"),
        404: openapi.Response(description="Employee not found"),
    },
    security=[{'Bearer': []}]
)

