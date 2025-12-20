from rest_framework import serializers
from .models import *
from authentication.models import User, UserRole



class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        
        
        
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
        
        
class EmployeeSerializer(serializers.ModelSerializer):
    
    def validate(self, attrs):
        """
        Validate that the department belongs to the specified company.
        Handles both create and update scenarios.
        """
        company = attrs.get('company')
        department = attrs.get('department')
        
        # Validate the relationship
        if company and department:
            if department.company != company:
                raise serializers.ValidationError({
                    'department': 'The department must belong to the specified company.'
                })
        
        return attrs
    
    class Meta:
        model = Employee
        fields = '__all__'