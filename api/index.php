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
$app->get('/imgdata/{imgname}', 'getData');
$app->delete('/delete/{}')
$app->run();

function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbname="pixr";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
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

	$sql = "INSERT INTO imgdata (imgname, mean, median, rval, gval, bval) VALUES (:imgname, :mean, :median, :rval, :gval, :bval)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("imgname", $imgname);
		$stmt->bindParam("mean", $mean);
		$stmt->bindParam("median", $median);
		$stmt->bindParam("rval", $rval);
		$stmt->bindParam("gval", $gval);
		$stmt->bindParam("bval", $bval);
		$stmt->execute();
		$db = null;
		//echo json_encode($newuser);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function upload(Request $request, Response $response) {
	$imgpath = '../images/'.time().$_FILES['image']['name'];
	move_uploaded_file($_FILES['image']['tmp_name'],$imgpath); //move(temp_name_in_system, to: directory/
	$command = 'python ../py/analyze.py '.$imgpath.' --masterdata 2>&1';
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
