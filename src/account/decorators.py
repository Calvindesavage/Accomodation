from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse


def role_required(allowed_roles):
    """
    Decorator to check if user has one of the allowed roles.
    Usage: @role_required(['ADMIN', 'LANDLORD'])
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'Authentication required'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            if request.user.role not in allowed_roles:
                return Response(
                    {'error': f'Access denied. Required roles: {", ".join(allowed_roles)}'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def admin_required(view_func):
    """
    Decorator to check if user is an Admin.
    Usage: @admin_required
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not request.user.is_role_admin():
            return Response(
                {'error': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return view_func(request, *args, **kwargs)
    return wrapper


def landlord_required(view_func):
    """
    Decorator to check if user is a Landlord or Admin.
    Usage: @landlord_required
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not (request.user.is_role_landlord() or request.user.is_role_admin()):
            return Response(
                {'error': 'Landlord or Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return view_func(request, *args, **kwargs)
    return wrapper


def user_required(view_func):
    """
    Decorator to check if user is a regular User.
    Usage: @user_required
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return view_func(request, *args, **kwargs)
    return wrapper

