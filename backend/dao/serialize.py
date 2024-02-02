from django.core.serializers.json import DjangoJSONEncoder
from django.conf import settings
from .models import Flake, User, Image

class SnowEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, User):
            return {
                'type': 'User',
                'id': obj.id,
                'creation_date': obj.creation_date,
                'email': obj.auth.email,
                'username': obj.auth.username,
                'nickname': obj.nickname,
                'bio': obj.bio,
                'profile_image': obj.profile_image if obj.profile_image else None,
                'banner_image': obj.banner_image if obj.banner_image else None,
                'flakes_count': len(obj.list_flakes()),
                'follows_count': len(obj.get_follows()),
                'followers_count': len(obj.get_followers())
            }
        
        if isinstance(obj, Flake):
            return {
                'type': 'Flake',
                'id': obj.id,
                'creation_date': obj.creation_date,
                'author': obj.author,
                'content': obj.content, 
                'image': obj.image if obj.image else None,
                'reply_to': obj.reply_to.id if obj.reply_to else obj.reply_to,
                'likes_count': len(obj.get_likes()),
                'comments_count': len(obj.get_comments())
            }

        if isinstance(obj, Image):
            return {
                'type': 'Image',
                'id': obj.id,
                'creation_date': obj.creation_date,
                'url': f"{settings.SNOW_HOSTNAME}/{obj.file.url}"
            }

        return super().default(obj)
