var rootURL = "http://pixr.local/api";
var IMGNAME = "";

document.onload = fetchAllImages();

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
/*
$('#btnDisplayImage').click(function() {
	display();
	return false;
});
*/

$('#btnNew').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('uplArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('conArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:block");
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

$('#btnData').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:block");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('uplArea').setAttribute("style", "display:none");
	document.getElementById('conArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:none");
	document.getElementById('singleImageDataArea').setAttribute("style", "display: none");

	var data = getData('15117244173');
});

$('#btnPixr').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('uplArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('conArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:block");
	document.getElementById('singleImageDataArea').setAttribute("style", "display: none");

	fetchAllImages();
	return false;
})

$('#btnTran').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('uplArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:block");
	document.getElementById('conArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:none");
	document.getElementById('singleImageDataArea').setAttribute("style", "display: none");

	return false;
})

$('#btnCont').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('uplArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('conArea').setAttribute("style", "display:block");
	document.getElementById('newArea').setAttribute("style", "display:none");
	document.getElementById('singleImageDataArea').setAttribute("style", "display: none");

	return false;
})

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
				//currentImg = data.imgdata;

      },
			error: function(data) {
				alert("error: " + data);
			}
  });

}
/*
function getDataOld(imgname) {
  console.log('Get data for image: ' + imgname);

  $.ajax({
      type: 'GET',
      url: rootURL + '/imgdata/' + imgname,
      dataType: "json",
      asynch: false,
      success: function(data){
				var imgdata = data.imgdata;
				console.log(data.imgdata);
				currentImg = data.imgdata;
				//makePretty(imgdata);

      },
			error: function(data) {
				alert("error: " + data);
			}
  });

}
*/
/* //not in use currently
function addData() {
	console.log('addNewUser');
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL + '/imgdata',
		dataType: "text",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR) {
			alert('success: '+ data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('addUser error: ' + textStatus);
		}
	});
}
*/

function fetchAllImages() {
	$.ajax({
		type: 'GET',
		url: rootURL + '/getAll',
		dataType: "json",
		success: function(data) {
			console.log(data.filename.length);
			var newImages = "";
			$('#newAreaforImages').empty();
			var rowLength = 5;
			for (i=0; i<data.filename.length; i++) {
				newImages += '<img class="grow gridimage" src="' +data.filename[i]+ '" onclick="inspectImage(\'' + data.filename[i] + '\')"/>';
				//console.log(newImages);
			}
			$('#newAreaforImages').append(newImages);
		},
		error: function(data) {
			console.log("error: " + data.filename);
		}
	});
}

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
				document.getElementById('show1').setAttribute("style", "background-color: " + imgdata.rmode);
				document.getElementById('show2').setAttribute("style", "background-color: " + imgdata.gmode);
				document.getElementById('show3').setAttribute("style", "background-color: " + imgdata.bmode);
				document.getElementById('show4').setAttribute("style", "background-color: " + imgdata.rmean);
				document.getElementById('show5').setAttribute("style", "background-color: " + imgdata.gmean);
				document.getElementById('show6').setAttribute("style", "background-color: " + imgdata.bmean);
		  },
			error: function(data) {
				alert("error: " + data);
			}
  });
	IMGNAME = imgname;
	return;
}



	$('#lummap').click(function() {

		makeEffect(IMGNAME, "lummap")
		//imgname = "";
		return false;
	});

	$('#contour').click(function() {
		makeEffect(IMGNAME, "contour")
		//imgname = "";
		return false;
	});

	$('#freq').click(function() {
		makeEffect(IMGNAME, "freq")
		console.log(IMGNAME);
		return false;

	});




function makeEffect(imgname, flag) {
	$('#effectDisplayArea').empty();

	var command_str = 'imgname=' + imgname + '.png&flag=' + flag;
	console.log("command_str is: " + command_str);
	$.ajax({
		type: 'GET',
		url: rootURL + '/analyze/' + command_str,
		dataType: "json",
		success: function(data) {
			console.log("success:" + data);
			//$('#effectDisplayArea').empty();
			var effectImgs = "";
			var directory = '../images/' + imgname + '_analysis/' + imgname+ '_' + flag;
			console.log(directory);
			if(flag == "lummap") {
				for (i=0; i<3; i++) {
					effectImgs += '<img class="imgEffectMult" src="' +directory + '_' + i + '.png" />';
				}
			}
			else {
				effectImgs += '<img class="imgEffect" src="' +directory + '.png" style="width: 400px:"/>';
			}
			console.log(effectImgs);

			$('#effectDisplayArea').append(effectImgs);
		},
		error: function(data) {
			console.log('error: ' + data);
		}
	});


}

function addUser() {
	console.log('adding new user form:' + userFormToJson());
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL + '/users',
		dataType: "text",
		data: userFormToJSON(),
		success: function(data, textStatus, jqXHR) {
			//alert(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('addUser error: ' + textStatus);
		}
	});
}

function userFormToJSON() {
	return JSON.stringify({
		"name": $('#newUserName').val(),
		"pass": $('#newUserPass').val()
	});
}

function getUser() {
  console.log('get User');
  $.ajax({
      type: 'GET',
      url: rootURL + '/users',
      dataType: "json",
      success: function(data){
        $('#textArea').text(data.users[1].name);
      }
  });
}

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
			var parser = data.split("=");
			var parser2 = parser[1].split("&");
			var file_str = '../images/' + parser2[0] +'.png';
			//alert(file_str);

			inspectImage(file_str);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('upload error: ' + textStatus + '\nerror: ' + errorThrown);
		}
	});
}
/*
function display() {
	$('#pic').attr('src', '../images/1.jpg').toggle();
}
*/
