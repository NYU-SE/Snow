import functools
from json import loads, JSONDecodeError
from schema import SchemaError
from django.views.decorators.http import require_GET, require_POST

from service.session import get_current_user

from .responses import client_error

def require_auth(func):
    @functools.wraps(func)
    def wrapper(request, *args, **kwargs):
        user = get_current_user(request) 
        if user is None:
            return client_error('NO_AUTH')

        request.user = user
        return func(request, *args, **kwargs)

    return wrapper

def api_path(path):
    def decorator(func):
        func.api_path = path
        return func

    return decorator

def get(path):
    def decorator(func):
        @functools.wraps(func)
        @require_GET
        @api_path(path)
        def wrapper(request, *args, **kwargs):
            request.payload = request.GET.dict()
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def post(path):
    def decorator(func):
        @functools.wraps(func)
        @require_POST
        @api_path(path)
        def wrapper(request, *args, **kwargs):
            try:
                if request.body:
                    request.payload = loads(request.body)
                else:
                    request.payload = {}
            except JSONDecodeError:
                return client_error('MALFORMED_PAYLOAD')
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def contract(schema):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(request, *args, **kwargs):
            if hasattr(request, 'payload'):
                try:
                    request.payload = schema.validate(request.payload)
                except SchemaError:
                    return client_error('INVALID_PARAM')
            return func(request, *args, **kwargs)
        return wrapper
    return decorator
