var power = "OFF";
var status = "starting";
var prevStatus = "starting";

//var targetDevice = "office_lights";
var targetDevice = "garage_door";

var SensorDeviceID = ["", "", ""];
var SwitchDeviceID = "";

if(targetDevice==="garage_door")
{
	//Get the IDs for the sensors from Smartthings Groovy IDE
	//Garage Door
	var SensorDeviceID = ["########", "contactSensor", "contact"]; //Garage door sensor
	var SwitchDeviceID = "#########"; //Garage Door
}
else if (targetDevice==="office_lights")
{
	//Get the IDs for the sensors from Smartthings Groovy IDE
	//Lights
	var SensorDeviceID = ["########", "switch", "switch"];
	var SwitchDeviceID = "########"; 
}
//Smartthings API token
var token = "#######";

function get_status()
{
	$.ajax({
		url: "https://api.smartthings.com/v1/devices/" + SensorDeviceID[0] + "/components/main/capabilities/" + SensorDeviceID[1] + "/status",
		type: "GET",
		headers: {"Authorization": "Bearer " + token}
	})
	.done(function(data){
		if((status!=="working" && prevStatus==="starting") || (status==="working" && prevStatus!=data[SensorDeviceID[2]].value))
		{
            $("#garage-door-state").html("<img style='width: 100px;' src='img/door-" + data[SensorDeviceID[2]].value + ".png' />");
			status = data[SensorDeviceID[2]].value;
			prevStatus = data[SensorDeviceID[2]].value;
		}
		//console.log(status + ":" + prevStatus + ":" + data[SensorDeviceID[2]].value);
	})
	.fail(function (jqXHR, textStatus) {
		console.log( "Request failed: " + textStatus + ":" + jqXHR.responseText);         
	});
	if(power==="ON")
	{
		setTimeout(get_status, 5000);
	}
}

function toggle_door()
{
	var target = "";
	if(targetDevice==="garage_door" || status.toLowerCase()==="off" || status.toLowerCase()==="closed" )
	{
		target = "on";
	}
	else
	{
		target = "off";
	}
	console.log("Target: " + target);
	status = "working";
	console.log(status);
	$("#garage-door-state").html("<img width='100px' src='img/working.png' />");
	$.ajax({
		url: "https://api.smartthings.com/v1/devices/" + SwitchDeviceID + "/commands",
		type: "POST",
		headers: {"Authorization": "Bearer " + token},
		data: JSON.stringify({"commands":[{"component": "main","capability": "switch","command": target}]}),
		success:function(data) {
			//setTimeout(function(){
				//get_status();
			 //},15000);
		}
	});
}

( function () {

	get_status();
	
	$("#garage-door-state").on("click", function(data) {
		toggle_door();
	});
	
	$("#Power").on("click", function(data) {
		if(power==="OFF")
		{
			power = "ON";
			get_status();
		}
		else
		{
			power = "OFF";
		}
		$("#Power").html("<img style='width:50px;' src='img/"+power+".png' />");
	});
} () );