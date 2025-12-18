from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
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
    
    def save(self, *args, **kwargs):
        self.number_of_department = self.calculate_number_of_department()
        self.number_of_employee = self.calculate_number_of_employee()
        super().save(*args, **kwargs)
    

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
    
    def save(self, *args, **kwargs):
        # Calculate and store the employee count
        self.number_of_employee = self.calculate_number_of_employee()
        super().save(*args, **kwargs)
    


EmployeeStatus = [
    ('application_received', 'Application Received'),
    ('interview_scheduled', 'Interview Scheduled'),
    ('hired', 'Hired'),
    ('not_accepted', 'Not Accepted Yet'),
]


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='employees')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    status = models.CharField(max_length=255, choices=EmployeeStatus, default='application_received')
    phone_number = models.CharField(max_length=17, validators=[RegexValidator(regex=r'^\+?1?\d{8,15}$')])
    address = models.TextField()
    designation = models.CharField(max_length=255)
    hired_date = models.DateField(blank=True, null=True)
    day_employee = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'
    
    
    
    def __str__(self):
        return self.user.email
    
    def calculate_day_employee(self):
        if self.hired_date:
            return (date.today() - self.hired_date).days
        return 0
    
    def save(self, *args, **kwargs):
        self.day_employee = self.calculate_day_employee()
        super().save(*args, **kwargs)


@receiver(post_save, sender=Employee)
def update_counts_on_employee_save(sender, instance, **kwargs):
    """Update Department and Company employee counts when Employee is saved"""
    if instance.department:
        instance.department.number_of_employee = instance.department.calculate_number_of_employee()
        instance.department.save(update_fields=['number_of_employee'])
    
    if instance.company:
        instance.company.number_of_employee = instance.company.calculate_number_of_employee()
        instance.company.number_of_department = instance.company.calculate_number_of_department()
        instance.company.save(update_fields=['number_of_employee', 'number_of_department'])


@receiver(post_delete, sender=Employee)
def update_counts_on_employee_delete(sender, instance, **kwargs):
    """Update Department and Company employee counts when Employee is deleted"""
    if instance.department:
        instance.department.number_of_employee = instance.department.calculate_number_of_employee()
        instance.department.save(update_fields=['number_of_employee'])
    
    if instance.company:
        instance.company.number_of_employee = instance.company.calculate_number_of_employee()
        instance.company.number_of_department = instance.company.calculate_number_of_department()
        instance.company.save(update_fields=['number_of_employee', 'number_of_department'])


@receiver(post_save, sender=Department)
def update_company_on_department_save(sender, instance, **kwargs):
    """Update Company department count when Department is saved"""
    if instance.company:
        instance.company.number_of_department = instance.company.calculate_number_of_department()
        instance.company.save(update_fields=['number_of_department'])


@receiver(post_delete, sender=Department)
def update_company_on_department_delete(sender, instance, **kwargs):
    """Update Company department count when Department is deleted"""
    if instance.company:
        instance.company.number_of_department = instance.company.calculate_number_of_department()
        instance.company.save(update_fields=['number_of_department'])
        