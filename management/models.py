from django.db import models
from authentication.models import User
from datetime import date
from django.core.validators import RegexValidator



class Company(models.Model):
    name = models.CharField(max_length=255)
    number_of_department = models.IntegerField(default=0)
    number_of_employee = models.IntegerField(default=0)
    
    
    class Meta:
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'

    
    def __str__(self):
        return self.name
    
    def calculate_number_of_department(self):
        return self.departments.count()
    
    def calculate_number_of_employee(self):
        return self.employees.count()
    
    

class Department(models.Model):
    name = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='departments')
    number_of_employee = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
    
    def __str__(self):
        return self.name
    
    def calculate_number_of_employee(self):
        return self.employees.count()
    
    


EmployeeStatus = [
    ('application_received', 'Application Received'),
    ('interview_scheduled', 'Interview Scheduled'),
    ('hired', 'Hired'),
    ('not_accepted', 'Not Accepted Yet'),
]


class Employee(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='employees')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    status = models.CharField(max_length=255, choices=EmployeeStatus, default='application_received')
    employee_name = models.CharField(max_length=255, blank=True, null=True)
    employee_email = models.EmailField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=17, validators=[RegexValidator(regex=r'^\+?1?\d{8,15}$')])
    address = models.TextField()
    designation = models.CharField(max_length=255)
    hired_date = models.DateField(blank=True, null=True)
    day_employee = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'
        
    def __str__(self):
        return self.employee_name
    
    
    def calculate_day_employee(self):
        if self.hired_date:
            return (date.today() - self.hired_date).days
        return 0
        