function MapWidget(latitude, longitude, widgetName){
	this.latitude = latitude;
	this.longitude = longitude;
	this.widgetName = widgetName;
	this.radius = 10;
	this.map = null;
	
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
	var tagMarkers = new Object();

	for (var i =0 ; i < tags.length ; i++){
		var tag = tags[i];
		var currentMarker = L.marker([tag.latitude, tag.longitude]).
		bindPopup("<b>" + tag.title +" (" + tag.pubDate + ")</b><br><a href="
		 + tag.link + ">"+tag.link+"</a><br>" +tag.description);
		 
		if ( !(tag.user in tagMarkers) ){
			tagMarkers[tag.user] = new Array();
			console.log("Creating array for " + tag.user);
		}
		
		tagMarkers[tag.user].push(currentMarker);
	}
	
	this.addLayerControl(tagMarkers);
}

/* 
 * Creates UI element with checkbox for each user
 * @param {map user - tag array} tagMarkers
 */
MapWidget.prototype.addLayerControl = function (tagMarkers){
	var overlayMaps = new Object();
	
	for (var u in tagMarkers){
		console.log(u+ " " + tagMarkers[u].length);
		var currentGroup = L.layerGroup(tagMarkers[u]).addTo(this.map);
		overlayMaps[u] = currentGroup;	
	} 
	L.control.layers(null, overlayMaps).addTo(this.map);
}
	
// TODO find how remove all tags 	
MapWidget.prototype.removeAllTagsFromMap = function(){
	
}	

MapWidget.prototype.centerInDefaultPosition = function(){

	this.map.panTo(new L.LatLng(this.latitude, this.longtiude));
}
	
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
