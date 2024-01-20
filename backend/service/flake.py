from dao.models import Flake

def get(id):
    try:
        return Flake.objects.get(id=id)
    except Flake.DoesNotExist:
        return None

def search_keyword(keyword):
    return Flake.objects.filter(content__icontains=keyword)
