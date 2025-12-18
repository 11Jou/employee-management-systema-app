from django.db import models
from authentication.models import User
from datetime import datetime



class Compnany(models.Model):
    name = models.CharField(max_length=255)
    number_of_department = models.IntegerField(default=0)
    number_of_employee = models.IntegerField(default=0)

    
    def __str__(self):
        return self.name
    
    def calculate_number_of_department(self):
        return self.department_set.count()
    
    def calculate_number_of_employee(self):
        return self.employee_set.count()
    
    

class Department(models.Model):
    name = models.CharField(max_length=255)
    company = models.ForeignKey(Compnany, on_delete=models.CASCADE)
    number_of_employee = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    def calculate_number_of_employee(self):
        return self.employee_set.count()
    




class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Compnany, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=255)
    address = models.TextField()
    designation = models.CharField(max_length=255)
    hired_date = models.DateField(blank=True, null=True)
    day_employee = models.IntegerField(default=0)
    
    
    
    def __str__(self):
        return self.user.email
    
    def calculate_day_employee(self):
        if self.hired_date:
            return (datetime.now() - self.hired_date).days
        return 0
