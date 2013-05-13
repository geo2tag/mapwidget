function MapWidget(latitude, longitude, radius, widgetName){
	this.latitude = latitude;
	this.longitude = longitude;
	this.widgetName = widgetName;
	this.radius = radius;
	this.map = null;
	this.markers = new Array() ;
	this.mapControl = null;
	this.authToken = null;
	
	// Listeners
	this.onLoginListeners = new Array();
	this.onFilterSuccessListeners = new Array();
	
	this.initMapWidget();
}

/*
* Initialize map widget
*/ 
MapWidget.prototype.initMapWidget = function (){
	// Map initialization
	this.map = L.map(this.widgetName).setView([this.latitude , this.longitude], 13);

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
	}).addTo(this.map);
}
	
/*
 * Add tags array to the map
 * @param {array<tag>} tags
 * @param {stirng} fieldToGroup - name of tag object, which will be used for tag grouping (user, channel ..)
 */
MapWidget.prototype.addTagsToMap = function ( tags, fieldToGroup ){
	this.removeAllTagsFromMap();
	
	if (tags.length == 0 ) return;
 
	var tagMarkers = new Object();

	for (var i =0 ; i < tags.length ; i++){
		var tag = tags[i];
		var currentMarker = L.marker([tag.latitude, tag.longitude]).
		bindPopup(DataMark.getStringRepresentation(tag));
		 
		if ( !(tag[fieldToGroup] in tagMarkers) ){
			tagMarkers[tag[fieldToGroup]] = new Array();
			console.log("Creating array for " + tag[fieldToGroup]);
		}
		
		this.markers.push(currentMarker);
		
		tagMarkers[tag[fieldToGroup]].push(currentMarker);
	}
	
	this.addLayerControl(tagMarkers);
}

/* 
 * Creates UI element with checkbox for each user
 * @param {map user - tag array} tagMarkers
 */
MapWidget.prototype.addLayerControl = function (tagMarkers){
	overlayMaps = new Object();
	
	for (var u in tagMarkers){
		console.log(u+ " " + tagMarkers[u].length);
		var currentGroup = L.layerGroup(tagMarkers[u]).addTo(this.map);
		overlayMaps[u] = currentGroup;	
	} 
	this.mapControl = L.control.layers(null, overlayMaps).addTo(this.map);
}
	
/*
 * Remove all tags from map
 */
MapWidget.prototype.removeAllTagsFromMap = function(){
	if (this.markers.length == 0  ) return;
	for (var i = 0 ; i<this.markers.length; i++){
		this.map.removeLayer(this.markers[i]);
	}
	this.markers.length=0;

	this.map.removeControl(this.mapControl);
}	

/*
 * Centers map in (this.latitude, this.longitude)
 */
MapWidget.prototype.centerInDefaultPosition = function(){

	this.map.panTo(new L.LatLng(this.latitude, this.longitude));
}
	
/*
 * Change (this.latitude, this.longitude) and call centerInDefaultPosition
 */
MapWidget.prototype.changeMapCenter = function (latitude, longitude){
	this.latitude = latitude;
	this.longitude = longitude;
	this.centerInDefaultPosition();
}	
	
MapWidget.prototype.login = function (userName, password){
	sendLoginRequest(userName, password,
		bind(this, "onLoginSuccess"), bind(this, "onErrorOccured"));
}	
	
/*
 * Load tags for coordinates this.latitude, this.longitude and this.radius 
 */
MapWidget.prototype.loadTags = function (latitude, longitude, radius){

	if (this.authToken == null) return;

	sendLoadTagsRequest(this.authToken, latitude, longitude, radius, 
		bind(this, "onLoadTagsSuccess"), bind(this, "onErrorOccured"));
		
};

/*
 * Perform filterCircle request
 */
MapWidget.prototype.filterCircle = function (latitude, longitude, radius, timeFrom, timeTo){

	if (this.authToken == null) return;

	sendFilterCircleRequest(this.authToken, latitude, longitude, timeFrom, timeTo, radius, null,
		bind(this, "onFilterSuccess"), bind(this, "onErrorOccured"));
		
}

/* 
 * Add listener to onFilterSuccess event
 * @param {function()} listener
 */
MapWidget.prototype.addOnFilterSuccessListener = function (listener){
	if (this.onFilterSuccessListeners.indexOf(listener) == -1){
		this.onFilterSuccessListeners.push(listener);
	}
}

MapWidget.prototype.onFilterSuccess = function (jsonResponse){

	for (var i=0; i<this.onFilterSuccessListeners.length ; i++){
		console.log("Executing "+i+" listener");
		(this.onFilterSuccessListeners[i])();
	}

	var channels = jsonResponse.channels;
	var tags = new Array();
	for (var i=0; i< channels.length; i++ ){
		var channelTags = channels[i].channel.items;
		var channelName = channels[i].channel.name;
		for (var j=0; j<channelTags.length; j++){
			var tag = channelTags[j];
			tag["channel"] = channelName;
			tags.push(tag);
		}
	}
	//console.log("onFilterCircleSuccess: Loaded "+ tags.length + " tags");
	this.addTagsToMap(tags, "channel");
}	
		
/*
 * Store auth_token and trigger onLoginListeners
 */
MapWidget.prototype.onLoginSuccess = function (jsonResponse){
	this.authToken = jsonResponse.auth_token;
	console.log("LoginQuery succed");
	for (var i=0; i<this.onLoginListeners.length ; i++){
		console.log("Executing "+i+" listener");
		(this.onLoginListeners[i])();
	}
		
	
}



MapWidget.prototype.onLoadTagsSuccess = function (jsonResponse){

	var tags = jsonResponse.rss.channels.items[0].items;
	console.log("onLoadTagsSuccess: Loaded "+ tags.length + " tags");
	this.addTagsToMap(tags, "user");
}
	
MapWidget.prototype.onErrorOccured = function (jsonResponse){
	alert("Error during requests processing, errno = "+jsonResponse.errno);
}


/* 
 * Add listener to onLogin event
 * @param {function()} listener
 */
MapWidget.prototype.addOnLoginListener = function (listener){
	if (this.onLoginListeners.indexOf(listener) == -1){
		this.onLoginListeners.push(listener);
	}
}


/*
 * Hack for passing methods as function arguments
 * TODO add var_arg support for general usage
 */
function bind(toObject, methodName){
    return function(jsonResponse){toObject[methodName](jsonResponse)}
}
