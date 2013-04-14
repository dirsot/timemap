#!/usr/bin/python

import sys
from xml.dom import minidom
import time

def scan(file):
	print 'start scan'
	f = open(file, 'r')
	result = open('sql.txt', 'w')
	jsonFile = open('json.txt', 'w')
	xmldoc = minidom.parse(file)
	itemlist = xmldoc.getElementsByTagName('Placemark') 
	t2100 = '2100'
	print len(itemlist)
	json='['
	for s in itemlist :
		id = s.attributes['id'].value
		print s.attributes['id'].value
		start =  s.getElementsByTagName('TimeSpan')[0].getElementsByTagName('begin')[0].firstChild.nodeValue
		print start
		for jeden in s.getElementsByTagName('MultiGeometry')[0].getElementsByTagName('Polygon'):
			points =  jeden.getElementsByTagName('outerBoundaryIs')[0].getElementsByTagName('LinearRing')[0].getElementsByTagName('coordinates')[0].firstChild.nodeValue
			#t = time.strptime(start, "%Y")  
			#time.mktime(t)
			pId =  jeden.attributes['id'].value
			strPoly = '\n insert into timeline_polygon (map_id,main_poly,inner_poly,date_from,date_to,text,title) VALUES (1,\''+id+'\',\''+pId+'\',\''+start+'\',\''+t2100+'\',\'\',\'\');'
			str = '\n insert into timeline_marker (map_id,main_poly,inner_poly,lon,lat) VALUES '
			
			json+='{\'end\':\'2100\',\'start\':\''+start+'\',\'polygon\':['
			for fig in points.split('\n'):
				licz = fig.split(',')
				if len(licz)==2:
					json+='{\'lat\':'+licz[1]+',\'lon\':'+licz[0]+'},'
					str +='(1,\''+id+'\',\''+pId+'\','+licz[0]+','+licz[1]+'),'
					#print licz[0]
						#print licz
			#print str
			json=json[:-1]+']},'
			result.write(strPoly)
			result.write(str[:-1]+';')
	json=json[:-1]+']'
	result.close()
	jsonFile.write(json)
	jsonFile.close()
		
if __name__ == '__main__':
	file = 'us_states.kml'
	if len(sys.argv)>1:
		file = sys.argv[1]
	scan(file)