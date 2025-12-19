from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from authentication.models import User
from .models import Employee, Department, Company

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