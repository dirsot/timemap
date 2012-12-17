#-*-coding:utf-8-*-

from django.template import RequestContext
from django.shortcuts import render_to_response
from timemap.timeline.models import *;
import logging

logger = logging.getLogger('timeline.views')

def index(request,page_number=1):
    logger.debug('index')
    return render_to_response('start.html', {}, 
        context_instance=RequestContext(request))

def googleManager(request,page_number=1):
    logger.debug('googleManager')
    return render_to_response('usingManager.html', {}, 
        context_instance=RequestContext(request))
    
    
def addMarker(request):
    logger.debug('adMarker')
    if not request.POST:
        return render_to_response('start.html', {},context_instance=RequestContext(request))
    lon = request.POST.get('lon', False)
    lat = request.POST.get('lat', False)
    logger.debug("lon: "+str(lon))
    logger.debug(lat)
    p = Point(title="",lon=lon,lat=lat)
    p.save()
    return render_to_response('start.html', {}, 
        context_instance=RequestContext(request))