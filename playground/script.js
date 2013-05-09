

/*
 * Event handler for button
 */
function onLoginButtonClicked(){
	
	// Access input fields
	var loginEdit = document.getElementById('login_edit');
	var passwordEdit = document.getElementById('password_edit');

	var loginText = loginEdit.value;
	var passwordText = passwordEdit.value;
	
	// Define callbacks 
	var onLoadCallback = onLoginRequestSuccess;
	
	var onErrorCallback = onErrorOccured;
	
	// Do request
	sendLoginRequest(loginText, passwordText, onLoadCallback, onErrorCallback);
	
}


function onErrorOccured(jsonResponse){
	// Access div tag
	setElementText("error_field", "Error, code = "+jsonResponse.errno);
}

function onLoginRequestSuccess(jsonResponse){
	var auth_token = jsonResponse.auth_token;
	setElementText("auth_token_field",auth_token);

	sendAvailableChannelsRequest(auth_token, onAvailableChannelsRequestSuccess, onErrorOccured);
}

function onAvailableChannelsRequestSuccess(jsonResponse){
	var channelsText = "";
	
	var channels = jsonResponse.channels;
	
	for (var i = 0 ; i < channels.length ; i++){
		channelsText = channelsText + channels[i].name + "<br>" ;
	}
	
	setElementText("channels_field", channelsText);
}


function setElementText(elementName, text){
	var elem = document.getElementById(elementName);
	elem.innerHTML = text;

}