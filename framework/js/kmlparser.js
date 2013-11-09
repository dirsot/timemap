
function getChildrenTag(element, tag) {
	result = [];
	tags = element.childNodes;
	for ( var i = 0; i < tags.length; i++) {
		node = tags[i];
		if (node.tagName && node.tagName.toLowerCase() == tag.toLowerCase()) {
			result.push(node);
		}
	}
	return result;
}

function GXml() {
}
GXml.value = value;
GXml.parse = parse;

function value(node) {
	if (!node) {
		return "";
	}
	var retStr = "";
	if (node.nodeType == 3 || node.nodeType == 4 || node.nodeType == 2) {
		retStr += node.nodeValue;
	} else if (node.nodeType == 1 || node.nodeType == 9 || node.nodeType == 11) {
		for ( var i = 0; i < node.childNodes.length; ++i) {
			retStr += arguments.callee(node.childNodes[i]);
		}
	}
	return retStr;
}

function parse(textDoc) {
	try {
		if (typeof ActiveXObject != "undefined"
				&& typeof GetObject != "undefined") {
			var b = new ActiveXObject("Microsoft.XMLDOM");
			b.loadXML(textDoc);
			return b;
		} else if (typeof DOMParser != "undefined") {
			return (new DOMParser()).parseFromString(textDoc, "text/xml");
		} else {
			return Wb(textDoc);
		}
	} catch (c) {
		P.incompatible("xmlparse");
	}
	try {
		return Wb(textDoc);
	} catch (c) {
		P.incompatible("xmlparse");
		return document.createElement("div");
	}
}

function KmlParser( doc, opts) {
	// store the parameters
	this.doc = doc;
	this.opts = opts || {};
	// elabel options
	this.elabelopacity = this.opts.elabelopacity || 100;
	// other useful "global" stuff
	this.bounds = new google.maps.LatLngBounds();
	this.gmarkers = [];
	this.gpolylines = [];
	this.gpolygons = [];
	this.groundoverlays = [];
	this.side_bar_html = "";
	this.side_bar_list = [];
	this.styles = []; // associative array
	this.iwwidth = this.opts.iwwidth || 250;
	this.progress = 0;
	this.lastmarker = {};
	this.myimages = [];
	this.imageNum = 0;
	this.pointsCount = 0;
}

// uses GXml.value, then removes leading and trailing whitespace
KmlParser.value = function(e) {
	a = GXml.value(e);
	a = a.replace(/^\s*/, "");
	a = a.replace(/\s*$/, "");
	return a;
}

// Create Marker

KmlParser.prototype.createMarker = function(point,begin, end, name, desc, style, iconUrl) {
	G_DEFAULT_ICON = {};
	var icon = G_DEFAULT_ICON;
	var iwoptions = this.opts.iwoptions || {};
	var markeroptions = this.opts.markeroptions || {};
	var icontype = this.opts.icontype || "style";
	if (icontype == "style") {
		if (!!this.styles[style]) {
			icon = this.styles[style];
		}
	}
	if (!markeroptions.icon) {
		markeroptions.icon = icon;
	}
	var m = new google.maps.Marker(point, markeroptions);

	if (this.opts.elabelclass) {
		var l = new ELabel(point, name, this.opts.elabelclass,
				this.opts.elabeloffset, this.elabelopacity, true);
	}
	this.gmarkers.push(m);
	item = {};
	item.start = begin;
	item.end = begin;
	item.title = name;
	item.desc = desc;
	item.iconUrl = iconUrl;
	p = {};
	p.lat = point.lat();
	p.lon = point.lng();
	item.point = p
	return item;
}

KmlParser.prototype.createPolyline = function(points, color, width, opacity,
		name, desc) {
	// var thismap = this.map;
	var iwoptions = this.opts.iwoptions || {};
	var polylineoptions = this.opts.polylineoptions || {};
	var p = new GPolyline(points, color, width, opacity, polylineoptions);
	// this.map.addOverlay(p);
	this.gpolylines.push(p);
}

// Create Polygon

KmlParser.prototype.createPolygon = function(points, id, pId, begin, end, color,
		width, opacity, fillcolor, fillopacity, name, desc) {
	var iwoptions = this.opts.iwoptions || {};
	var polygonoptions = this.opts.polygonoptions || {};
	// var p = new
	// GPolygon(points,color,width,opacity,fillcolor,fillopacity,polygonoptions)
	this.gpolygons.push(points);
	pointsArray = []
	item = {};
	for ( var i = 0; i < points.length; i++) {
		point = points[i];
		p = {};
		p.lat = point.lat();
		p.lon = point.lng();
		if (p.lon == null || p.lat == null || isNaN(p.lat) || isNaN(p.lon)) {
			console.log("Null points");
		} else {
			pointsArray.push(p)
		}
	}
	item.start = begin;
	item.end = "2010";
	item.polygon = pointsArray;
	item.title = name;
	item.mId = id;
	item.pId = pId;
	item.color = color;
	item.width = width;
	item.opacity = opacity;
	item.fillcolor = fillcolor;
	item.name = name;
	item.desc = desc;

	// sessionStorage.polyline = JSON.stringify(item);

	return item;
}


// Request to Parse an XML file

KmlParser.prototype.parse = function() {
	// clear some variables
	this.gmarkers = [];
	this.gpolylines = [];
	this.gpolygons = [];
	this.groundoverlays = [];
	this.side_bar_html = "";
	this.side_bar_list = [];
	this.styles = []; // associative array
	this.lastmarker = {};
	this.myimages = [];
	this.imageNum = 0;
	var that = this;
	this.progress = 1;// this.urls.length;
	that.processing(this.doc);

}

KmlParser.prototype.processing = function(doc) {
	var that = this;
	var xmlDoc = GXml.parse(doc)
	// Read through the Styles
	var styles = xmlDoc.documentElement.getElementsByTagName("Style");
	for ( var i = 0; i < styles.length; i++) {
		var styleID = styles[i].getAttribute("id");
		if (!that.styles["#" + styleID]) {
				that.styles["#" + styleID] = {};
			}
		var icons = styles[i].getElementsByTagName("Icon");
		// This might not be am icon style
		if (icons.length > 0) {
			var href = KmlParser.value(icons[0].getElementsByTagName("href")[0]);
			if (!!href) {
				that.styles["#" + styleID].iconUrl = href;
				if (!!that.opts.baseicon) {
					// that.styles["#"+styleID] = new
					// GIcon(that.opts.baseicon,href);
				} else {
					/*
					 * that.styles["#"+styleID] = new
					 * GIcon(G_DEFAULT_ICON,href);
					 * that.styles["#"+styleID].iconSize = new GSize(32,32);
					 * that.styles["#"+styleID].shadowSize = new GSize(59,32);
					 * that.styles["#"+styleID].dragCrossAnchor = new
					 * GPoint(2,8); that.styles["#"+styleID].iconAnchor = new
					 * GPoint(16,32);
					 */if (that.opts.printgif) {
						var bits = href.split("/");
						var gif = bits[bits.length - 1];
						gif = that.opts.printgifpath
								+ gif.replace(/.png/i, ".gif");
						that.styles["#" + styleID].printImage = gif;
						that.styles["#" + styleID].mozPrintImage = gif;
					}
					if (!!that.opts.noshadow) {
						that.styles["#" + styleID].shadow = "";
					} else {
						// Try to guess the shadow image
						if (href.indexOf("/red.png") > -1
								|| href.indexOf("/blue.png") > -1
								|| href.indexOf("/green.png") > -1
								|| href.indexOf("/yellow.png") > -1
								|| href.indexOf("/lightblue.png") > -1
								|| href.indexOf("/purple.png") > -1
								|| href.indexOf("/pink.png") > -1
								|| href.indexOf("/orange.png") > -1
								|| href.indexOf("-dot.png") > -1) {
							that.styles["#" + styleID].shadow = "http://maps.google.com/mapfiles/ms/micons/msmarker.shadow.png";
						} else if (href.indexOf("-pushpin.png") > -1) {
							// that.styles["#"+styleID].shadow="http://maps.google.com/mapfiles/ms/micons/pushpin_shadow.png";
						} else {
							var shadow = href.replace(".png", ".shadow.png");
							// that.styles["#"+styleID].shadow=shadow;
						}
					}
				}
			}
		}
		// is it a LineStyle ?
		var linestyles = styles[i].getElementsByTagName("LineStyle");
		if (linestyles.length > 0) {
			var width = parseInt(GXml.value(linestyles[0]
					.getElementsByTagName("width")[0]));
			if (width < 1) {
				width = 5;
			}
			var color = KmlParser.value(linestyles[0]
					.getElementsByTagName("color")[0]);
			var aa = color.substr(0, 2);
			var bb = color.substr(2, 2);
			var gg = color.substr(4, 2);
			var rr = color.substr(6, 2);
			color = "#" + rr + gg + bb;
			var opacity = parseInt(aa, 16) / 256;
			if (!that.styles["#" + styleID]) {
				that.styles["#" + styleID] = {};
			}
			that.styles["#" + styleID].color = color;
			that.styles["#" + styleID].width = width;
			that.styles["#" + styleID].opacity = opacity;
		}
		// is it a PolyStyle ?
		var polystyles = styles[i].getElementsByTagName("PolyStyle");
		if (polystyles.length > 0) {
			var fill = parseInt(GXml.value(polystyles[0]
					.getElementsByTagName("fill")[0]));
			var outline = parseInt(GXml.value(polystyles[0]
					.getElementsByTagName("outline")[0]));
			var color = KmlParser.value(polystyles[0]
					.getElementsByTagName("color")[0]);

			if (polystyles[0].getElementsByTagName("fill").length == 0) {
				fill = 1;
			}
			if (polystyles[0].getElementsByTagName("outline").length == 0) {
				outline = 1;
			}
			var aa = color.substr(0, 2);
			var bb = color.substr(2, 2);
			var gg = color.substr(4, 2);
			var rr = color.substr(6, 2);
			color = "#" + rr + gg + bb;

			var opacity = parseInt(aa, 16) / 256;
			if (!that.styles["#" + styleID]) {
				that.styles["#" + styleID] = {};
			}
			that.styles["#" + styleID].fillcolor = color;
			that.styles["#" + styleID].fillopacity = opacity;
			if (!fill)
				that.styles["#" + styleID].fillopacity = 0;
			if (!outline)
				that.styles["#" + styleID].opacity = 0;
		}
	}

	// Read through the Placemarks
	var placemarks = xmlDoc.documentElement.getElementsByTagName("Placemark");
	items = [];
	itemsMarkers = [];
	for ( var i = 0; i < placemarks.length; i++) {
		var id = placemarks[i].getAttribute('id');
		var timeSpan = placemarks[i].getElementsByTagName("TimeSpan")[0];
		var begin = KmlParser.value(timeSpan.getElementsByTagName('begin')[0])
		var end = KmlParser.value(timeSpan.getElementsByTagName('end')[0])
		var name = KmlParser.value(placemarks[i].getElementsByTagName("name")[0]);
		var desc = KmlParser.value(placemarks[i]
				.getElementsByTagName("description")[0]);
		if (desc == "") {
			var desc = KmlParser
					.value(placemarks[i].getElementsByTagName("text")[0]);
			desc = desc.replace(/\$\[name\]/, name);
			desc = desc.replace(/\$\[geDirections\]/, "");
		}
		if (desc.match(/^http:\/\//i)) {
			desc = '<a href="' + desc + '">' + desc + '</a>';
		}
		if (desc.match(/^https:\/\//i)) {
			desc = '<a href="' + desc + '">' + desc + '</a>';
		}
		var style = KmlParser.value(placemarks[i]
				.getElementsByTagName("styleUrl")[0]);
		var coords = GXml.value(placemarks[i]
				.getElementsByTagName("coordinates")[0]);
		coords = coords.replace(/\s+/g, " "); // tidy the whitespace
		coords = coords.replace(/^ /, ""); // remove possible leading
		// whitespace
		coords = coords.replace(/ $/, ""); // remove possible trailing
		// whitespace
		coords = coords.replace(/, /, ","); // tidy the commas
		var path = coords.split(" ");

		multiGeometry = getChildrenTag(placemarks[i], 'MultiGeometry')[0];
		// multiGeometry2 = getChildrenTag(multiGeometry, 'MultiGeometry')[0];
		if(multiGeometry){
			allPolygons = multiGeometry.getElementsByTagName("Polygon")
		}else{
			allPolygons = {};
		}
		
		onePoint = getChildrenTag(placemarks[i], 'Point')[0];
		
		if (!!that.styles[style]) {
					var width = that.styles[style].width;
					var color = that.styles[style].color;
					var opacity = that.styles[style].opacity;
					var fillopacity = that.styles[style].fillopacity;
					var fillcolor = that.styles[style].fillcolor;
					var iconUrl = that.styles[style].iconUrl;
				} else {
					var width = 5;
					var color = "#0000ff";
					var opacity = 0.45;
					var fillopacity = 0.25;
					var fillcolor = "#0055ff";
				}
		
		if(onePoint){


			coords = GXml.value(onePoint.getElementsByTagName("coordinates")[0]);
			
			// It's not a poly, so I guess it must be a marker
				var bits = coords.split(",");
				var point = new google.maps.LatLng(parseFloat(bits[1]),
						parseFloat(bits[0]));
				that.bounds.extend(point);
				// Does the user have their own createmarker function?
				if (!!that.opts.createmarker) {
					that.opts.createmarker(point, begin ,end, name, desc, style);
				} else {
					itemsMarkers.push(that.createMarker(point ,begin,end, name, desc, style, iconUrl));
				}
		}
		
		for ( var j = 0; j < allPolygons.length; j++) {
			polygon = allPolygons[j];
			coords = GXml.value(polygon.getElementsByTagName("coordinates")[0]);
			path = coords.split(" ");

			// Is this a polyline/polygon?
			if (path.length > 1) {
				// Build the list of points
				var points = [];
				var pId = polygon.getAttribute('id');
				for ( var p = 0; p < path.length; p++) {
					var bits = path[p].split(",");
					if (parseFloat(bits[1]) == null
							|| parseFloat(bits[0]) == null
							|| isNaN(parseFloat(bits[1]))
							|| isNaN(parseFloat(bits[0]))) {
					} else {
						var point = new google.maps.LatLng(parseFloat(bits[1]),
								parseFloat(bits[0]));
						points.push(point);
					}
				}
				this.pointsCount  = this.pointsCount + points.length;
				var linestring = placemarks[i]
						.getElementsByTagName("LineString");
				if (linestring.length) {
					// it's a polyline grab the info from the style
					// Does the user have their own createmarker function?
					if (!!that.opts.createpolyline) {
						that.opts.createpolyline(points, color, width, opacity,
								name, desc);
					} else {
						that.createPolyline(points, color, width, opacity,
								name, desc);
					}
				}

				var polygons = placemarks[i].getElementsByTagName("Polygon");
				// Does the user have their own createmarker function?
				if (!!that.opts.createpolygon) {
					items.push(that.opts.createpolygon(points, id, pId, begin,
							end, color, width, opacity, fillcolor, fillopacity,
							name, desc));
				} else {
					items.push(that.createPolygon(points, id, pId, begin, end,
							color, width, opacity, fillcolor, fillopacity,
							name, desc));
				}
				// }

			} else {
				// It's not a poly, so I guess it must be a marker
				var bits = path[0].split(",");
				var point = new google.maps.LatLng(parseFloat(bits[1]),
						parseFloat(bits[0]));
				that.bounds.extend(point);
				// Does the user have their own createmarker function?
				if (!!that.opts.createmarker) {
					that.opts.createmarker(point, name, desc, style);
				} else {
					that.createMarker(point, name, desc, style);
				}
			}
		}
	}
	sessionStorage.polyline = JSON.stringify(items);
	sessionStorage.marker = JSON.stringify(itemsMarkers);
}