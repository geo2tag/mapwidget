/*
	This file contains basic Geo2Tag REST API requests
 */

/*
 * Constants are stored into function static varialbes
 */
function SettingsStorage(){
	
	
	SettingsStorage.setServerUrl = function (serverUrl){
		SettingsStorage.SERVER_URL = serverUrl;
	};
	
	
}

// Default value
SettingsStorage.SERVER_URL = "http://demo64.geo2tag.org/service";

/*
 * DataMark class constructor
 * @param {number} longitude
 * @param {number} latitude
 * @param {number} altitude  
 * @param {string} title
 * @param {string} description 
 * @param {string} time - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds 
 * @param {string} user
 * @param {string} channel
 */
function DataMark(latitude, longitude, altitude, title, description, time, channel, time){
	this.latitude = latitude;
	this.longitude = longitude;
	this.altitude = altitude;
	this.title = title;
	this.description = description;
	this.time = time;
	this.user = user;
	this.channel = channel;
}

/*
 * Return string representation of tag
 * @param {tag} tag
 */
DataMark.getStringRepresentation = function(tag){
	var result = "<b>" + tag.title +"</b><br>By <b>" + tag.user + "</b>, "+ tag.pubDate + "<br><a href="
		 + tag.link + ">"+tag.link+"</a><br>" +tag.description;
	
	if ("channel" in tag){
		result = result + "<br>Channel: "+tag.channel;
	}	 
	
	return result;
};

/*
 * Perform POST async request
 * @param {string} url 
 * @param {string} data
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function doRequestInternal(url, data, onLoadCallback, onErrorCallback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('POST', SettingsStorage.SERVER_URL + url, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

	console.log("Sending "+data+ ", to "+url);

	xhr.onload = function() {
		// Parsing response 
		var responseObject = JSON.parse(this.responseText);
		// Now response is a map
		errno = responseObject["errno"];
		
		if (errno == 0){
		
			onLoadCallback(responseObject);
		}else{		
			onErrorCallback(responseObject);
		}
	};

	xhr.onerror =  function() {
		var responseObject = JSON.parse(this.responseText);
		onErrorCallback(responseObject);
	};
	xhr.send(data);

}

/* 
 * @param {function (jsonObject)} onLoadCallback 
 * @param {function (jsonObject)} onErrorCallback
 */
function sendVersionRequest( data, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/version";
	
	doRequestInternal(serverUrl + REQUEST_URL, "", onLoadCallback, onErrorCallback);
}


/* 
 * @param {string} loginText 
 * @param {string} passwordText
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendLoginRequest(loginText, passwordText, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/login";
	
	// Create custom object
	var data = {
		login: loginText,
		password: passwordText
	};
	
	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} authToken
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendAvailableChannelsRequest(authToken, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/channels";
	
	// Create custom object
	var data = {
		auth_token: authToken
	};

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} authToken
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendSubscribedChannelsRequest(authToken, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/subscribed";
	
	// Create custom object
	var data = {
		auth_token: authToken
	};

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} authToken
 * @param {string} channelName
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendSubscribeChannelRequest(authToken, channelName, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/subscribe";
	
	// Create custom object
	var data = {
		auth_token: authToken,
		channel: channelName
	};

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} authToken
 * @param {string} channelName
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendUnsubscribeChannelRequest(authToken, channelName, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/unsubscribe";
	
	// Create custom object
	var data = {
		auth_token: authToken,
		channel: channelName
	};

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} authToken
 * @param {number} longitude
 * @param {number} latitude
 * @param {number} radius 
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendLoadTagsRequest(authToken, latitude, longitude, radius, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/loadTags";
	
	// Create custom object
	var data = {
		auth_token: authToken,
		latitude: latitude,
		longitude: longitude,
		radius: radius
	};

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} authToken
 * @param {string} channel
 * @param {string} title
 * @param {string} description  
 * @param {number} longitude
 * @param {number} latitude
 * @param {number} altitude 
 * @param {string} time - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendWriteTagRequest(authToken, channel, title, description, longitude, latitude, altitude, time, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/writeTag";
	
	// Create custom object
	var data = {
		auth_token: authToken,
		channel: channel,
		title: title,
		description: description,
		latitude: latitude,
		longitude: longitude,
		altitude: altitude,
		time: time
	};

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}


/* 
 * Build Json object, common for all flat filters 
 * @param {string} authToken
 * @param {string} timeFrom  - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} timeTo  - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} channel, optional field
  */
function buildJsonFor2dFilter(authToken, timeFrom, timeTo, channel){
	var data = {
		auth_token: authToken,
		time_from: timeFrom,
		time_to: timeTo
	}

	if ( channel !== undefined) data["channel"] = channel; 
	
	return data;
}


/* 
 * @param {string} authToken
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} timeFrom - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} timeTo - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {number} radius
 * @param {string} channel, optional field
 */
function sendFilterCircleRequest(authToken, latitude, longitude, timeFrom, timeTo, radius, channel, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/filterCircle";
	
	// Create custom object
	var data = sendFilterCircleRequest.buildJson(
		buildJsonFor2dFilter(authToken, timeFrom, timeTo, channel), latitude, longitude, radius);

	//var data = sendFilterCircleRequest.buildJson(authToken, latitude, longitude, timeFrom, timeTo, radius, channel);

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * Build json object for filterCircle request
 * @param {object} data
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} radius
 */
sendFilterCircleRequest.buildJson = function (data, latitude, longitude, radius){
	
	data["latitude"] = latitude;
	data["longitude"] = longitude;
	data["radius"] = radius;
	
	
	return data;
}

/* 
 * @param {string} authToken
 * @param {number} latitude1
 * @param {number} longitude1
 * @param {number} latitude2
 * @param {number} longitude2
 * @param {string} timeFrom - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} timeTo - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} channel, optional field
 */
function sendFilterRectangleRequest(authToken, latitude1, longitude1, latitude2, longitude2, timeFrom, timeTo, 
									channel, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/filterRectangle";
	
	var data = sendFilterRectangleRequest.buildJson
		(buildJsonFor2dFilter(authToken, timeFrom, timeTo, channel), latitude1, longitude1, latitude2, longitude2);

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * Build json object for filterRectangle request
 * @param {object} data
 * @param {number} latitude1
 * @param {number} longitude1
 * @param {number} latitude2
 * @param {number} longitude2
 */
sendFilterRectangleRequest.buildJson = function (data, latitude1, longitude1, latitude2, longitude2){
	// Create custom object
	
	(data["latitude_shift"])["latitude1"] = latitude1;
	(data["latitude_shift"])["latitude2"] = latitude2;
	
	(data["longitude_shift"])["longitude1"] = longitude1;
	(data["longitude_shift"])["longitude2"] = longitude2;
	return data;
}



/* 
 * @param {string} authToken
 * @param {array} polygon
 * @param {string} timeFrom - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} timeTo - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} channel, optional field
 */
function sendFilterPolygonRequest(authToken, polygon, timeFrom, timeTo, channel, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/filterPolygon";
	
	var data = sendFilterPolygonRequest.buildJson(buildJsonFor2dFilter(authToken, timeFrom, timeTo, channel), polygon);

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * Build json object for filterPolygon request
 * @param {object} data
 * @param {array} polygon
 */
sendFilterPolygonRequest.buildJson = function (data, polygon){
	// Create custom object
	
	var points = new Array();
		
	for (var i = 0 ; i<polygon.length; i++){
		var point = new Object();
		
		point["number"] = i;
		point["latitude"] = polygon[i].latitude;
		point["longitude"] = polygon[i].longitude;
		
		points.push(point);
	}
	
	data["polygon"] = points;
	
	return data;
}

/* 
 * Build Json object, common for all 3d filters 
 * @param {string} authToken
 * @param {string} timeFrom  - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} timeTo  - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} channel, optional field
 * @param {number} altitude1
 * @param {number} altitude2
 */
function buildJsonFor3dFilter(authToken, timeFrom, timeTo, channel, altitude1, altitude2){
	var data = buildJsonFor2dFilter(authToken, timeFrom, timeTo, channel);

	(data["altitude_shift"])["altitude1"] = altitude1;
	(data["altitude_shift"])["altitude2"] = altitude2;
	
	return data;
}

/* 
 * @param {string} authToken
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} timeFrom - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} timeTo - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {number} radius
 * @param {string} channel, optional field
 * @param {number} altitude1
 * @param {number} altitude2
 */
function sendFilterCylinderRequest(authToken, latitude, longitude, timeFrom, timeTo, radius, channel, altitude1, altitude2, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/filterCylinder";
	
	// Create custom object
	var data = sendFilterCircleRequest.buildJson(
		buildJsonFor3dFilter(authToken, timeFrom, timeTo, channel, altitude1, altitude2), latitude, longitude, radius);

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} authToken
 * @param {number} latitude1
 * @param {number} longitude1
 * @param {number} latitude2
 * @param {number} longitude2
 * @param {string} timeFrom - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} timeTo - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} channel, optional field
 * @param {number} altitude1
 * @param {number} altitude2
 */
function sendFilterBoxRequest(authToken, latitude1, longitude1, latitude2, longitude2, timeFrom, timeTo, 
									channel, altitude1, altitude2, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/filterBox";
	
	var data = sendFilterRectangleRequest.buildJson
		(buildJsonFor3dFilter(authToken, timeFrom, timeTo, channel, altitude1, altitude2), latitude1, longitude1, latitude2, longitude2);

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} authToken
 * @param {array} polygon
 * @param {string} timeFrom - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} timeTo - in format "09 05 2013 02:05:48.356" - date month year hour:minutes:seconds.milliseconds
 * @param {string} channel, optional field
 * @param {number} altitude1
 * @param {number} altitude2
 */
function sendFilterPolygonRequest(authToken, polygon, timeFrom, timeTo, channel, altitude1, altitude2, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/filterFence";
	
	var data = sendFilterPolygonRequest.buildJson(buildJsonFor3dFilter(authToken, timeFrom, timeTo, channel, altitude1, altitude2), polygon);

	doRequestInternal(REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}