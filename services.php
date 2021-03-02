<?php
/*

MongoDB is dead, let this awesome API rule the world!
This service manages a collection of objects with free fields.

Mandatory entry: 
	action = what you want

Objects id:
	ids are named "id". Too much creativity to handle!
	ids are not sorted. Deal with it!

Answers: 
	always JSON
	for errors (there will not be if you're enough talented) or data.

Methods:
	post & get, indifferently ("get" wins if conccurency)

Storage: 
	all your data are stored in a fantastic database, 
	i.e. a file names "data.json". Delete this file to reset your data.

Services list:
	http://.../services.php?action=list
	http://.../services.php?action=add&x=42&message=hop 
	http://.../services.php?action=delete&id=42
	http://.../services.php?action=update&id=42&x=73&message=plop&newstuff=beer

*/
header("Content-Type: application/json");

$p = [];
foreach($_POST as $k=>$v) $p[$k] = $v;
foreach($_GET as $k=>$v) $p[$k] = $v;

$filename = "data.json";
if (!file_exists($filename))
	file_put_contents($filename, '[]');

$data = json_decode(file_get_contents("data.json"), false);


if (isset($p["action"])) {

	switch ($p["action"]) {
		//---------------------------------------------------------------------
	    case "list":
	    	echo json_encode($data);
	        break;

		//---------------------------------------------------------------------
	    case "add":
	    	$id = rand(0,0xFFFF); // Probably broken, but low probability
	    	$o = new stdClass();
	    	$o->id = $id;
	    	foreach($p as $k => $v)
	    		if ($k != "action")
	    			$o->$k = $v;
	    	$data[] = $o;
	    	file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
	    	echo json_encode([ "success" => "add", "object" => $o]);
	        break;

		//---------------------------------------------------------------------
	    case "delete":
	    	if (isset($p["id"])) {
	    		$i=0; $deleted = false;
	    		while ($i<count($data) && !$deleted) {
	    			if ($data[$i]->id == $p["id"]) {
	    				array_splice($data, $i, 1);
	    				$deleted = true;
	    			}
	    			$i++;
	    		}
	    		if ($deleted) {
			    	file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
			    	echo json_encode([ "success" => "delete"]);		    	
	    		} else {
			    	echo json_encode([ "error" => "unknownId", "message" => "wtf you want to delete?"]);
	    		}
	    	} else {
		    	echo json_encode([ "error" => "missingId", "message" => "wtf is the id?"]);
	    	}
	        break;

	    //---------------------------------------------------------------------
	    case "update":
	    	if (isset($p["id"])) {
	    		$i=0; $found = false;
	    		while ($i<count($data) && !$found) {
	    			$found = $data[$i]->id == $p["id"];
	    			$i++;
	    		}
	    		if ($found) {
	    			$o = $data[$i-1];
					foreach($p as $k => $v)
			    		if ($k != "action")
			    			$o->$k = $v;
			    	file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
			    	echo json_encode([ "success" => "update"]);		    	
	    		} else {
			    	echo json_encode([ "error" => "unknownId", "message" => "wtf you want to update?"]);
	    		}
	    	} else {
		    	echo json_encode([ "error" => "missingId", "message" => "wtf is the id?"]);
	    	}
	        break;

		//---------------------------------------------------------------------
	    default: 
	    	echo json_encode([ "error" => "unknownAction", "message" => "wtf are you asking for?"]);
	}

} else {
	echo json_encode([ "error" => "noAction", "message" => "wtf do you need?"]);
}
