//$(document).ready(function() {
//	$('#themetable').DataTable({
//		"sAjaxSource" : '/Xiaobazaar/getThemes',
//		"sAjaxDataProp" : "aaData",
//	});
//});

/*
 * function isLogin()
 * It is a protector of admin portal. 
 * If the user has not been logged in as admin, he/she will be redirected to login page.
*/

function isLogin() {
	var admin = localStorage.getItem("ADMIN");
	if (admin == undefined || admin == 'undefined') {
		location.href = "/Xiaobazaar/admin-login.html";
		return false;
	} else {
		$("#userName").html(admin); // get designer's name from local
		return true;
	}
}

/*
 * function adminLogin()
 * Submit login form to "adminLogin" servlet to do verification.
*/


function adminLogin() {
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
			url : '/Xiaobazaar/admin/adminLogin?json=' + inputJson,
			type : "POST",
			dataType : 'json',
			error : function(err) {
				console.log(err);
				$(".my-loading").addClass('sr-only');
				alert("adminLogin: check ajax!");
			},
			success : function(data) {
				console.log(data);
				$(".my-loading").addClass('sr-only');
				var status = data["status"];
				var message = data["message"];
				if (status == 0) {
					$("#message").html(message);
				} else {
					var admin = message;
					localStorage.clear();
					localStorage.setItem("ADMIN", admin);
					location.href = "/Xiaobazaar/admin/";
				}
			}
		});
	}
}

/*
 * function adminLogout()
 * Logout admin and clean localStorage.
 */

function adminLogout() {
	localStorage.clear();
	window.location.href = "/Xiaobazaar/admin-login.html";
}

/*
 * function AllTables()
 * Loading jQuery DataTables.
 */
function AllTables() {
	TestTable1();
}

function loadThemeList() {
	$(document)
			.ready(
					function() {
						$
								.ajax({
									url : '/Xiaobazaar/getThemesForAdmin',
									type : "POST",
									dataType : 'json',
									error : function(err) {
										console.log(err);
										$(".my-loading").addClass('sr-only');
										alert("loadThemelist: check ajax!");
									},
									success : function(data) {
										var themes = data.aaData;

										var dataHtml = '';

										for ( var i in themes) {
											var tempData = themes[i];
											var themeID = tempData.ThemeID;
											var name = tempData.Name;
											var designer = tempData.Designer;
											var url = tempData.URL;
											var status = tempData.Status;
											var status = tempData.Status;
											switch (status) {
											case "0":
												var statusString = '<button onclick="changeStatus('
														+ themeID
														+ ',1)" type="button" class="btn btn-success">Accept</button>  <button onclick="changeStatus('
														+ themeID
														+ ',2)" type="button" class="btn btn-danger">Deny</button>'
														+ '<font color="red" id="message-"'+ themeID +'></font>';
												break;
											case "1":
												// Approved
												var statusString = "Approved";
												break;

											case "2":
												// Rejected
												var statusString = "Rejected";
												break;
											}
											dataHtml += '\
				<tr>\
					<td>'
													+ themeID
													+ '</td>\
					<td>'
													+ name
													+ '</td>\
					<td>'
													+ designer
													+ '</td>\
					<td><a id="designerTheme-'
													+ themeID
													+ '-" href="'
													+ url
													+ '" target="_blank">Download Source</a>'
													+ '</td>\
					<td>  '
													+ statusString

													+ '</td>\
				</tr>';
										}

										$("#themelist").html(dataHtml);

										LoadDataTablesScripts(AllTables);
									}
								});

					});

}

/*
 * function changeStatus(themeID, status)
 * Approve or Reject theme design (css file)
 */


function changeStatus(themeID, status) {
	var input = {};
	input.themeID = themeID;
	input.status = status;

	var inputJson = JSON.stringify(input);
	inputJson = encodeURI(inputJson);

	$.ajax({
		url : '/Xiaobazaar/admin/changeThemeStatus?json=' + inputJson,
		type : "POST",
		dataType : 'json',
		error : function(err) {
			console.log(err);
			$(".my-loading").addClass('sr-only');
			alert("changeStatus: check ajax!");
		},
		success : function(data) {
			console.log(data);
			$(".my-loading").addClass('sr-only');
			var status = data["status"];
			var message = data["message"];
			if (status == 0) {
				$("message-"+themeID).html("Change failed!");
			} else {
				location.reload();
			}
		}
	});
	

}

/*
 * changePassword()
 * Submit changePassword form to "changeAdminPassword" servlet and get the response.
 */

function changePassword() {

	var username = localStorage.getItem("ADMIN");
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
			url : '/Xiaobazaar/admin/changeAdminPassword?json=' + inputJson,
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
		$("#changePasswordMsg").html('Password should not less than 6 digits!');
	}
}

function loadProfile() {

	var input = {};
	input.username = localStorage.getItem("ADMIN");

	var inputJson = JSON.stringify(input);
	inputJson = encodeURI(inputJson);

	$.ajax({
		url : '/Xiaobazaar/admin/loadAdminProfile?json=' + inputJson,
		type : "POST",
		dataType : 'json',
		error : function(err) {
			console.log(err);
			$(".my-loading").addClass('sr-only');
			alert("loadAdminProfile: check ajax!");
		},
		success : function(data) {
			console.log(data);
			$(".my-loading").addClass('sr-only');
			var adminID = data["adminID"];
			var adminName = data["adminName"];

			$("#userID").val(adminID);
			$("#username").val(adminName);

		}
	});

}

/*
 * function adminRegister()
 * Submit registration form to "AdminRegisterServlet" and get the response.
 */

function adminRegister(){
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
			url : '/Xiaobazaar/admin/AdminRegisterServlet?json='+inputJson,
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
					var admin = message;
					localStorage.clear();
					localStorage.setItem("ADMIN", admin);
					location.href = "/Xiaobazaar/admin/";
				}
			}
		});
	}
}