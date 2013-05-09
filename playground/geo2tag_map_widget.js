function MapWidget(latitude, longitude, widgetName){
	this.latitude = latitude;
	this.longitude = longitude;
	this.widgetName = widgetName;
	this.radius = 10;
	this.map = null;
	
	MapWidget.instance = this;
		
	/*
	 * Initialize map widget
	 */ 
	this.initMapWidget = function (){
		// Map initialization
		this.map = L.map(this.widgetName).setView([this.latitude , this.longitude], 13);

		L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
		}).addTo(this.map);
	};
	

	this.addTagsToMap = function ( tags ){
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
	this.loadTagsForUser = function (login, password){

		sendLoginRequest(login, password, onLoginSuccess, onErrorOccured);
		
	};
	
	this.initMapWidget();
}


		

onLoginSuccess = function (jsonResponse){
	var auth_token = jsonResponse.auth_token;
		
	sendLoadTagsRequest(auth_token, MapWidget.instance.latitude, MapWidget.instance.longitude, MapWidget.instance.radius, 
		onLoadTagsSuccess, onErrorOccured);
}

onLoadTagsSuccess = function (jsonResponse){

	var tags = jsonResponse.rss.channels.items[0].items;
	MapWidget.instance.addTagsToMap(tags);
}
	
onErrorOccured = function (jsonResponse){
	alert("Error during requests processing, errno = "+jsonResponse.errno);
}

