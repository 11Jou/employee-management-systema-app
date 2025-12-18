from django.contrib.auth.models import AbstractUser
from django.db import models
from .manager import UserManager


UserRole = [
    ('admin', 'Admin'),
    ('manager', 'Manager'),
    ('employee', 'Employee'),
]

class User(AbstractUser):
    username = None 
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, choices=UserRole, default='employee')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self):
        return self.email
