from django.core.exceptions import ValidationError
from schema import Schema, Use, Optional
from api.decorators import get, post, contract, require_auth
from api.responses import success, client_error
import service.user
import service.session
import service.file

API_PREFIX="user/"

@post("signup")
@contract(Schema({'email': str, 'username': str, 'password': str}))
def signup(request):
    p = request.payload
    try:
        new_user = service.user.signup(p['email'], p['username'], p['password'])
        service.session.set_current_user(request, new_user)
        return success(new_user)
    except ValidationError as e:
        return client_error('INVALID_CREDENTIALS', e.messages)

@post("login")
@contract(Schema({'username': str, 'password': str}))
def login(request):
    p = request.payload

    user = service.user.authenticate(p['username'], p['password'])
    if user is None:
        return client_error('INVALID_CREDENTIALS')

    service.session.set_current_user(request, user)
    return success(user)

@get("")
@contract(Schema({'id': Use(int)}))
def get_user(request):
    target = service.user.get(request.payload['id'])
    if target is None:
        return client_error('INVALID_PARAM', "No such user.")
    return success(target)

@require_auth
@post("logout")
def logout(request):
    service.session.remove_current_user(request)
    return success({})

@require_auth
@get("current")
def current(request):
    return success(request.user)

@require_auth
@post("follow")
@contract(Schema({'followee': int}))
def follow(request):
    followee = service.user.get(request.payload['followee'])
    if followee is None:
        return client_error('INVALID_PARAM', "No such user.")
    request.user.follow(followee)
    return success(request.payload)

@require_auth
@post("unfollow")
@contract(Schema({'followee': int}))
def unfollow(request):
    followee = service.user.get(request.payload['followee'])
    if followee is None:
        return client_error('INVALID_PARAM', "No such user.")
    request.user.unfollow(followee)
    return success(request.payload)

@require_auth
@post("profile/update")
@contract(Schema({'nickname': str, 'bio': str, Optional('profile_image'): int, Optional('banner_image'): int}))
def update_profile(request):
    if 'profile_image' in request.payload:
        profile_image = service.file.get_image(request.payload['profile_image'])
        if profile_image is None:
            return client_error('INVALID_PARAM', f"Image does not exist.")
        request.user.profile_image = profile_image

    if 'banner_image' in request.payload:
        banner_image = service.file.get_image(request.payload['banner_image'])
        if banner_image is None:
            return client_error('INVALID_PARAM', f"Image does not exist.")
        request.user.banner_image = banner_image

    request.user.nickname = request.payload['nickname']
    request.user.bio = request.payload['bio']
    request.user.save()

    return success(request.user)


@get("is-following")
@contract(Schema({'follower': Use(int), 'followee': Use(int)}))
def following(request):
    follower = service.user.get(request.payload['follower'])
    followee = service.user.get(request.payload['followee'])
    if followee is None or follower is None:
        return client_error('INVALID_PARAM', "No such user.")
    return success({'result': follower.follows.contains(followee)})

@get("follows")
@contract(Schema({Optional('user'): Use(int)}))
def follows(request):
    user = service.user.get(request.payload['user']) if 'user' in request.payload else service.session.get_current_user(request)
    
    if user is None:
        return client_error('INVALID_PARAM', "No such user.")

    return success(list(user.get_follows()))

@get("followers")
@contract(Schema({Optional('user'): Use(int)}))
def followers(request):
    user = service.user.get(request.payload['user']) if 'user' in request.payload else service.session.get_current_user(request)
    
    if user is None:
        return client_error('INVALID_PARAM', "No such user.")

    return success(list(user.get_followers()))

@require_auth
@get("trending")
@contract(Schema({}))
def trending(request):
    return success(list(service.user.get_trending_users(request.user)))
