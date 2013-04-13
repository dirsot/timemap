#!/usr/bin/python

import sys
from xml.dom import minidom

def scan(file):
	print 'start scan'
	f = open(file, 'r')
	xmldoc = minidom.parse(file)
	itemlist = xmldoc.getElementsByTagName('Placemark') 
	print len(itemlist)
	for s in itemlist :
		id = s.attributes['id'].value
		print s.attributes['id'].value
		start =  s.getElementsByTagName('TimeSpan')[0].getElementsByTagName('begin')[0].firstChild.nodeValue
		print start
		for jeden in s.getElementsByTagName('MultiGeometry')[0].getElementsByTagName('Polygon'):
			points =  jeden.getElementsByTagName('outerBoundaryIs')[0].getElementsByTagName('LinearRing')[0].getElementsByTagName('coordinates')[0].firstChild.nodeValue
			str = ''
			pId =  jeden.attributes['id'].value
			for fig in points.split('\n'):
				licz = fig.split(',')
				if len(licz)==2:
					str +='('+id+','+pId+','+licz[0]+','+licz[1]+'),'
					#print licz[0]
						#print licz
			print str
		
if __name__ == '__main__':
	file = 'us_states.kml'
	if len(sys.argv)>1:
		file = sys.argv[1]
	scan(file)