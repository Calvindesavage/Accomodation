"""
Custom context processor for Django admin to add additional variables
"""
import django
import sys


def admin_context(request):
    """
    Add Django and Python version information to admin templates
    """
    return {
        'django_version': django.get_version(),
        'python_version': f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
    }

