from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Permission class for Admin role"""
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )


class IsManager(permissions.BasePermission):
    """Permission class for Manager role"""
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'manager'
        )


class IsEmployee(permissions.BasePermission):
    """Permission class for Employee role"""
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'employee'
        )


class IsManagerOrAdmin(permissions.BasePermission):
    """Permission class for Manager or Admin roles"""
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['manager', 'admin']
        )