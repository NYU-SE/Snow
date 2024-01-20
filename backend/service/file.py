import os
from dao.models import Image

def create_image(file):
    return Image.objects.create(file=file)

def delete_image(image):
    os.remove(image.file.path)
    image.delete()

def get_image(id):
    try:
        return Image.objects.get(id=id)
    except Image.DoesNotExist:
        return None
