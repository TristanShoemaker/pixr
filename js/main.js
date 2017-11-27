var rootURL = "http://pixr.local/api";
var currentImg = "";

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

$('#btnDisplayImage').click(function() {
	display();
	return false;
});

$('#btnSnek').click(function() {
	snek();
	return false;
});

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
/* //not in use currently
function snek() {
	$.ajax({
		type: 'GET',
		url: rootURL + '/python',
		dataType: "text",
		success: function(data) {
			alert('python success: '+ data);
		},
		error: function(data) {
			alert("error: " + data);
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
				//newImages += '<a href="api/inspectImage"> <img src="' +data.filename[i]+ '" style="width:150px;" /></a>';
				newImages += '<img src="' +data.filename[i]+ '" onclick="inspectImage(\'' + data.filename[i] + '\')"/>';

				console.log(newImages);
			}
			$('#newAreaforImages').append(newImages);
		},
		error: function(data) {
			console.log("error: " + data.filename);
		}
	});
}

function inspectImage(image) {
	document.getElementById('newArea').setAttribute("style", "display:none");
	document.getElementById('singleImageDataArea').setAttribute("style", "display: block");
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



      },
			error: function(data) {
				alert("error: " + data);
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
			alert(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('upload error: ' + textStatus + '\nerror: ' + errorThrown);
		}
	});
}

function display() {
	$('#pic').attr('src', '../images/1.jpg').toggle();
}
