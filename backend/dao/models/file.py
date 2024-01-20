from django.db import models
from django.utils import timezone

class Image(models.Model):
    id = models.AutoField(primary_key=True)
    creation_date = models.DateTimeField(default=timezone.now)
    file = models.ImageField(upload_to="image/")
