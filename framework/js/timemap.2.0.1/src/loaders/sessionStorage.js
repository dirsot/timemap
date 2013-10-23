
/*globals TimeMap */

/**
 * @class
 * SessionStorage loader: load sessionStorage data.
 *
 */
TimeMap.loaders.sessionStorage = function(options) {
    var loader = new TimeMap.loaders.basic(options),
        tagMap = options.tagMap || {},
        extendedData = options.extendedData || [];
    
    // Add ExtendedData parameters to extra params
    extendedData.forEach(function(tagName) {
        loader.extraParams.push(
            //new TimeMap.params.ExtendedDataParam(tagMap[tagName] || tagName, tagName)
        );
    });
    
    // set custom parser
    loader.parse = TimeMap.loaders.sessionStorage.parse;
    return loader;
};

TimeMap.loaders.sessionStorage.parse = function(kmlnode) {
	sessionStorage.polygon;
    var loader = this,
        items = {}, 
        data, placemarks, nList, coords, pmobj;
    
    // get TimeMap utilty functions
    // assigning to variables should compress better
    var util = TimeMap.util,
        getTagValue = util.getTagValue,

        makePoint = util.makePoint,
        makePoly = util.makePoly,
        formatDate = util.formatDate;
	if(sessionStorage.polyline){
	items.polyline = (JSON.parse(sessionStorage.polyline));
	}else{
	items.polyline = [];
	}

	if(sessionStorage.marker){
	items.marker = (JSON.parse(sessionStorage.marker));
	}else{
	items.marker = [];
	}
	
	items2= [
	                        {
	                          "start" : "1980-01-02",
	                          "end" : "1990-01-02",
	                          "polygon" : [{"lat":43.79488907226601,"lon":12.205711364746094},{"lat":41.812977041006626,"lon":11.228370666503906},{"lat":43.89488907226601,"lon":12.205711364746094}],
	                          "title" : "Firenze"
	                        },
							{
	                          "start" : "1980-01-02",
	                          "end" : "1990-01-02",
	                          "polygon" : [{"lat":42.79488907226601,"lon":12.205711364746094},{"lat":42.812977041006626,"lon":11.228370666503906},{"lat":42.89488907226601,"lon":22.205711364746094}],
	                          "title" : "Firenze"
	                        },
	                    ]
    return items;
};
