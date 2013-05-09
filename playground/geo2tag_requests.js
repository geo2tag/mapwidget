/*
	This file contains basic Geo2Tag REST API requests
 */

/*
 * Constructor for class which stores constants
 */
function ConstantsStorage(){
	this.SERVER_URL = "http://localhost/service";
}

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
	xhr.open('POST', (new ConstantsStorage()).SERVER_URL + url, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

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
		auth_token: authToken,
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
		auth_token: authToken,
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
function sendSubscribeChannelRequest(authToken, channelName, onLoadCallback, onErrorCallback){
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
