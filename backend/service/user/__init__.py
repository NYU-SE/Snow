from django.contrib.auth import authenticate as _authenticate
from django.contrib.auth.models import User as AuthUser
from django.db.models import Q

from dao.models import User
from .validator import validate_email, validate_username, validate_password

def signup(email, username, password):
    validate_email(email)
    validate_username(username)
    validate_password(password)

    auth_user = AuthUser.objects.create_user(
        email = email,
        username = username,
        password = password
    )
    new_user = User.objects.create(
        auth = auth_user,
        nickname = username
    )
    new_user.save()

    return new_user

def authenticate(username, password):
    auth_user = _authenticate(username=username, password=password)
    if auth_user is None:
        return None
    try:
        return User.objects.get(auth=auth_user)
    except User.DoesNotExist:
        return None

def get(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

def search(keyword):
    return User.objects.filter(Q(username__icontains=keyword)|Q(nickname__icontains=keyword))

def get_trending_users(current_user):
    # Not implementing any algorithm now, just return latest users
    return User.objects.all().order_by("-creation_date")[0:5]
