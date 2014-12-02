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
		$("#message").html('Password should not be less than 6 digits!');
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
											var category = tempData.Category;
											var price = "S$"+tempData.Price;
											var designer = tempData.Designer;
											var url = tempData.URL;
											var status = tempData.Status;
											var status = tempData.Status;
											switch (status) {
											case "0":
												var statusString = '<button onclick="changeStatus('
														+ themeID
														+ ',1)" type="button" class="btn btn-success">Approve</button>  <button onclick="changeStatus('
														+ themeID
														+ ',2)" type="button" class="btn btn-danger">Reject</button>'
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
													+ category
													+ '</td>\
					<td>'
													+ "S$" + parseFloat(Math.round(price.substring(2,price.length)*100)/100).toFixed(2)
													+ '</td>\
					<td>'
													+ designer
													+ '</td>\
					<td><a id="designerTheme-'
													+ themeID
													
													+ '-" href="'
													+ "http://ami.responsiveonly.com/?site="
													+"http://www.justkeepgo.in:8080/Xiaobazaar/store/samplepage.html?name="
													+ url
													+ '" target="_blank">Preview</a>'
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

	
	var url = "";
	if(status == 1){
		url = prompt("Please enter url for theme thumbnail", "http://");
	}
	
	while (url == "http://"){
		url = prompt("Please re-enter url for theme thumbnail", "http://");
	}
	
	if (url.length > 0){
		input.url = url;
		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);
		$.ajax({
			url : '/Xiaobazaar/admin/changeThemeStatus?url=' + url + '&json=' + inputJson,
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

function pagingApprovedTheme() {
	displayApprovedTheme(1);
}

function getApprovedThemes2() {
	
	var input = {};
	
	var inputJson = JSON.stringify(input);
	inputJson = encodeURI(inputJson);
	$.ajax({
		/*
		 * url : '/Xiaobazaar/GetApprovedThemesServlet?hide=' +
		 * $("#hide-my-theme").prop("checked") + "&json=" + inputJson,
		 */url : '/Xiaobazaar/GetApprovedThemesServlet?category='
				+ $("#category").val() + '&json=' + inputJson,
		type : "POST",
		dataType : 'json',
		error : function(err) {
			console.log(err);
			alert("getApprovedThemes2: check ajax!");
		},
		success : function(data) {
			console.log(data);
			var status = data["status"];
			if (status == 0) {
			} else {
				$("#data-storage").text(JSON.stringify(data["themes"]));
				displayApprovedTheme(1);
			}
		}
	});
}

function displayApprovedTheme(pageIndex) {
	var transations = JSON.parse($("#data-storage").text());
	if (transations == null || transations.length == 0) {
		$("#approved-theme-list").html(
				"<tr><td colspan='3'>No data available</td></tr>");
		$(".pagination-info").text("Showing 0 to 0 of 0 entries");
		$('#approved-theme-pagination')
				.html(
						'<li class="prev disabled"><a href="#">← Previous</a></li><li class="next disabled"><a href="#">Next → </a></li>');
		return;
	}
	var pageSize = $("#page-size-select").val();
	var fromIndex = pageSize * (pageIndex - 1);
	var toIndex = fromIndex + pageSize;
	var html = '';
	var count = 0;
	for ( var i in transations) {
		if (parseInt(i) < fromIndex)
			continue;
		if (parseInt(i) >= toIndex)
			break;
		var t = transations[i];
		if (count % 3 == 0) {
			html += '<tr>';
		}

		html += '<td><img class="them-preview" alt="No Preview" src="'
				+ t.imgURL
				+ '"></img>'
				+ '<a class="preview-link" id="designerTheme-'
				+ t.ThemeID

				+ '-" href="'
				+ "http://ami.responsiveonly.com/?site="
				+ "http://www.justkeepgo.in:8080/Xiaobazaar/store/samplepage.html?name="
				+ t.themeURL
				+ '" target="_blank">Preview</a><div class="theme-content"> <B>'
				+ t.Name + '</B><BR/><span class="theme-detail">By '
				+ t.Designer + '<BR/>Category:  ' + t.Category
				+ '</span>'
				+ '<BR/><span class="theme-detail">Price: S$' + parseFloat(Math.round(t.Price.substring(1,t.Price.length)*100)/100).toFixed(2);
				+ '</span></div>'
		if (count % 3 == 2) {
			html += '</tr>';
		}
		count++;
	}
	if (count % 3 == 1) {
		html += '<td></td><td></td></tr>';
	}
	if (count % 3 == 2) {
		html += '<td></td></tr>';
	}
	$("#approved-theme-list").html(html);

	$(".pagination-info").text(
			"Showing " + (fromIndex + 1) + " to " + (fromIndex + count)
					+ " of " + transations.length + " entries");

	$(".pagination-info").text(
			"Showing " + (fromIndex + 1) + " to " + (fromIndex + count)
					+ " of " + transations.length + " entries");

	html = '<li class="prev disabled"><a href="#">← Previous</a></li>';
	var totalPage = Math.ceil(transations.length / pageSize);
	for (var i = 0; i < totalPage; i++) {
		html += '<li id="page' + (i + 1)
				+ '" class="item" onclick="displayApprovedTheme(' + (i + 1)
				+ ')"><a href="#">' + (i + 1) + '</a></li>';
	}
	html += '<li class="next"><a href="#">Next → </a></li>';
	$('#approved-theme-pagination').html(html);
	$('#approved-theme-pagination .item').removeClass("active");
	$("#page" + (pageIndex)).addClass("active");
	if (pageIndex == 1 || pageSize == 0) {
		$('#approved-theme-pagination .prev').addClass("disabled");
	} else {
		$('#approved-theme-pagination .prev').removeClass("disabled");
		$('#approved-theme-pagination .prev').click(function() {
			displayApprovedTheme(pageIndex - 1);
		});
	}
	if (pageIndex == totalPage || pageSize == 0) {
		$('#approved-theme-pagination .next').addClass("disabled");
	} else {
		$('#approved-theme-pagination .next').removeClass("disabled");
		$('#approved-theme-pagination .next').click(function() {
			displayApprovedTheme(pageIndex + 1);
		});
	}
}

function getAllCategories() {
	$.ajax({
		url : '/Xiaobazaar/GetCategoriesServlet',
		type : "POST",
		dataType : 'json',
		error : function(err) {
			console.log(err);
			alert("getAllCategories: check ajax!");
		},
		success : function(data) {
			console.log(data);
			var status = data["status"];
			if (status == 0) {
			} else {
				var themesHtml = '<option value="All" checked>All</option>';

				var themes = data["categories"];
				for ( var i in themes) {
					var t = themes[i];

					themesHtml += '<option value = "' + t + '">' + t
							+ '</option>';

				}

				$("#category").html(themesHtml);
				$("#category").change(function() {
					// $('#datatable-1').dataTable().fnDestroy();
					getApprovedThemes2();
				});
			}
		}
	});
}