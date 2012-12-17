#-*-coding:utf-8-*-

from django.db import models

class Point(models.Model):
    title = models.CharField(max_length=255, verbose_name='Tytuł')
    lon = models.FloatField()
    lat = models.FloatField()