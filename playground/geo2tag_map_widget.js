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
	

MapWidget.prototype.addTagsToMap = function ( tags ){
	for (var i =0 ; i < tags.length ; i++){
		var tag = tags[i];
		L.marker([tag.latitude, tag.longitude]).addTo(this.map)
		.bindPopup("<b>" + tag.title +" (" + tag.pubDate + ")</b><br><a href="
		 + tag.link + ">"+tag.link+"</a><br>" +tag.description);
	}
};
	
	
	
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
