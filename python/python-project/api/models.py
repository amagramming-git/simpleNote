from django.db import models
from django.contrib.auth.models import User

# python manage.py makemigrations
# python manage.py migrate


class Note(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    title = models.CharField(
        blank=True,
        null=True,
        default='',
        max_length=10000,
    )
    body = models.TextField(
        blank=True,
        null=True,
        default='',
    )
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "title:" + self.title + " body:" + self.body
