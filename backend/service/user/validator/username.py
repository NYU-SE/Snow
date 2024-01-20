from django.core.validators import validate_slug, MinLengthValidator, MaxLengthValidator
from django.core.exceptions import ValidationError
from dao.models import User
from .common import validate_value

username_validators = [MinLengthValidator(3), MaxLengthValidator(120), validate_slug]

def validate_username(username):
    validate_value(username, validators=username_validators)
    try:
        existing = User.objects.get(auth__username=username)
        if existing:
            raise ValidationError(f"Username {username} has been used.")
    except User.DoesNotExist:
        return
