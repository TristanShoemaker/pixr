<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Http\UploadedFile;
require '../vendor/autoload.php';
ob_end_clean();
$app = new \Slim\App;
$app->post('/upload', 'upload');
$app->get('/display', 'display');
$app->get('/imgdata/{imgname}', 'getData');
$app->get('/deleteimg/{imgname}','deleteImg');
$app->get('/getAll', 'getAllImages');
$app->get('/analyze/{flag}', 'analyze');
$app->run();

//connect database
function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbname="pixr";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

//use python to analyze the image
function analyze(Request $request, Response $response, $args) {
	parse_str($args['flag']);
	if(! file_exists('../images/'.$imgname.'analysis/'.$imgname.''.$flag.'.png')) {
		//$command = '//anaconda/bin/python ../py/analyze.py ../images/'.$imgname.' --'.$flag.' 2>&1'; //if conda installation of python
		$command = 'python ../py/analyze.py ../images/'.$imgname.' --'.$flag.' 2>&1';
		$output = shell_exec($command);
		echo json_encode($output);
	}
	else {
		echo json_encode("File already exists");
	}
}

//get image filenames in order to display them all together
function getAllImages() {
	$directory = '../images/';
	$files = glob($directory."*_thumb.png");
	echo '{"filename": ' . json_encode($files) .'}';
}


//delete an image (from database and server)
function deleteImg(Request $request, Response $response, $args) { 
	$name = $args['imgname'];
	$sql = "DELETE FROM imgdata WHERE imgname=:imgname";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("imgname", $name);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	shell_exec('rm -R ../images/'.$name.'*');
}

//retrieve image data from database
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

//add image data to database
function addData(String $value) {
	parse_str($value);
	$sql = "INSERT INTO imgdata (imgname, mean, median, mode, rmean, gmean, bmean, rmode, gmode, bmode, rmedian, gmedian, bmedian) VALUES (:imgname, :mean, :median, :mode, :rmean, :gmean, :bmean, :rmode, :gmode, :bmode, :rmedian, :gmedian, :bmedian)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("imgname", $imgname);
		$stmt->bindParam("mean", $mean);
		$stmt->bindParam("mode", $mode);
		$stmt->bindParam("median", $median);
		$stmt->bindParam("rmean", $rmean);
		$stmt->bindParam("gmean", $gmean);
		$stmt->bindParam("bmean", $bmean);
		$stmt->bindParam("rmode", $rmode);
		$stmt->bindParam("gmode", $gmode);
		$stmt->bindParam("bmode", $bmode);
		$stmt->bindParam("rmedian", $rmedian);
		$stmt->bindParam("gmedian", $gmedian);
		$stmt->bindParam("bmedian", $bmedian);
		$stmt->execute();
		$db = null;
		//echo json_encode($newuser);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
//upload image file:
function upload(Request $request, Response $response) { 
	foreach ($_FILES['image']['tmp_name'] as $uploadedfile) {
		$imgpath = '../images/'.time().substr(microtime(true),-4);
		if(move_uploaded_file($uploadedfile,$imgpath)) { //move(temp_name_in_system, to: directory/
		//$command = '//anaconda/bin/python ../py/analyze.py '.$imgpath.' --masterdata 2>&1'; //if conda installation of python
			$command = 'python ../py/analyze.py '.$imgpath.' --masterdata 2>&1';
			$output = shell_exec($command);
			//echo 'path: '.$imgpath.'output: '.$output;
			shell_exec('python ../py/analyze.py '.$imgpath.'.png --thumb');
			addData($output);
		}
	}
	echo $output;
}

?>