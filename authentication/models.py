from django.contrib.auth.models import AbstractUser
from django.db import models
from .manager import UserManager


class User(AbstractUser):
    username = None  # remove username field

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self):
        return self.email
