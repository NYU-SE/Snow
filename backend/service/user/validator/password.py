from django.contrib.auth.password_validation import validate_password as _validate_password
from django.contrib.auth.password_validation import (
        UserAttributeSimilarityValidator,
        MinimumLengthValidator,
        CommonPasswordValidator,
        NumericPasswordValidator
    )

# TODO: slide: comparison with original if-else code

password_validators = [
    MinimumLengthValidator(8),
    NumericPasswordValidator(),
    UserAttributeSimilarityValidator(),
    CommonPasswordValidator()
]

def validate_password(password):
    _validate_password(password, password_validators=password_validators)
