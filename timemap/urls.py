from django.conf.urls.defaults import patterns, include, url
import os.path

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^site_media/(.*)$', 'django.views.static.serve', {'document_root': os.path.join(os.path.dirname(__file__), 'site_media')}),
    url(r'^samples/(.*)$', 'django.views.static.serve', {'document_root': os.path.join(os.path.dirname(__file__), 'samples')}),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('timemap.view',
    #url(r'^$', 'index', name='index'), 
    url(r'^line',  include('timemap.timeline.urls')),  
    url(r'^map',  include('timemap.timeline.urls')),                    
)