import imghdr
from django.views.decorators.http import require_POST
from api.decorators import api_path, require_auth
from api.responses import client_error, success
import service.file

API_PREFIX='file/'

@require_auth
@require_POST
@api_path('image/upload')
def image_upload(request):
    if 'image' not in request.FILES:
        return client_error('INVALID_PARAM')
    new_image = service.file.create_image(request.FILES['image'])
    if imghdr.what(new_image.file.path) is None:
        service.file.delete_image(new_image)
        return client_error('INVALID_PARAM', 'Uploaded file is not image.')
    return success(new_image)
