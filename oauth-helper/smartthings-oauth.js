
var current_step = 0;
var client_id = "";
var client_secret = "";
var auth_code = "";
var access_token = "";
var endpoint_uri = "";
// add: response_type=code, scope=app, client_id, and redirect_uri to GET parameters
var authorize_uri = "https://graph.api.smartthings.com/oauth/authorize";
var endpoints_uri = "https://graph.api.smartthings.com/api/smartapps/endpoints";

var step = [ "Please enter the Client ID from the OAuth section of the SmartApp's settings page.",
             "Click Next Step and you will be redirected to the SmartThings site to sign in, and assign what devices can be accessed.",
             "Enter the Client Secret from the OAuth section of the SmartApp's settings page.",
             "Click Next Step to get the token.",
             "Congratulations, here are your token and url to access the SmartApp."
           ]
var stepError = "Something didn't work, sorry."


$( document ).ready(function() {
    console.log( "ready!" );
    whatStep();
});

// Thanks: http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

//TODO: figure out what step we are on based on get params, or form input.
function whatStep(){
    //Is the client ID already set in a cookie?
    var cookie = decodeURIComponent(document.cookie);
    console.log(cookie);
    if (cookie.match(/^clientID=[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/)){
        current_step = 1;
        client_id = cookie.substring(9);
        $("#client_id_input").val(client_id);
    }
 
    //Is this a callback, and did we get an auth code?
    var code = getUrlParameter('code');
    if (current_step == 1 && code != undefined && code.match(/\w{9}/)) {
        auth_code = code;
        current_step = 2;
        $("#client_secret_input").val("");
        $("#client_secret_input").attr("readonly",false);
        $("#client_id_input").attr("readonly",true);
    }
    setMessage(current_step);
    if (current_step > 0) {
        $("#resetButton").removeAttr("disabled");
    }
}

//TODO: set status message based on what step we are on
function setMessage(current_step) {
    $("#whatIsNext").html(step[current_step]);
}

//Validate Client ID format, returns int representing current state
function checkClientID(){
    if ($("#client_id_input").val().match(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/)) {
        setMessage(1);
        setClientCookie($("#client_id_input").val());
        $('input:submit').removeAttr("disabled");
        return 1;
    } else {
        return 0;
    }
}

//Validate Client Secret format, returns int representing current state
function checkClientSecret(){
    if ($("#client_secret_input").val().match(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/)) {
        $('input:submit').removeAttr("disabled");
        setMessage(3);
        return 3;
    } else {
        setMessage(2);
        return 2;
    }
}

function startOver(){
    $("#your_url").val("Your URL will appear here once complete.");
    $("#your_token").val("Your token will appear here once complete.");
    $("#client_secret_input").val("Required once an authorization code has been retrieved.");
    $("#client_secret_input").attr("readonly",true);
    $("#client_id_input").val("");
    $("#client_id_input").attr("readonly",false);
    document.cookie = "clientID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    $('input:submit').attr("disabled",true);
    setMessage(0);
}

//Store Client ID in a session Cookie with a short lifetime
function setClientCookie(value) {
    var d = new Date();
    // An hour seems reasonable ...
    d.setTime(d.getTime() + (60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = "clientID=" + value + ";" + expires + ";path=/";
}

//TODO: redirect to oauth authorize page
//
//TODO: validate Client Secret format returns bool
//
//TODO: parse, validate Token formating, and return token

