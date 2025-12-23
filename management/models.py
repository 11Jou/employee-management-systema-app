from django.db import models
from authentication.models import User
from datetime import date
from django.core.validators import RegexValidator
from django.db.models.signals import post_save
from django.dispatch import receiver



class Company(models.Model):
    name = models.CharField(max_length=255)
    
    
    class Meta:
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'

    
    def __str__(self):
        return self.name
    
    

class Department(models.Model):
    name = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='departments')
    
    class Meta:
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
    
    def __str__(self):
        return self.name
    
    


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
    employee_name = models.CharField(max_length=255)
    employee_email = models.EmailField(max_length=255)
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
    
    
@receiver(post_save, sender=Employee)
def update_employee_fields(sender, instance, created, **kwargs):
    updated_fields = []

    if instance.status == 'hired' and instance.hired_date is None:
        instance.hired_date = date.today()
        updated_fields.append('hired_date')

    if instance.hired_date:
        calculated_days = instance.calculate_day_employee()
        if instance.day_employee != calculated_days:
            instance.day_employee = calculated_days
            updated_fields.append('day_employee')

    if updated_fields:
        instance.save(update_fields=updated_fields)
        
        
        
        
        
        