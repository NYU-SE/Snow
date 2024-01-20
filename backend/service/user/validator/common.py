def validate_value(value, validators):
    for validate in validators:
        validate(value)
