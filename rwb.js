/* jshint strict: false */
/* global $: false, google: false */
//
// Red, White, and Blue JavaScript 
// for EECS 339 Project A at Northwestern University
//
// Originally by Peter Dinda
// Sanitized and improved by Ben Rothman
//
//
// Global state
//
// html    - the document itself ($. or $(document).)
// map     - the map object
// usermark- marks the user's position on the map
// markers - list of markers on the current map (not including the user position)
//
//

//
// When the document has finished loading, the browser
// will invoke the function supplied here.  This
// is an anonymous function that simply requests that the 
// brower determine the current position, and when it's
// done, call the "Start" function  (which is at the end
// of this file)
// 
//
$(document).ready(function() {
	navigator.geolocation.getCurrentPosition(Start);
});

// Global variables
var map, usermark, markers = [],


// UpdateMapById draws markers of a given category (id)
// onto the map using the data for that id stashed within 
// the document.
UpdateMapById = function(id, tag) {
// the document division that contains our data is #committees 
// if id=committees, and so on..
// We previously placed the data into that division as a string where
// each line is a separate data item (e.g., a committee) and
// tabs within a line separate fields (e.g., committee name, committee id, etc)
// 
// first, we slice the string into an array of strings, one per 
// line / data item
	var dataHtml = $("#"+id).html();
	var rows;
	if (dataHtml!=null){
		rows  = dataHtml.split("\n");
	}else{
		return;
	}
	

// then, for each line / data item
	for (var i=0; i<rows.length; i++) {
// we slice it into tab-delimited chunks (the fields)
		var cols = rows[i].split("\t"),
// grab specific fields like lat and long
			lat = cols[0],
			long = cols[1];

// then add them to the map.   Here the "new google.maps.Marker"
// creates the marker and adds it to the map at the lat/long position
// and "markers.push" adds it to our list of markers so we can
// delete it later 
		markers.push(new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(lat,long),
			title: tag+"\n"+cols.join("\n")
		}));

	}
},

//
// ClearMarkers just removes the existing data markers from
// the map and from the list of markers.
//
ClearMarkers = function() {
	// clear the markers
	while (markers.length>0) {
		markers.pop().setMap(null);
	}
},

//
// UpdateMap takes data sitting in the hidden data division of 
// the document and it draws it appropriately on the map
//
UpdateMap = function() {
// We're consuming the data, so we'll reset the "color"
// division to white and to indicate that we are updating
	var color = $("#color");
	color.css("background-color", "white")
		.html("<b><blink>Updating Display...</blink></b>");

// Remove any existing data markers from the map
	ClearMarkers();

// Then we'll draw any new markers onto the map, by category
// Note that there additional categories here that are 
// commented out...  Those might help with the project...
//
	UpdateMapById("committee_data","COMMITTEE");
	UpdateMapById("candidate_data","CANDIDATE");
	UpdateMapById("individual_data", "INDIVIDUAL");
	UpdateMapById("opinion_data","OPINION");

	color.html("Ready");



	$('#summary-committee').css('background-color',$('#committee-contributions').attr('color'));
	$('#summary-candidate').css('background-color',$('#candidate-contributions').attr('color'));
	$('#summary-individual').css('background-color',$('#individual-contributions').attr('color'));
	$('#summary-opinion').css('background-color',$('#opinion-contributions').attr('color'));
	
	$('#summary-committee').html($('#committee-contributions').html());
	$('#summary-candidate').html($('#candidate-contributions').html());
	$('#summary-individual').html($('#individual-contributions').html());
	$('#summary-opinion').html($('#opinion-contributions').html());

// When we're done with the map update, we print summary
	summary();
}

//
// NewData is called by the browser after any request
// for data we have initiated completes
//
NewData = function(data) {
// All it does is copy the data that came back from the server
// into the data division of the document.   This is a hidden 
// division we use to cache it locally
	$("#data").html(data);
// Now that the new data is in the document, we use it to
// update the map
	UpdateMap();
},

summary = function(){
		// Check which checkbox is checked.
	var elLength = document.checkboxForm.elements.length;
	var checkedText="";
	var summaryInnerHTMLString="Summary<br>";
	var summary = $("#summary");
	var totalValue=0;
    for (i=0; i<elLength; i++)
    {
        var type = checkboxForm.elements[i].type;
        if (type=="checkbox" && checkboxForm.elements[i].checked){
            //alert("Form element in position " + i + " is of type checkbox and is checked.");
            if (checkedText!=""){
            	checkedText = checkedText.concat(",");
            }
            switch(i){
            	case 0: //Candidates
            		if (document.getElementById("colorC"))
            			summaryInnerHTMLString = summaryInnerHTMLString.concat("<h1 style=\"color:"+document.getElementById("colorC").value+"\">Commities financial data:Democratic: \$ "+ document.getElementById("DemC").value + " Rebuplican: \$ " + document.getElementById("RepC").value+"<br></h1>");
            		break;
            	case 2: //Individuals
            		if (document.getElementById("colorI"))
            			summaryInnerHTMLString = summaryInnerHTMLString.concat("<h1 style=\"color:"+document.getElementById("colorI").value+"\">Individuals financial data:Democratic: \$ "+ document.getElementById("DemI").value + " Rebuplican: \$ " + document.getElementById("RepI").value+"<br></h1>");
            		break;
            	case 3: //Opinions
            		if (document.getElementById("colorO"))
            			summaryInnerHTMLString = summaryInnerHTMLString.concat("<h1 style=\"color:"+document.getElementById("colorO").value+"\">Opinions data:Average: \$ "+ document.getElementById("avg").value + " Standard Deviation: \$ " + document.getElementById("std").value+"<br></h1>");
            }
        }
    }
    if (summaryInnerHTMLString=="Summary<br>"){
    	summaryInnerHTMLString="Commities,Individuals, and Opinions all not selected<br>";
    }
    summary.html(summaryInnerHTMLString);

  //    if (checkedText=="committees"){
		// color.style.backgroundColor=document.getElementById("colorC").value;
		// color.innerHTML="Ready<br>";
		// color.innerHTML+="Democratic: $" + document.getElementById("DemC").value + "<br>";
		// color.innerHTML+="Rebuplican: $" + document.getElementById("RepC").value;
		// }
         

     
  //    if (checkedText=="individuals"){
		//  color.style.backgroundColor=document.getElementById("colorI").value;         
  //    color.innerHTML="Ready<br>";
  //    color.innerHTML+="Democratic: $" + document.getElementById("DemI").value + "<br>";
  //    color.innerHTML+="Rebuplican: $" + document.getElementById("RepI").value;
  //   }
    
  //     if (checkedText=="opinions"){
		//  color.style.backgroundColor=document.getElementById("colorO").value;         
  //    color.innerHTML="Ready<br>";
  //    color.innerHTML+="Average: " + document.getElementById("avg").value "<br>";
  //    color.innerHTML+="Standard Deviation: " + document.getElementById("std").value;
  //   }
    }
//
// The Google Map calls us back at ViewShift when some aspect
// of the map changes (for example its bounds, zoom, etc)
// It will also be called when the filter changed(cycle drop-down list,checkbox etc.)
//
ViewShift = function() {
	// We determine the new bounds of the map
	var bounds = map.getBounds(),
		ne = bounds.getNorthEast(),
		sw = bounds.getSouthWest();

	var cycleVal="";//Stores string for election cycle
	var e = document.getElementById("cycleDropdown");

	for (var i = 0; i < e.options.length; i++) {
	   if(e.options[i].selected ==true){
	   		if (cycleVal!=""){
            	cycleVal = cycleVal.concat(",");
            }
	        cycleVal =cycleVal.concat(e.options[i].value);
	    }
	}

	if (cycleVal==null || cycleVal==""){
		//cycleVal="1112";
		ClearMarkers();
		return;
	}

	// Check which checkbox is checked.
	var elLength = document.checkboxForm.elements.length;
	var checkedText="";
    for (i=0; i<elLength; i++)
    {
        var type = checkboxForm.elements[i].type;
        if (type=="checkbox" && checkboxForm.elements[i].checked){
            //alert("Form element in position " + i + " is of type checkbox and is checked.");
            if (checkedText!=""){
            	checkedText = checkedText.concat(",");
            }
            switch(i){
            	case 0:
            		checkedText = checkedText.concat("committees");
            		break;
            	case 1:
            		checkedText = checkedText.concat("candidates");
            		break;
            	case 2:
            		checkedText = checkedText.concat("individuals");
            		break;
            	case 3:
            		checkedText = checkedText.concat("opinions");
            		
            }
        }
    }
	var element = document.getElementById("debugText");
	element.innerHTML = checkedText;
	if (checkedText!=""){
		// Now we need to update our data based on those bounds
		// first step is to mark the color division as white and to say "Querying"
		$("#color").css("background-color","white")
			.html("<b><blink>Querying...("+ne.lat()+","+ne.lng()+") to ("+sw.lat()+","+sw.lng()+")</blink></b>");

		// Now we make a web request.   Here we are invoking rwb.pl on the 
		// server, passing it the act, latne, etc, parameters for the current
		// map info, requested data, etc.
		// the browser will also automatically send back the cookie so we keep
		// any authentication state
		// 
		// This *initiates* the request back to the server.  When it is done,
		// the browser will call us back at the function NewData (given above)
	
		$.get("rwb.pl",
		{
			act:	"near",
			latne:	ne.lat(),
			longne:	ne.lng(),
			latsw:	sw.lat(),
			longsw:	sw.lng(),
			format:	"raw",
			what:	checkedText,
			cycle:  cycleVal
		}, NewData);
	}else{
		ClearMarkers();
		$("#color").css("background-color","white")
			.html("<b>No option selected...</b>");
		return;
	}
	
	summary();
}


//
// If the browser determines the current location has changed, it 
// will call us back via this function, giving us the new location
//
Reposition = function(pos) {
// We parse the new location into latitude and longitude
	var lat = pos.coords.latitude,
		long = pos.coords.longitude;

// ... and scroll the map to be centered at that position
// this should trigger the map to call us back at ViewShift()
	map.setCenter(new google.maps.LatLng(lat,long));
// ... and set our user's marker on the map to the new position
	usermark.setPosition(new google.maps.LatLng(lat,long));
},


//
// The start function is called back once the document has 
// been loaded and the browser has determined the current location
//
Start = function(location) {
// Parse the current location into latitude and longitude        
	var lat = location.coords.latitude,
	    long = location.coords.longitude,
	    acc = location.coords.accuracy,
// Get a pointer to the "map" division of the document
// We will put a google map into that division
	    mapc = $("#map");

// Create a new google map centered at the current location
// and place it into the map division of the document
	map = new google.maps.Map(mapc[0],
		{
			zoom: 16,
			center: new google.maps.LatLng(lat,long),
			mapTypeId: google.maps.MapTypeId.HYBRID
		});

// create a marker for the user's location and place it on the map
	usermark = new google.maps.Marker({ map:map,
		position: new google.maps.LatLng(lat,long),
		title: "You are here"});

// clear list of markers we added to map (none yet)
// these markers are committees, candidates, etc
	markers = [];

// set the color for "color" division of the document to white
// And change it to read "waiting for first position"
	$("#color").css("background-color", "white")
		.html("<b><blink>Waiting for first position</blink></b>");

//
// These lines register callbacks.   If the user scrolls the map, 
// zooms the map, etc, then our function "ViewShift" (defined above
// will be called after the map is redrawn
//
	google.maps.event.addListener(map,"bounds_changed",ViewShift);
	google.maps.event.addListener(map,"center_changed",ViewShift);
	google.maps.event.addListener(map,"zoom_changed",ViewShift);

//
// Finally, tell the browser that if the current location changes, it
// should call back to our "Reposition" function (defined above)
//
	navigator.geolocation.watchPosition(Reposition);
};

