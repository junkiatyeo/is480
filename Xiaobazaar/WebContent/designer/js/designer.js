/*
 * function AllTables()
 * Loading jQuery DataTables.
 */
function AllTables() {
	TestTable1();
}

function saveTheme(id) {

}

/*
 * function loadThemeList()
 * Load response data from servlet and print the output in HTML format.
 */

function loadThemeList() {
	$(document)
			.ready(
					function() {
						var username = localStorage.getItem("DESIGNER");
						$
								.ajax({
									url : '/Xiaobazaar/getThemesForDesigner?designer='
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
											var category = tempData.Category;
											var price = "S$" +parseFloat(Math.round(tempData.Price*100)/100).toFixed(2);
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
													+ price
													+'</td>\
					<td><a id="designerTheme-'
													+ themeID
													
													+ '-" href="'
													+ "http://ami.responsiveonly.com/?site="
													+ "http://www.justkeepgo.in:8080/Xiaobazaar/store/samplepage.html?name="
													+ url
													+ '" target="_blank">Preview</a>'
													+ '</td>\
					<td>'
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
 * function isLogin()
 * It is a protector of designer portal. 
 * If the user has not been logged in as designer, he/she will be redirected to login page.
*/

function isLogin() {
	var designer = localStorage.getItem("DESIGNER");
	if (designer == undefined || designer == 'undefined') {
		location.href = "/Xiaobazaar/designer-login.html";
		return false;
	} else {
		$("#userName").html(designer); // get designer's name from local storage
		return true;
	}
}

// logout
function designerLogout() {
	localStorage.clear();
	window.location.href = "/Xiaobazaar/designer-login.html";
}

/*
 * function designerLogout()
 * Logout designer and clean localStorage.
 */

function designerLogin() {
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
			url : '/Xiaobazaar/designer/designerLogin?json=' + inputJson,
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
					location.href = "/Xiaobazaar/designer/";
				}
			}
		});
	}
}

/*
 * function saveTheme(number)
 * Save modified information into database and get the response.
 */

function saveTheme(number) {

	var newThemeName = $("#name-" + number).val();
	if (newThemeName.length == 0) {
		alert("Theme name must not be empty.");
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
			url : '/Xiaobazaar/saveTheme?json=' + inputJson,
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

/*
 * function uploadCSS(id)
 * Upload selected CSS file to server.
 */

function uploadCSS(id) {
	var fd = new FormData(document.getElementById(id + "Form"));
	$
			.ajax({
				url : '/Xiaobazaar/FileUploadServlet?json={"fileType":"css","uploadDirectory":"designer","folderName":"theme"}',
				type : "POST",
				data : fd,
				dataType : 'json',
				processData : false,
				contentType : false,
				error : function(err) {
					console.log(err);
					alert("uploadImage: check ajax!");
				},
				success : function(jsObject) {
					console.log(jsObject);
					var jsonData= JSON.stringify(jsObject);
					console.log(jsonData);
					var data= jQuery.parseJSON(jsonData);
					console.log(data);
					var status = data["status"];
					var message = data["message"];
					if (status == 0) {
						alert(message);
					} else {
						var fileUrl = data["fileUrl"];
						$("#" + id).val(fileUrl);
						$("#" + id).attr("href", fileUrl);
						
						var message = "Your theme has been added sucessfully";
						alert(message);
					}
				}
			});
}

/*
 * function createTheme()
 * Submit createTheme form to "createTheme" servlet and get the response.
 */

function createTheme() {
	var newThemeName = $("#newThemeName").val();
	var newThemeCategory = $("#newThemeCategory option:selected").val();
	var newThemePrice = parseFloat($("#newThemePrice").val()).toFixed(2);

	if (newThemeName.length == 0) {
		$("#message").html("Please enter a theme name!");
	} else {
		var designerName = localStorage.getItem("DESIGNER");
		var themeURL = $("#designerTheme").val();

		var input = {};
		input.themeURL = themeURL
		input.designerName = designerName;
		input.newThemeName = newThemeName;
		input.newThemeCategory = newThemeCategory;
		input.newThemePrice = newThemePrice;
		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);

		$.ajax({
			url : '/Xiaobazaar/createTheme?json=' + inputJson,
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
					$("#message").html(message);
				} else {
					//$("#message").html(message);("Congratulations! The theme is created!");
					location.reload();
					// var fileUrl = data["fileUrl"];
					// $("#" + id).val(fileUrl);
					// $("#" + id + "Img").attr("src", fileUrl);
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
			url : '/Xiaobazaar/designer/changeDesignerPassword?json=' + inputJson,
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

/*
 * loadProfile()
 * Load designer's profile information.
 */

function loadProfile() {
	
	var input = {};
	input.username=localStorage.getItem("DESIGNER");
	
	var inputJson = JSON.stringify(input);
	inputJson = encodeURI(inputJson);
	
	$.ajax({
		url : '/Xiaobazaar/designer/loadDesignerProfile?json=' + inputJson,
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

/*
 * function designerRegister()
 * Submit registration form to "DesignerRegisterServlet" and get the response.
 */

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
			url : '/Xiaobazaar/designer/DesignerRegisterServlet?json='+inputJson,
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
					location.href = "/Xiaobazaar/designer/";
				}
			}
		});
	}
}

function loadTransactions() {
	var username = localStorage.getItem("DESIGNER");
	var input = {};
	input.fromdesigner = "true";
	input.name = username;
	var inputJson = JSON.stringify(input);
	inputJson = encodeURI(inputJson);
	$
	.ajax({
		url : '/Xiaobazaar/GetTransactionsServlet?json='
				+ inputJson,
		type : "POST",
		dataType : 'json',
		error : function(err) {
			console.log(err);
			alert("loadTransactions: check ajax!");
		},
		success : function(data) {
			console.log(data);
			var status = data["status"];
			if (status == 0) {
			} else {
				var html = '';
				var transations = data["transactions"];				
				for ( var i in transations) {
					var t = transations[i];
					html += '<tr><td>' + t.TransactionID + '</td><td>'
					+ t.TransactionTime.substring(0, t.TransactionTime.length - 2) + '</td><td>' + t.Name
					+ '</td><td>' + t.Category + '</td><td>'
					+ "S$"+ parseFloat(Math.round(t.Cost*100)/100).toFixed(2) + '</td></tr>'; 
				}				
				$("#transactionList").html(html);
				LoadDataTablesScripts(AllTables);
			}
		}
	});
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