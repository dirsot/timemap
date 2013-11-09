function SGVObject(swBound, neBound, elements, map) {

  this.swBound_ = swBound;
  this.neBound_ = neBound;
  this.elements_ = elements;
  this.map_ = map;

  this.div_ = null;

  this.setMap(map);
}

USGSOverlay.prototype.onAdd = function() {

  var div = document.createElement('div');
  div.style.border = 'none';
  div.style.borderWidth = '0px';
  div.style.position = 'absolute';

  var svgHolder = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgHolder.setAttribute("version", "1.2");
  
  for ( el in elements ) {
	createSVGElement(el.type,el.properties,svgHolder);
  }

  div.appendChild(svgHolder);

  this.div_ = div;

  var panes = this.getPanes();
  panes.mapPane.appendChild(this.div_);
};

USGSOverlay.prototype.draw = function() {

  var overlayProjection = this.getProjection();

  var sw = overlayProjection.fromLatLngToDivPixel(this.swBound);
  var ne = overlayProjection.fromLatLngToDivPixel(this.neBound);

  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';
};

USGSOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
};

USGSOverlay.prototype.hide = function() {
  if (this.div_) {
    this.div_.style.visibility = 'hidden';
  }
};

USGSOverlay.prototype.show = function() {
  if (this.div_) {
    this.div_.style.visibility = 'visible';
  }
};

USGSOverlay.prototype.toggle = function() {
  if (this.div_) {
    if (this.div_.style.visibility == 'hidden') {
      this.show();
    } else {
      this.hide();
    }
  }
};

USGSOverlay.prototype.toggleDOM = function() {
  if (this.getMap()) {
    this.setMap(null);
  } else {
    this.setMap(this.map_);
  }
};

function createSVGElement( eltType, properties,svgElement) {
  var elt = document.createElementNS('http://www.w3.org/2000/svg', eltType);
  for ( prop in properties ) {
    elt.setAttribute(prop, properties[prop]);
    }
  svgElement.appendChild(elt);
}