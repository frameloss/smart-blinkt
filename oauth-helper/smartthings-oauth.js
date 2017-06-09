
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
             "Click submit and you will be redirected to the SmartThings site to sign in, and assign what devices can be accessed.",
             "Enter the Client Secret from the OAuth section of the SmartApp's settings page.",
             "Congratulations, here are your token and url to access the SmartApp."
           ]
var stepError = "Something didn't work, sorry."

//TODO: figure out what step we are on based on get params, or form input.
//
//TODO: set status message based on what step we are on
//
//TODO: validate Client ID format, returns bool
//
//TODO: store Client ID in a session Cookie with a short lifetime, returns bool
//
//TODO: redirect to oauth authorize page
//
//TODO: extract auth code from GET param, validate format, and return variable
//
//TODO: validate Client Secret format returns bool
//
//TODO: parse, validate Token formating, and return token
//
//TODO: set visibility on 

