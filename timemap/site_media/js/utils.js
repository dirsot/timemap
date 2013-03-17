function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for ( var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie
						.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
function ajaxRequest(url,data,succesFunction,errorFunction,completeFunction){
	$.ajax({
        url: url,
        type: "POST",
        beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'))
		},
        data:{"data":data},
        datatype: "json",
        success : function(response,textStatus, jqXHR) {
        	if(succesFunction)
        	succesFunction()
		},
		error : function(jqXHR, textStatus,errorThrown) {
			if(errorFunction){
				errorFunction()
			}else{
				console.log("The following error occured: "+ textStatus,errorThrown);
			}
		},
		complete : function() {
			if(completeFunction)
			completeFunction()
		}
    });
}

function createIconImage(path){
	if(path && path!="None")
		return new google.maps.MarkerImage(path);
}



function movingPolygon(tm) {
    // new filter chain for poly tweening
    tm.addFilterChain("polytween",
        function(item) {
            // create tween if item is visible
            if (item.visible) {
                var theme = item.opts.theme || item.dataset.opts.theme;
                var pm = item.placemark;
                var ep = item.opts.endpoly;
                // get tween percent
                var now = item.dataset.timemap.timeline.getBand(0)
                    .getCenterVisibleDate().getTime();
                var start = item.event.getStart().getTime();
                var end = item.event.getEnd().getTime();
                var percent;
                if (now < start) percent = 0;
                else if (now > end) percent = 1;
                else percent = 1 - ((end - now) / (end - start));
                // assume the same number of vertices
                var points=[], pt1, pt2;
                for (var x=0; x<pm.points.length; x++) {
                    pt1 = pm.points[x];
                    pt2 = ep[x];
                    points.push(new mxn.LatLonPoint(
                        (pt1.lat + ((parseFloat(pt2.lat) - pt1.lat) * percent)),
                        (pt1.lng + ((parseFloat(pt2.lon) - pt1.lng) * percent))
                    ));
                    // remove the old tween
                    if (item.tween) item.map.removePolyline(item.tween);
                    // hide the real placemark
                    item.placemark.hide();
                    // show the new tween
                    item.tween = new mxn.Polyline(points), 
                    item.tween.addData({
                        color: theme.lineColor, 
                        width: theme.lineWeight, 
                        opacity: theme.lineOpacity, 
                        closed: true, 
                        fillColor: theme.fillColor,
                        fillOpacity: theme.fillOpacity
                    });
                    item.map.addPolyline(item.tween);
                }
            } else {
                // remove tween if any
                if (item.tween) {
                    item.map.removePolyline(item.tween);
                    item.tween = null;
                }
            }
        },
        function(item) {
        }
    );
    tm.addFilter("polytween", function(item) {
        return (item.event && item.placemark &&
            !item.event.isInstant() && item.getType() == 'polygon' && 
            item.opts.endpoly);
    });
    tm.filter("polytween");
    // update map on timeline scroll
    tm.timeline.getBand(0).addOnScrollListener(function() {
        tm.filter("polytween");
    });
}

function drawLine(tm) {
    // new filter chain for map lines
    tm.addFilterChain("pathlines",
        // true condition: add a pathline
        function(item) {
            if (!item.pathline && !item.skip) {
                // obviously this is Google-specific, but I think it could be abstracted
                item.pathline = new GPolyline([
                    item.opts.infoPoint.toProprietary('google'), 
                    item.next.opts.infoPoint.toProprietary('google')
                ], "#0000CC");
                tm.getNativeMap().addOverlay(item.pathline);
            }
        },
        // false condition: remove a pathline
        function(item) {
            if (item.pathline) {
                tm.getNativeMap().removeOverlay(item.pathline);
                item.pathline = null;
            }
        }
    );
    // define the filter that creates the pathlines
    tm.addFilter("pathlines", function(item) {
        if (!item.next && item.event && !item.skip) {
            // use the Timeline sequential iterator
            var i = tm.timeline.getBand(0).getEventSource().getEventIterator(item.event.getStart(), new Date());
            FINDNEXT: {
                while (!item.next) {
                    if (i.hasNext()) {
                        var next = i.next().item;
                        // if the next one's taken we can skip
                        if (next.taken) {
                            item.skip = true;
                            break FINDNEXT;
                        }
                        // skip missing placemarks at the same location
                        if (next.placemark && !item.opts.infoPoint.equals(next.opts.infoPoint)) {
                            item.next = next;
                            next.taken = true;
                        }
                    }
                    else break FINDNEXT;
                }
            }
        }
        return (item.next && item.placemarkVisible && item.next.placemarkVisible);
    });
    // invoke the filter once data is displayed
    tm.filter("pathlines");
    // update map on timeline scroll
    tm.timeline.getBand(0).addOnScrollListener(function() {
        tm.filter("pathlines");
    });
}

/*

{ // polyline
                            "start" : "1480-01-02",
                            "end" : "1490-01-02",
                            "polygon" : [{"lat":43.79488907226601,"lon":11.205711364746094},{"lat":43.812977041006626,"lon":11.228370666503906},{"lat":43.7859669617277,"lon":11.2664794921875},{"lat":43.8028187190472,"lon":11.279182434082031},{"lat":43.78819761422739,"lon":11.277122497558594},{"lat":43.78398408962279,"lon":11.294631958007812},{"lat":43.76464763976463,"lon":11.182365417480469},{"lat":43.79488907226601,"lon":11.205711364746094}],
                            "title" : "Firenze",
                            "options" : {
                              "description": "Testing a polygon tween of Firenze",
                              "endpoly": [{"lat":43.81025180712872,"lon":11.1566162109375},{"lat":43.84492732139371,"lon":11.22802734375},{"lat":43.81669306861421,"lon":11.2554931640625},{"lat":43.81669306861421,"lon":11.311111450195312},{"lat":43.799349628071965,"lon":11.337890625},{"lat":43.77506035122469,"lon":11.370162963867188},{"lat":43.7641517511446,"lon":11.35986328125},{"lat":43.81025180712872,"lon":11.1566162109375}]
                            
                            }
                          }
*/