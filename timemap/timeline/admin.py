#-*-coding:utf-8-*-

from django.contrib import admin
from timemap.timeline.models import *

class MapAdmin(admin.ModelAdmin):
    list_display = ('id','title','owner','code')
    actions = ['make_published']

    def make_published(self, request, queryset):
        #queryset.update(status='p') 
        message_bit = "test"
        self.message_user(request, "%s finished." % message_bit)  
    make_published.short_description = "New task"
  
    list_filter = ('owner',)
    
    
class MarkerAdmin(admin.ModelAdmin):
    list_display = ('map','title','lon','lat','dateFrom','dateTo')

class CircleAdmin(admin.ModelAdmin):
    list_display = ('map','centerLon','centerLat','radius','dateFrom','dateTo')
             
admin.site.register(Map,MapAdmin) 
admin.site.register(Marker,MarkerAdmin) 