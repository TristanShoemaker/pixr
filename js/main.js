var rootURL = "http://pixr.local/api";




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
	document.getElementById('analArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('conArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:block");

	return false;

})

$('#btnAnal').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('analArea').setAttribute("style", "display:block");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:none");

	return false;
})

$('#btnData').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:block");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('analArea').setAttribute("style", "display:none");
	document.getElementById('conArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:none");

	var data = getData('3');

	
});

$('#btnPixr').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:block");
	document.getElementById('analArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('conArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:none");
	
	return false;
})

$('#btnTran').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('analArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:block");
	document.getElementById('conArea').setAttribute("style", "display:none");
	document.getElementById('newArea').setAttribute("style", "display:none");
	
	return false;

})

$('#btnCont').click(function() {
	document.getElementById('dataArea').setAttribute("style", "display:none");
	document.getElementById('mainArea').setAttribute("style", "display:none");
	document.getElementById('analArea').setAttribute("style", "display:none");
	document.getElementById('tranArea').setAttribute("style", "display:none");
	document.getElementById('conArea').setAttribute("style", "display:block");
	document.getElementById('newArea').setAttribute("style", "display:none");

	return false;

})

function getData(imgname) {
  console.log('getDBInfo');

  $.ajax({
      type: 'GET',
      url: rootURL + '/imgdata/' + imgname,
      dataType: "json",
      success: function(data){
				var imgdata = data.imgdata;
				console.log(data.imgdata);
				makePretty(imgdata);
				
      },
			error: function(data) {
				alert("error: " + data);
			}
  });
	
}

function makePretty(data) {
	document.getElementById('field2').setAttribute("style", "background-color: " + data.rval);
	document.getElementById('field3').setAttribute("style", "background-color: " + data.gval);
	document.getElementById('field4').setAttribute("style", "background-color: " + data.bval);

}

function addData() { //not in use?
	//console.log('addNewUser');
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

function addUser() {
	//console.log('addNewUser');
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL + '/users',
		dataType: "text",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR) {
			alert(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('addUser error: ' + textStatus);
		}
	});
}

function formToJSON() {
	return JSON.stringify({
		"name": $('#newUserName').val(),
		"pass": $('#newUserPass').val()
	});
}

function getUser() {
  console.log('getUser');
  $.ajax({
      type: 'GET',
      url: rootURL + '/users',
      dataType: "json",
      success: function(data){
        //var list = data == null ? [] : (data.users instanceof Array ? data.users : [data.users]);

        $('#textArea').text(data.users[1].name);
      }
  });
}

function upload() {
	var file = document.getElementById('image').files[0];
	var formData = new FormData($('#upload')[0]);
	//formData.append('file', file);

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
