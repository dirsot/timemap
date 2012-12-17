#-*-coding:utf-8-*-

from django.contrib import admin
from timemap.timeline.models import *

class PointAdmin(admin.ModelAdmin):
    list_display = ('title','lon','lat')
    
admin.site.register(Point,PointAdmin) 