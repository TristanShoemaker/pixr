<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Http\UploadedFile;

require '../vendor/autoload.php';

ob_end_clean();

$app = new \Slim\App;

$app->post('/users', 'addNewUser');
$app->get('/users','getUser');
$app->post('/upload', 'upload');
$app->get('/display', 'display');
$app->get('/python', 'snek');
$app->get('/imgdata/{imgname}', 'getData');
$app->delete('/deleteimg/{imgname}','deleteImg');
$app->delete('/deleteusr/{usrname}','deleteUsr');
$app->get('/getAll', 'getAllImages');
$app->get('/analyze/{flag}', 'analyze');

$app->run();

function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbname="pixr";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

function analyze(Request $request, Response $response, $args) {
	parse_str($args['flag']);
	if(! file_exists('../images/'.$imgname.'analysis/'.$imgname.''.$flag.'.png')) {
		$command = '//anaconda/bin/python ../py/analyze.py ../images/'.$imgname.' --'.$flag.' 2>&1';
		$output = shell_exec($command);
		echo json_encode($output);

	}
	else {
		echo json_encode("File already exists");
	}
}
function getAllImages() {
	$directory = '../images/';
	$files = glob($directory."*.png");
	echo '{"filename": ' . json_encode($files) .'}';
}

function deleteUsr(Request $request, Response $response, $args) { //not in js
	$name = $args['usrname'];
	$sql = "DELETE FROM users WHERE name=:name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("name", $name);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function deleteImg(Request $request, Response $response, $args) { //not in js
	$name = $args['imgname'];
	$sql = "DELETE FROM imgdata WHERE name=:name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("name", $name);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getData(Request $request, Response $response, $args){
	$imgname = $args['imgname'];
  $sql = "SELECT * FROM imgdata WHERE imgname=:imgname";
  try{
    $db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("imgname",$imgname);
    $stmt->execute();
		$imgdata = $stmt->fetchObject();
    $db = null;

    echo '{"imgdata": ' . json_encode($imgdata) . '}';

  } catch(PDOException $e){
    echo '{"error":{"text":'. json_encode($e->getMessage()) .'}}';
  }
}

function addData(String $value) {
	//echo $request->getParam('name');
	parse_str($value);

	$sql = "INSERT INTO imgdata (imgname, mean, median, rmean, gmean, bmean, rmode, gmode, bmode) VALUES (:imgname, :mean, :median, :rmean, :gmean, :bmean, :rmode, :gmode, :bmode)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("imgname", $imgname);
		$stmt->bindParam("mean", $mean);
		$stmt->bindParam("median", $median);
		$stmt->bindParam("rmean", $rmean);
		$stmt->bindParam("gmean", $gmean);
		$stmt->bindParam("bmean", $bmean);
		$stmt->bindParam("rmode", $rmode);
		$stmt->bindParam("gmode", $gmode);
		$stmt->bindParam("bmode", $bmode);
		$stmt->execute();
		$db = null;
		//echo json_encode($newuser);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function upload(Request $request, Response $response) {
	$imgpath = '../images/'.time();
	move_uploaded_file($_FILES['image']['tmp_name'],$imgpath); //move(temp_name_in_system, to: directory/
	$command = '//anaconda/bin/python ../py/analyze.py '.$imgpath.' --masterdata 2>&1';
	//$command = 'python ../py/analyze.py '.$imgpath.' --masterdata 2>&1';
	$output = shell_exec($command);
	addData($output);
	echo $output;
}

function addNewUser(Request $request, Response $response) {
	//echo $request->getParam('name');
	$name = $request->getParam('name');
	$pass = $request->getParam('pass');
	$sql = "INSERT INTO users (name, pass) VALUES (:name, :pass)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("name", $name);
		$stmt->bindParam("pass", $pass);
		$stmt->execute();
		$db = null;
		//echo json_encode($newuser);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getUser(){
  $sql = "SELECT * FROM users";
  try{
    $db = getConnection();
    $stmt = $db->query($sql);
    $users = $stmt->fetchAll(PDO::FETCH_OBJ);
    $db = null;

    echo '{"users": ' . json_encode($users) . '}';

  } catch(PDOException $e){
    echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}






?>
