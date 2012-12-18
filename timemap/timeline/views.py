#-*-coding:utf-8-*-

from django.template import RequestContext
from django.shortcuts import render_to_response
from timemap.timeline.models import *;
import logging
import random
import string

logger = logging.getLogger('timeline.views')
CHAR_SET = string.ascii_uppercase + string.digits

def getCode():
    return ''.join(random.sample(CHAR_SET, 9))

def index(request,page_number=1):
    logger.debug('index')
    return render_to_response('start.html', {}, 
        context_instance=RequestContext(request))
    
def showMap(request,fileCode=None):
    logger.debug('showMap '+ fileCode)
    map = Map.objects.get(code=fileCode)
    markers = Marker.objects.filter(map=map)
    return render_to_response('showMap.html', {'markers':markers}, 
        context_instance=RequestContext(request))    

def editMap(request,fileCode=None):
    logger.debug('index')
    map = Map.objects.get(code=fileCode)
    markers = Marker.objects.filter(map=map)
    return render_to_response('editMap.html', {'markers':markers}, 
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
    return render_to_response('start.html', {}, 
        context_instance=RequestContext(request))