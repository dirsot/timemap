#-*-coding:utf-8-*-

from django.template import RequestContext
from django.shortcuts import render_to_response

def index(request,page_number=1):
    
    return render_to_response('index.html', {}, 
        context_instance=RequestContext(request))