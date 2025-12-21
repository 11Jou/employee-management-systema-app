from rest_framework import serializers
from .models import *
from authentication.models import User, UserRole


        
class DepartmentSerializer(serializers.ModelSerializer):
    number_of_employee = serializers.SerializerMethodField()
    
    def get_number_of_employee(self, obj):
        return obj.employees.count()
    
    class Meta:
        model = Department
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    number_of_department = serializers.SerializerMethodField()
    number_of_employee = serializers.SerializerMethodField()


    
    def get_number_of_department(self, obj):
        return obj.departments.count()
    
    
    def get_number_of_employee(self, obj):
        return obj.employees.count()
    
    class Meta:
        model = Company
        fields = '__all__'
        
        
        
class EmployeeSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    department = DepartmentSerializer()
    
    class Meta:
        model = Employee
        fields = '__all__'
        
class EmployeeUpdateSerializer(serializers.ModelSerializer):
    
    def validate(self, attrs):
        """
        Validate that the department belongs to the specified company.
        Handles both create and update scenarios.
        """
        company = attrs.get('company')
        department = attrs.get('department')
        
        if company and department:
            if department.company != company:
                raise serializers.ValidationError({
                    'department': 'The department must belong to the specified company.'
                })
        
        return attrs
    
    class Meta:
        model = Employee
        fields = '__all__'