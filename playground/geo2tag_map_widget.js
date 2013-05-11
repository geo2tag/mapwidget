function MapWidget(latitude, longitude, radius, widgetName){
	this.latitude = latitude;
	this.longitude = longitude;
	this.widgetName = widgetName;
	this.radius = radius;
	this.map = null;
	this.markers = new Array() ;
	this.mapControl = null;
	
	
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
 */
MapWidget.prototype.addTagsToMap = function ( tags ){
	this.removeAllTagsFromMap();
	
	if (tags.length == 0 ) return;
 
	var tagMarkers = new Object();

	for (var i =0 ; i < tags.length ; i++){
		var tag = tags[i];
		var currentMarker = L.marker([tag.latitude, tag.longitude]).
		bindPopup(DataMark.getStringRepresentation(tag));
		 
		if ( !(tag.user in tagMarkers) ){
			tagMarkers[tag.user] = new Array();
			console.log("Creating array for " + tag.user);
		}
		
		this.markers.push(currentMarker);
		
		tagMarkers[tag.user].push(currentMarker);
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
	
/*
 * Login as (login, password)
 * Load tags for coordinates
 */
MapWidget.prototype.loadTagsForUser = function (login, password){

	sendLoginRequest(login, password, bind(this,"onLoginSuccess"), bind(this, "onErrorOccured"));
		
};
	
		

MapWidget.prototype.onLoginSuccess = function (jsonResponse){
	var auth_token = jsonResponse.auth_token;
		
	sendLoadTagsRequest(auth_token, this.latitude, this.longitude, this.radius, 
		bind(this, "onLoadTagsSuccess"), bind(this, "onErrorOccured"));
}

MapWidget.prototype.onLoadTagsSuccess = function (jsonResponse){

	var tags = jsonResponse.rss.channels.items[0].items;
	console.log("Loaded "+ tags.length + " tags");
	this.addTagsToMap(tags);
}
	
MapWidget.prototype.onErrorOccured = function (jsonResponse){
	alert("Error during requests processing, errno = "+jsonResponse.errno);
}




/*
 * Hack for passing methods as function arguments
 * TODO add var_arg support for general usage
 */
function bind(toObject, methodName){
    return function(jsonResponse){toObject[methodName](jsonResponse)}
}
