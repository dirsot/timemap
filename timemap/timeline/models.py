#-*-coding:utf-8-*-

from django.db import models
from django.contrib.auth.models import User

class Map(models.Model):
    title = models.CharField(max_length=255, verbose_name='Tytuł', blank=False)
    owner = models.ForeignKey(User)
    code = models.CharField(max_length=255, verbose_name='kod', unique=True, blank=False)
    #text = models.TextField(verbose_name = "Informacje o mapie")
    class Meta:
        verbose_name ="Mapa"
        verbose_name_plural ="Mapy"
        #ordering = ['id']
        
    def __str__(self):
        return self.title
    def __unicode__(self):
        return self.title

class Marker(models.Model):
    map = models.ForeignKey(Map,blank=False)
    title = models.CharField(max_length=255, verbose_name='Tytuł')
    dsc = models.TextField(max_length=16384, verbose_name='Opis')
    lon = models.FloatField(blank=False)
    lat = models.FloatField(blank=False)
    dateFrom = models.DateTimeField(blank=True, null=True)
    dateTo = models.DateTimeField(blank=True, null=True)
    #text = models.TextField(verbose_name = "Informacje o markerze")
    class Meta:
        verbose_name ="Marker"
        verbose_name_plural ="Markers"
        ordering = ['map']
        
class Circle(models.Model):
    map = models.ForeignKey(Map,blank=False)
    title = models.CharField(max_length=255, verbose_name='Tytuł')
    centerLon = models.FloatField(blank=False)
    centerLat = models.FloatField(blank=False)
    radius = models.FloatField(blank=False)
    dateFrom = models.DateTimeField(blank=True)
    dateTo = models.DateTimeField(blank=True)
    
    class Meta:
        verbose_name ="Okrąd"
        verbose_name_plural ="Okręgi"
        ordering = ['map']