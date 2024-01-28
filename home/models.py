# Main Imports

# Django Imports
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# My Module Imports
from authentication.models import BasicUserProfile
from hashtag.models import Topic


# Tweet Model
# --------------
# This model holdes the records of tweets made by users
class Tweet(models.Model):
    user = models.ForeignKey(
        BasicUserProfile,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    creation_date = models.DateField(default=timezone.now)
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    image = models.ImageField(
        upload_to="tweet_photo/", blank=True, null=True
    )
    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    tweet_like_amount = models.IntegerField(default=0)
    tweet_comment_amount = models.IntegerField(default=0)

    def __str__(self):
        return "Tweet id: " + str(self.id)


# Tweet Comment
# --------------
class TweetComment(models.Model):
    creation_date = models.DateField(default=timezone.now)
    id = models.AutoField(primary_key=True)
    tweet = models.ForeignKey(
        Tweet,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    content = models.TextField()
    commentor = models.ForeignKey(
        BasicUserProfile,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    like_amount = models.IntegerField(default=0)

    def __str__(self):
        return "Comment id: " + str(self.id)


# Tweet Retweet
# --------------
class TweetRetweet(models.Model):
    creation_date = models.DateField(default=timezone.now)
    id = models.AutoField(primary_key=True)
    tweet = models.ForeignKey(
        Tweet,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    retweeter = models.ForeignKey(
        BasicUserProfile,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    def __str__(self):
        return "Retweet id: " + str(self.id)


# Tweet Like
# --------------
class TweetLike(models.Model):
    creation_date = models.DateField(default=timezone.now)
    id = models.AutoField(primary_key=True)
    tweet = models.ForeignKey(
        Tweet,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    liker = models.ForeignKey(
        BasicUserProfile,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    like_count = models.IntegerField(default=0)

    def __str__(self):
        return "Like id: " + str(self.id)


# Tweet Comment Like
class TweetCommentLike(models.Model):
    creation_date = models.DateField(default=timezone.now)
    id = models.AutoField(primary_key=True)
    tweet_comment = models.ForeignKey(
        TweetComment,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    liker = models.ForeignKey(
        BasicUserProfile,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    like_count = models.IntegerField(default=0)

    def __str__(self):
        return "Like id: " + str(self.id)
