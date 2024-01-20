from schema import Schema, Optional, Use
from api.decorators import require_auth, get, post, contract
from api.responses import success, client_error
from dao.models import User
import service.flake
import service.file
import service.user
import service.session

API_PREFIX='flake/'

@get("")
@contract(Schema({'id': Use(int)}))
def get_flake(request):
    flake = service.flake.get(request.payload['id'])
    if flake is None:
        return client_error('INVALID_PARAM', f"No such flake: {request.payload['id']}")
    return success(flake)

@require_auth
@post("post")
@contract(Schema({'content': str, Optional('image'): int, Optional('reply_to'): int}))
def _post(request):
    image = None
    reply_to = None
    if 'image' in request.payload:
        image = service.file.get_image(request.payload['image'])
        if image is None:
            return client_error('INVALID_PARAM', f"Image with id {request.payload['image']} does not exist.")
    if 'reply_to' in request.payload:
        reply_to = service.flake.get(request.payload['reply_to'])
        if reply_to is None:
            return client_error('INVALID_PARAM', f"No such flake: {request.payload['reply_to']}")
    new_flake = request.user.post_flake(content=request.payload['content'], image=image, reply_to=reply_to) 
    return success(new_flake)

@require_auth
@post("delete")
@contract(Schema({'id': int}))
def delete(request):
    id = request.payload['id']
    flake = service.flake.get(id)
    if flake is None:
        return client_error('INVALID_PARAM', f"No such flake: {id}")
    if flake.author != request.user:
        return client_error('PERMISSION_ERROR')
    request.user.delete_flake(flake)
    return success({'id': id})

@require_auth
@post("like")
@contract(Schema({'id': int}))
def like(request):
    id = request.payload['id']
    flake = service.flake.get(id)
    if flake is None:
        return client_error('INVALID_PARAM', f"No such flake: {id}")
    request.user.like(flake)
    return success(flake)

@require_auth
@post("unlike")
@contract(Schema({'id': int}))
def unlike(request):
    id = request.payload['id']
    flake = service.flake.get(id)
    if flake is None:
        return client_error('INVALID_PARAM', f"No such flake: {id}")
    request.user.unlike(flake)
    return success(flake)

@require_auth
@get("feeds")
@contract(Schema({Optional('user'): Use(int), Optional('offset', default=0): Use(int), Optional('limit', default=40): Use(int)}))
def feeds(request):
    offset = request.payload['offset']
    limit = request.payload['limit']
    flakes = request.user.get_feeds()[offset:offset+limit]
    return success(list(flakes))

@get("list")
@contract(Schema({Optional('user'): Use(int), Optional('offset', default=0): Use(int), Optional('limit', default=40): Use(int)}))
def _list(request):
    offset = request.payload['offset']
    limit = request.payload['limit']
    user = service.user.get(request.payload['user']) if 'user' in request.payload else service.session.get_current_user(request)
    
    if user is None:
        return client_error('INVALID_PARAM', "No such user.")

    flakes = user.list_flakes()[offset:offset+limit]
    return success(list(flakes))

@get("comments")
@contract(Schema({'id': Use(int), Optional('offset', default=0): Use(int), Optional('limit', default=40): Use(int)}))
def comments(request):
    id = request.payload['id']
    flake = service.flake.get(id)
    if flake is None:
        return client_error('INVALID_PARAM', f"No such flake: {id}")
    offset = request.payload['offset']
    limit = request.payload['limit']
    return success(list(flake.comments.all()[offset:offset+limit]))
