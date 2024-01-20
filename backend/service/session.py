from dao.models import User

USER_SESSION_KEY = 'current_user_id'

def set_current_user(request, user):
    request.session[USER_SESSION_KEY] = user.id

def remove_current_user(request):
    if USER_SESSION_KEY in request.session:
        del request.session[USER_SESSION_KEY]

def get_current_user(request):
    if USER_SESSION_KEY in request.session:
        try:
            return User.objects.get(id=request.session[USER_SESSION_KEY])
        except User.DoesNotExist:
            return None
    else:
        return None
