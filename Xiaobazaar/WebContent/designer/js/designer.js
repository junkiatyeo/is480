function AllTables() {
	TestTable1();
}

function saveTheme(id) {

}

function loadThemeList() {
	$(document)
			.ready(
					function() {
						var username = localStorage.getItem("DESIGNER");
						$
								.ajax({
									url : '/Steamboat/getThemesForDesigner?designer='
											+ username,
									type : "POST",
									dataType : 'json',
									error : function(err) {
										console.log(err);
										$(".my-loading").addClass('sr-only');
										alert("ownerRegister: check ajax!");
									},
									success : function(data) {
										var themes = data.aaData;

										var dataHtml = '';

										for ( var i in themes) {
											var tempData = themes[i];
											var themeID = tempData.ThemeID;
											var name = tempData.Name;
											var url = tempData.URL;
											var status = tempData.Status;
											switch (status) {
											case "0":
												var statusString = "Pending";
												break;
											case "1":
												// Approve
												var statusString = "Approved";
												break;

											case "2":
												// Reject
												var statusString = "Rejected";
												break;
											}
											dataHtml += '\
				<tr>\
					<td id=id-'
													+ themeID
													+ '>'
													+ themeID
													+ '</td>\
					<td><input class="form-control input-sm" id="name-'
													+ themeID
													+ '" value="'
													+ name
													+ '"></td>\
					<td><a id="designerTheme-'
													+ themeID
													+ '-" href="'
													+ url
													+ '" target="_blank">Download Source</a>'
													+ '</td>\
					<td><label for="designerTheme-'
													+ themeID
													+ '-Upload" class="btn btn-primary">Re-upload</label><form enctype="multipart/form-data" method="post" name="designerTheme-'
													+ themeID
													+ '-Form" id="designerTheme-'
													+ themeID
													+ '-Form">\
													<input type="file" class="sr-only" name="file" id="designerTheme-'
													+ themeID
													+ '-Upload" onchange="uploadCSS(\'designerTheme-'
													+ themeID
													+ '-\')">\
													</form></td>\
													<td id="status-'+themeID+'">'
													+ statusString
													+ '</td>\
					<td>'
													+ '<button onclick="saveTheme('
													+ themeID
													+ ')" type="button" class="btn btn-warning btn-label-left"><span><i class="fa fa-save"></i></span>Save</button>'
													+ '<font color="red" id="message-'+themeID+'"></font></td>\
				</tr>';
										}

										$("#themelist").html(dataHtml);

										LoadDataTablesScripts(AllTables);
									}
								});

					});

}

function isLogin() {
	var designer = localStorage.getItem("DESIGNER");
	if (designer == undefined || designer == 'undefined') {
		location.href = "/Steamboat/designer-login.html";
		return false;
	} else {
		$("#userName").html(designer); // get designer's name from local
		// storege.
		return true;
	}
}

// logout
function designerLogout() {
	localStorage.clear();
	window.location.href = "/Steamboat/designer-login.html";
}

function designerLogin() {
	$("#message").html('');
	$(".my-loading").addClass('sr-only');
	var username = $("#username").val();
	var password = $("#password").val();

	if (username.length == 0 || password.length == 0) {
		$("#message").html('Do not leave blanks!');
	} else if (password.length < 6) {
		$("#message").html('Password should not less than 6 digits!');
	} else {
		$(".my-loading").removeClass('sr-only');

		var input = {};
		input.username = username;
		input.password = password;

		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);

		$.ajax({
			url : '/Steamboat/designer/designerLogin?json=' + inputJson,
			type : "POST",
			dataType : 'json',
			error : function(err) {
				console.log(err);
				$(".my-loading").addClass('sr-only');
				alert("designerLogin: check ajax!");
			},
			success : function(data) {
				console.log(data);
				$(".my-loading").addClass('sr-only');
				var status = data["status"];
				var message = data["message"];
				if (status == 0) {
					$("#message").html(message);
				} else {
					var designer = message;
					localStorage.clear();
					localStorage.setItem("DESIGNER", designer);
					location.href = "/Steamboat/designer/";
				}
			}
		});
	}
}

function saveTheme(number) {

	var newThemeName = $("#name-" + number).val();
	if (newThemeName.length == 0) {
		alert("Do not leave name blank!");
	    location.reload();
	} else {
		var newURL = $("#designerTheme-" + number + "-").attr("href");
		var themeID = number;
		var input = {};
		input.themeID = themeID;
		input.newThemeName = newThemeName;
		input.newURL = newURL;

		var inputJson = JSON.stringify(input);
		console.log(input);
		$.ajax({
			url : '/Steamboat/saveTheme?json=' + inputJson,
			type : "POST",
			dataType : 'json',
			error : function(err) {
				console.log(err);
				alert("saveTheme: check ajax!");
			},
			success : function(data) {
				console.log(data);
				var status = data["status"];
				var message = data["message"];
				var urlMod = data["urlMod"];
				$("#message-"+themeID).html(message);
				if(urlMod == 1 && status ==1) {
				$("#status-"+themeID).html("Pending");
				}
			}
		});
	    
	    //setTimeout(location.reload(), 3000);

	}
}

function uploadCSS(id) {
	var fd = new FormData(document.getElementById(id + "Form"));
	$
			.ajax({
				url : '/Steamboat/FileUploadServlet?json={"fileType":"css","uploadDirectory":"designer","folderName":"theme"}',
				type : "POST",
				data : fd,
				dataType : 'json',
				processData : false,
				contentType : false,
				error : function(err) {
					console.log(err);
					alert("uploadImage: check ajax!");
				},
				success : function(data) {
					console.log(data);
					var status = data["status"];
					var message = data["message"];
					if (status == 0) {
						alert(message);
					} else {
						var fileUrl = data["fileUrl"];
						$("#" + id).val(fileUrl);
						$("#" + id).attr("href", fileUrl);
					}
				}
			});
}

function createTheme() {
	var newThemeName = $("#newThemeName").val();

	if (newThemeName.length == 0) {
		alert("Please enter a theme name.");
	} else {
		var designerName = localStorage.getItem("DESIGNER");
		var themeURL = $("#designerTheme").val();

		var input = {};
		input.themeURL = themeURL
		input.designerName = designerName;
		input.newThemeName = newThemeName;

		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);

		$.ajax({
			url : '/Steamboat/createTheme?json=' + inputJson,
			type : "POST",
			dataType : 'json',
			processData : false,
			contentType : false,
			error : function(err) {
				console.log(err);
				alert("createTheme: check ajax!");
			},
			success : function(data) {
				console.log(data);
				var status = data["status"];
				var message = data["message"];
				if (status == 0) {
					alert(message);
				} else {
					alert("Congratulations! The theme is created!");
					location.reload();
					// var fileUrl = data["fileUrl"];
					// $("#" + id).val(fileUrl);
					// $("#" + id + "Img").attr("src", fileUrl);
				}
			}
		});
	}
}

function changePassword() {

	var username = localStorage.getItem("DESIGNER");
	var oldPassword = $("#oldPassword").val();
	var newPassword = $("#newPassword").val();
	var confirmPassword = $("#confirmPassword").val();
	if (newPassword.length >= 6) {

		var input = {};
		input.oldPassword = oldPassword;
		input.newPassword = newPassword;
		input.confirmPassword = confirmPassword;
		input.username = username;

		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);

		$.ajax({
			url : '/Steamboat/designer/changeDesignerPassword?json=' + inputJson,
			type : "POST",
			dataType : 'json',
			error : function(err) {
				console.log(err);
				$(".my-loading").addClass('sr-only');
				alert("changePassword: check ajax!");
			},
			success : function(data) {
				console.log(data);
				$(".my-loading").addClass('sr-only');
				var status = data["status"];
				var message = data["message"];

				$("#changePasswordMsg").html(message);
			}
		});
	} else {
		alert('Password should not less than 6 digits!');
	}
}

function loadProfile() {
	
	var input = {};
	input.username=localStorage.getItem("DESIGNER");
	
	var inputJson = JSON.stringify(input);
	inputJson = encodeURI(inputJson);
	
	$.ajax({
		url : '/Steamboat/designer/loadDesignerProfile?json=' + inputJson,
		type : "POST",
		dataType : 'json',
		error : function(err) {
			console.log(err);
			$(".my-loading").addClass('sr-only');
			alert("loadDesignerProfile: check ajax!");
		},
		success : function(data) {
			console.log(data);
			$(".my-loading").addClass('sr-only');
			var designerID = data["designerID"];
			var designerName = data["designerName"];

			$("#userID").val(designerID);
			$("#username").val(designerName);

		}
	});

}

function designerRegister(){
	$("#message").html('');
	$(".my-loading").addClass('sr-only');
	var username = $("#username").val();
	var password = $("#password").val();
	var password2 = $("#password2").val();
	
	if(username.length == 0 || password.length == 0 || password2.length == 0){
		$("#message").html('Do not leave blanks!');
	}else if(password.length < 6){
		$("#message").html('Password should not less than 6 digits!');
	}else if(password != password2){
		$("#message").html('Confirm your password again!');
	}else{
		$(".my-loading").removeClass('sr-only');
		
		var input = {};
		input.name = username;
		input.password = password;
		
		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);
		
		$.ajax({
			url : '/Steamboat/designer/DesignerRegisterServlet?json='+inputJson,
			type : "POST",
			dataType : 'json',
			error : function(err) {
				console.log(err);
				$(".my-loading").addClass('sr-only');
				alert("ownerRegister: check ajax!");
			},
			success : function(data) {
				console.log(data);
				$(".my-loading").addClass('sr-only');
				var status = data["status"];
				var message = data["message"];
				if (status == 0) {
					$("#message").html(message);
				} else {
					var designer = message;
					localStorage.clear();
					localStorage.setItem("DESIGNER", designer);
					location.href = "/Steamboat/designer/";
				}
			}
		});
	}
}