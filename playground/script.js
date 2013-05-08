/*
 * Event handler for button
 */
function onLoginButtonClicked(){
	var SERVER_URL = "http://localhost/service";
	
	// Access div tag
	var elem = document.getElementById('auth_token_field');
	
	// Access input fields
	var loginEdit = document.getElementById('login_edit');
	var passwordEdit = document.getElementById('password_edit');

	var loginText = loginEdit.value;
	var passwordText = passwordEdit.value;
	
	// Define callbacks as anonimous functions
	var onLoadCallback = function(jsonResponse){

		elem.innerHTML = jsonResponse.auth_token;//this.responseText;
	};
	var onErrorCallback = function(jsonResponse){
		elem.innerHTML = "Error, code = "+jsonResponse.errno;
	};
	
	// Do request
	sendLoginRequest(SERVER_URL, loginText, passwordText, onLoadCallback, onErrorCallback);
	
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
	xhr.open('POST', url, true);
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
 * @param {string} serverUrl
 * @param {function (jsonObject)} onLoadCallback 
 * @param {function (jsonObject)} onErrorCallback
 */
function sendVersionRequest(serverUrl, data, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/version";
	
	doRequestInternal(serverUrl + REQUEST_URL, "", onLoadCallback, onErrorCallback);
}


/* 
 * @param {string} serverUrl
 * @param {string} loginText 
 * @param {string} passwordText
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendLoginRequest(serverUrl, loginText, passwordText, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/login";
	
	// Create custom object
	var data = {
		login: loginText,
		password: passwordText
	};
	
	doRequestInternal(serverUrl + REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} serverUrl
 * @param {string} authToken
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendAvailableChannelsRequest(serverUrl, authToken, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/channels";
	
	// Create custom object
	var data = {
		auth_token: authToken,
	};

	doRequestInternal(serverUrl + REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} serverUrl
 * @param {string} authToken
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendSubscribedChannelsRequest(serverUrl, authToken, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/subscribed";
	
	// Create custom object
	var data = {
		auth_token: authToken,
	};

	doRequestInternal(serverUrl + REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} serverUrl
 * @param {string} authToken
 * @param {string} channelName
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendSubscribeChannelRequest(serverUrl, authToken, channelName, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/subscribe";
	
	// Create custom object
	var data = {
		auth_token: authToken,
		channel: channelName
	};

	doRequestInternal(serverUrl + REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} serverUrl
 * @param {string} authToken
 * @param {string} channelName
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendSubscribeChannelRequest(serverUrl, authToken, channelName, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/unsubscribe";
	
	// Create custom object
	var data = {
		auth_token: authToken,
		channel: channelName
	};

	doRequestInternal(serverUrl + REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}

/* 
 * @param {string} serverUrl
 * @param {string} authToken
 * @param {number} longitude
 * @param {number} latitude
 * @param {number} radius 
 * @param {function (jsonObject)} onLoadCallback
 * @param {function (jsonObject)} onErrorCallback
 */
function sendLoadTagsRequest(serverUrl, authToken, longitude, latitude, radius, onLoadCallback, onErrorCallback){
	var REQUEST_URL = "/loadTags";
	
	// Create custom object
	var data = {
		auth_token: authToken,
		channel: channelName
	};

	doRequestInternal(serverUrl + REQUEST_URL, JSON.stringify(data), /* Serialising object to string*/
		onLoadCallback, onErrorCallback);
}
