# -*-coding:utf-8-*-

from django.shortcuts import render_to_response
from timemap.timeline.models import *;
from django.views.decorators.http import require_POST
from django.http import HttpResponseRedirect, HttpResponse
from django.template import RequestContext, Template
from django.utils import simplejson

from django.core import serializers
import logging
import random
import string
import json

logger = logging.getLogger('timeline.views')
CHAR_SET = string.ascii_uppercase + string.digits

def getCode():
    return ''.join(random.sample(CHAR_SET, 9))

def showTimeMap(request,fileCode=None):
    return render_to_response('timeMap.html', {},
        context_instance=RequestContext(request))

def jsonMapData(request,mapCode):
    mapCode = Map.objects.get(code=mapCode)
    markers = Marker.objects.filter(map=mapCode)
    title = 'title'
    start = 'start'
    point = 'point'
    lat = 'lat'
    lon='lon'
    polygon='polygon'
    end='end'
    results=[{title:'Item 1',start:'1969-12-31T19:00:00-0500',end:'1971',polygon:[
                                                                       {lat:51.8265678654,lon:12.4885120514},
                                                                       {lat:51.1265678654,lon:12.4285120514},
                                                                       {lat:51.4265678654,lon:11.4185120514}
                                                                       ],
             'options':{'endpoly':[{lat:51.0265678654,lon:12.04885120514},
                                                                       {lat:51.8265678654,lon:12.4885120514}]}}]
    

    jsonResult = simplejson.dumps(results)
    return HttpResponse(jsonResult, mimetype='application/json')

def ajaxUpdate(request):
    results = {'success':False}
    if request.method == u'POST':
        POST = request.POST
        if POST.has_key(u'data'):
            try: 
                logger.debug(POST[u'data'])
                data = json.loads(POST[u'data'])
                logger.debug(data)
                data = json.loads(data)
                marker=data.get('marker')
                id=marker.get('id')
                title=marker.get('title')
                lat=marker.get('lat')
                lng=marker.get('lng')
                dsc=marker.get('dsc')
                icon=marker.get('icon')
                markerObject = Marker.objects.get(id=id)
                markerObject.title = title
                markerObject.lon = lng
                markerObject.lat = lat
                markerObject.dsc = dsc
                markerObject.icon = icon       
                logger.debug(markerObject)
                logger.debug(lat)
                markerObject.save()
                results = {'success':True}
            except Exception, e:
                logger.debug(e)
    jsonResult = simplejson.dumps(results)
    return HttpResponse(jsonResult, mimetype='application/json')

def ajaxRemove(request):
    results = {'success':False}
    if request.method == u'POST':
        POST = request.POST
        if POST.has_key(u'data'):
            try: 
                logger.debug(POST[u'data'])
                data = json.loads(POST[u'data'])
                logger.debug(data)
                data = json.loads(data)
                marker=data.get('marker')
                id=marker.get('id')
                markerObject = Marker.objects.get(id=id)
                markerObject.delete()
                results = {'success':True}
            except Exception, e:
                logger.debug(e)
    jsonResult = simplejson.dumps(results)
    return HttpResponse(jsonResult, mimetype='application/json')
    
def ajaxAction(request):
    results = {'success':False}
    if request.method == u'POST':
        POST = request.POST
        logger.debug("POST: ")
        logger.debug(POST)
        if POST.has_key(u'data'):
            try:  
                logger.debug(POST[u'data'])        
                data = json.loads(POST[u'data'])
                data = json.loads(data)
                markers=data.get('marker') 
                #logger.debug(data)
                for marker in markers:
                    id=marker.get('id')
                    if(id==-1):
                        m = Marker(lat=marker.get('lat'),lon=marker.get('lng'),map_id=1,title=marker.get('title'),dsc=marker.get('dsc'))
                        m.save();
                logger.debug(markers)           
            except Exception, e:
                logger.debug(e)
            results = {'success':True}
        else:
            pass
    else:
        logger.debug("GET action")
    jsonResult = simplejson.dumps(results)
    return HttpResponse(jsonResult, mimetype='application/json')

def index(request, page_number=1):
    logger.debug('index')
    return render_to_response('start.html', {},
        context_instance=RequestContext(request))
    
def showMap(request, fileCode=None):
    logger.debug('showMap ' + fileCode)
    map = Map.objects.get(code=fileCode)
    markers = Marker.objects.filter(map=map)
    return render_to_response('showMap.html', {'markers':markers},
        context_instance=RequestContext(request))    

def editMap(request, fileCode=None):
    logger.debug('index')
    map = Map.objects.get(code=fileCode)
    markers = Marker.objects.filter(map=map)
    return render_to_response('editMap.html', {'markers':markers},
        context_instance=RequestContext(request))

@require_POST
def getMoreInfo(request):
    id = request.POST['elementId']
    foos = Marker.objects.filter(pk=id)
    data = serializers.serialize('json', foos) 
#    return HttpResponse(data, mimetype='application/json')
    c = RequestContext(request, {'result':json.dumps(data)})
    t = Template("{{result}}")  # A dummy template
    return render_to_response("result.html", {'result':data},
        context_instance=RequestContext(request))
    # return HttpResponse(t.render(c), mimetype = u'application/json')

def googleManager(request, page_number=1):
    logger.debug('googleManager')
    return render_to_response('usingManager.html', {},
        context_instance=RequestContext(request))
    
    
def addMarker(request):
    logger.debug('adMarker')
    if not request.POST:
        return render_to_response('start.html', {}, context_instance=RequestContext(request))
    lon = request.POST.get('lon', False)
    lat = request.POST.get('lat', False)
    logger.debug("lon: " + str(lon))
    logger.debug(lat)
    return render_to_response('start.html', {},
        context_instance=RequestContext(request))
