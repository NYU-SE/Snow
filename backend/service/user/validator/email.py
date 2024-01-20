from django.core.validators import validate_email as email_validator
from django.core.exceptions import ValidationError
from dao.models import User
from .common import validate_value

email_validators = [email_validator]

def validate_email(email):
    validate_value(email, validators=email_validators) 
    try:
        existing = User.objects.get(auth__email=email)
        if existing:
            raise ValidationError(f"Email {email} has been used.")
    except User.DoesNotExist:
        return
