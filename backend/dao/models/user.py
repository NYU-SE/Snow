# Django Imports
from django.db import models
from django.contrib.auth.models import User as AuthUser
from django.utils import timezone
from django.db.models import Q

from .file import Image
from .flake import Flake, Like

class User(models.Model):
    id = models.AutoField(primary_key=True)
    auth = models.OneToOneField(
        AuthUser,
        on_delete=models.CASCADE,
    )
    creation_date = models.DateTimeField(default=timezone.now)
    profile_image = models.ForeignKey(
        Image,
        related_name='used_in_profile',
        on_delete=models.PROTECT,
        blank=True,
        null=True
    )
    banner_image = models.ForeignKey(
        Image,
        related_name='used_in_banner',
        on_delete=models.PROTECT,
        blank=True,
        null=True
    )
    nickname = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(null=True, blank=True)

    # TODO: Slides about design pattern here, pros and cons
    follows = models.ManyToManyField(
        'self',
        related_name = 'followers',
        related_query_name = 'follower',
        symmetrical=False,
    )

    def post_flake(self, content, image=None, reply_to=None):
        return Flake.objects.create(
            author = self,
            content = content,
            image = image,
            reply_to = reply_to
        )
    
    def delete_flake(self, flake):
        if flake.author == self:
            flake.delete()
    
    def list_flakes(self):
        return Flake.objects.filter(Q(author=self) & Q(reply_to__isnull=True)).order_by("-creation_date")
    
    def get_feeds(self):
        return Flake.objects.filter((Q(author=self) | Q(author__follower=self)) & Q(reply_to__isnull=True)).order_by("-creation_date")
    
    def like(self, flake):
        try:
            Like.objects.get(user=self, flake=flake)
        except Like.DoesNotExist:
            Like.objects.create(
                user = self,
                flake = flake
            )
    
    def unlike(self, flake):
        try:
            like = Like.objects.get(user=self, flake=flake)
            like.delete()
        except Like.DoesNotExist:
            return

    def follow(self, followee):
        self.follows.add(followee)
        self.save()
    
    def unfollow(self, followee):
        self.follows.remove(followee)
        self.save()
    
    def get_follows(self):
        return self.follows.all()
    
    def get_followers(self):
        return self.followers.all()
