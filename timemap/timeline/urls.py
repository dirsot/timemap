from django.conf.urls.defaults import patterns, include, url
import os.path

urlpatterns = patterns('timemap.timeline.views',
    url(r'^$', 'index', name='index'), 
    url(r'/dodajMarker$', 'addMarker', name='addMarker'),
    url(r'/googleManager$', 'googleManager', name='googleManager'), 
    
    url(r'/ajaxAction', 'ajaxAction', name='ajaxAction'),
    url(r'/jsonmapdata/(?P<mapCode>[A-Zz0-9]{9})', 'jsonMapData', name='jsonMapData'),
    url(r'/ajaxUpdate', 'ajaxUpdate', name='ajaxUpdate'),
    url(r'/ajaxRemove', 'ajaxRemove', name='ajaxRemove'),
    url(r'/getMoreInfo$', 'getMoreInfo', name='getMoreInfo'),
    url(r'/(?P<fileCode>[A-Zz0-9]{9})/$', 'showMap', name='showMap'),
    url(r'/(?P<fileCode>[A-Zz0-9]{9})/edit$', 'editMap', name='editMap'),                    
)