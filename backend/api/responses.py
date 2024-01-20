from django.http import JsonResponse
from dao.serialize import SnowEncoder

CLIENT_ERRORS = {
    'NO_AUTH': 'Client not authenticated.',
    'MALFORMED_PAYLOAD': 'Request body is not valid json.',
    'INVALID_PARAM': 'Invalid parameters',
    'INVALID_CREDENTIALS': 'Invalid credentials.',
    'PERMISSION_ERROR': 'User is not permitted to this action.'
}

SERVER_ERRORS = {}

def success(data):
    return JsonResponse(data, encoder=SnowEncoder, safe=False, status=200)

def client_error(code, message=None):
    return JsonResponse({'code': code, 'message': CLIENT_ERRORS[code] if message is None else message}, safe=False, status=400)

def server_error(code, message=None):
    return JsonResponse({'code': code, 'message': SERVER_ERRORS[code] if message is None else message}, safe=False, status=500)
