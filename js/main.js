var rootURL = "http://pixr.local/api";
var IMGNAME = "";

document.onload = fetchAllImages();

$.ajaxSetup({
    beforeSend:function(){
        // show gif here, eg:
        $("#loading").show();
    },
    complete:function(){
        // hide gif here, eg:
        $("#loading").hide();
    }
});


//button functionalities:
$('#btnSave').click(function() {
	addUser();
	return false;
});

$('#btnGetUsers').click(function() {
  getUser();
  return false;
});

$('#upBtn').click(function() {
	upload();
	return false;
});

$('#btnNew').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('uplArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('conArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:flex");
	document.getElementById('singleImageDataArea').setAttribute("style", "display: none");

	fetchAllImages();
	return false;

})

$('#btnUpl').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('uplArea').setAttribute("style", "display:block");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:none");
	document.getElementById('singleImageDataArea').setAttribute("style", "display: none");

	return false;
})


$('#btnPixr').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('uplArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('conArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:flex");
	document.getElementById('singleImageDataArea').setAttribute("style", "display: none");

	fetchAllImages();
	return false;
})


//get the image data from the database
function getData(imgname) {
  console.log('Get data for image: ' + imgname);

  $.ajax({
      type: 'GET',
      url: rootURL + '/imgdata/' + imgname,
      dataType: "json",
      asynch: false,
      success: function(data){
				var imgdata = data.imgdata;
				console.log(data.imgdata);
      },
			error: function(data) {
				alert("error: " + data);
			}
  });

}

//get the filenames of all the images stored on server and display them
function fetchAllImages() {
	$.ajax({
		type: 'GET',
		url: rootURL + '/getAll',
		dataType: "json",
		success: function(data) {
			//console.log(data.filename.length);
			var newImages = "";
			$('#newAreaforImages').empty();
			var rowLength = 5;
			for (i=0; i<data.filename.length; i++) {
				newImages += '<img class="grow gridimage" src="' + data.filename[i] + '" onclick="inspectImage(\'' + data.filename[i].slice(0,-10) + '.png\')"/>';
				console.log(data.filename[i]);
			}
			$('#newAreaforImages').append(newImages);
		},
		error: function(data) {
			console.log("error: " + data.filename);
		}
	});
}

//open one image for viewing; show colour analysis stuff like mode colour etc
function inspectImage(image) {
	$('#effectDisplayArea').empty();

	document.getElementById('newArea').setAttribute("style", "display:none");
	document.getElementById('singleImageDataArea').setAttribute("style", "display: block");
	document.getElementById('mainArea').setAttribute("style", "display: none");
	document.getElementById('uplArea').setAttribute("style", "display: none");
	$('#singleImage').attr('src', image);
	var split_image = image.split("/");
	console.log(split_image);
	var split_dot = split_image[split_image.length - 1].split(".");
	var imgname = split_dot[0];
	console.log(imgname);
	console.log("attempting to get data");
	$.ajax({
      type: 'GET',
      url: rootURL + '/imgdata/' + imgname,
      dataType: "json",
      success: function(data){
				var imgdata = data.imgdata;
				console.log(data.imgdata);
				document.getElementById('rmode').getContext('2d').fillStyle = imgdata.rmode;
				document.getElementById('rmode').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('gmode').getContext('2d').fillStyle = imgdata.gmode;
				document.getElementById('gmode').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('bmode').getContext('2d').fillStyle = imgdata.bmode;
				document.getElementById('bmode').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('rmean').getContext('2d').fillStyle = imgdata.rmean;
				document.getElementById('rmean').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('gmean').getContext('2d').fillStyle = imgdata.gmean;
				document.getElementById('gmean').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('bmean').getContext('2d').fillStyle = imgdata.bmean;
				document.getElementById('bmean').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('rmedian').getContext('2d').fillStyle = imgdata.rmedian;
				document.getElementById('rmedian').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('gmedian').getContext('2d').fillStyle = imgdata.gmedian;
				document.getElementById('gmedian').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('bmedian').getContext('2d').fillStyle = imgdata.bmedian;
				document.getElementById('bmedian').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('mode').getContext('2d').fillStyle = imgdata.mode;
				document.getElementById('mode').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('mean').getContext('2d').fillStyle = imgdata.mean;
				document.getElementById('mean').getContext('2d').fillRect(0,0,1000,1000);
				document.getElementById('median').getContext('2d').fillStyle = imgdata.median;
				document.getElementById('median').getContext('2d').fillRect(0,0,1000,1000);
		  },
			error: function(data) {
				alert("error: " + data);
			}
  });
	IMGNAME = imgname;
	return;
}
	//buttons to transmogrify the image:
	$('#lummap').click(function() {
		makeEffect(IMGNAME, "lummap")
		return false;
	});

	$('#contour').click(function() {
		makeEffect(IMGNAME, "contour")
		return false;
	});

	$('#freq').click(function() {
		makeEffect(IMGNAME, "freq")
		//console.log(IMGNAME);
		return false;
	});
	$('#histo').click(function() {
		makeEffect(IMGNAME, "histo")
		//console.log(IMGNAME);
		return false;
	});

//functions to transmogrify the image (filters, histograms etc)
function makeEffect(imgname, flag) {
	$('#effectDisplayArea').empty();

	var command_str = 'imgname=' + imgname + '.png&flag=' + flag;
	console.log("command_str is: " + command_str);
	$.ajax({
		type: 'GET',
		url: rootURL + '/analyze/' + command_str,
		dataType: "json",
		success: function(data) {
			console.log("success: " + data);
			var effectImgs = "";
			var directory = '../images/' + imgname + '_analysis/' + imgname+ '_' + flag;
			console.log('flag: ' + flag);
			if((flag == "lummap") || (flag == "histo")) {
				for (i=0; i<3; i++) {
					effectImgs += '<img class="imgEffect" src="' + directory + '_' + i + '.png" />';
				}
				console.log('flag: ' + flag);
			}
			else {
				effectImgs += '<img class="imgEffect" src="' + directory + '.png" style="width: 400px:"/>';
			}
			console.log(flag + ': ' + data);

			$('#effectDisplayArea').append(effectImgs);
		},
		error: function(data) {
			console.log('error: ' + data);
		}
	});
}

//upload an image
function upload() {
	var file = document.getElementById('image').files[0];
	var formData = new FormData($('#upload')[0]);

	$.ajax({
		url: rootURL + '/upload',
		type: 'POST',
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
		success: function(data, textStatus, jqXHR) {
			console.log(data);
			var parser = data.split("=");
			var parser2 = parser[1].split("&");
			var file_str = '../images/' + parser2[0] +'.png';
			//alert(file_str);

			inspectImage(file_str);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('upload error: ' + data + '\nerror: ' + errorThrown);
		}
	});
}
