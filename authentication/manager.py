from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email


class UserManager(BaseUserManager):
    
    def validate_email(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError('Invalid email address')
    
    
    def create_user(self, email, name, role='employee', password=None, **extra_fields):
        if email:
            email = self.normalize_email(email)
            self.validate_email(email)
        else:
            raise ValueError('The Email field must be set')
        user = self.model(email=email, name=name, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    
    
    def create_superuser(self, email, name, password, **extra_fields):
        """
        Create a superuser with admin role.
        Sets is_staff and is_superuser for Django admin access.
        """
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True) 
        
        user = self.create_user(email, name, role='admin', password=password, **extra_fields)
        user.save(using=self._db)
        
        return user