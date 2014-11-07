/*
 * function injectTheme(url)
 * Switch theme function in preview page.
 */
function injectTheme(url){
	document.getElementById('viewIframe').contentWindow.updateTheme(url);
}

/*
 * function updateTheme()
 * Change theme for the store.
 */

function updateTheme(){
	var themeId = Number($("input:radio[name=theme]:checked").val());
	var owner = JSON.parse(localStorage.getItem("OWNER"));
	var store = owner.store;
	
	var input = {};
	input.themeId = themeId;
	input.storeId = store.storeId;
	
	var inputJson = JSON.stringify(input);
	inputJson = encodeURI(inputJson);
	
	$.ajax({
		url : '/Xiaobazaar/owner/ChangeThemeServlet?json='+inputJson,
		type : "POST",
		dataType : 'json',
		error : function(err) {
			console.log(err);
			alert("updateTheme: check ajax!");
		},
		success : function(data) {
			console.log(data);
			var status = data["status"];
			if (status == 0) {
			} else {
				owner.store = data["message"];
				localStorage.setItem("OWNER", JSON.stringify(owner));
			}
		}
	});
	
}

/*
 * function getApprovedThemes
 * Get all themes that are approved from servlet "GetApprovedThemesServlet"
 */

function getApprovedThemes(){
	$.ajax({
		url : '/Xiaobazaar/GetApprovedThemesServlet',
		type : "POST",
		dataType : 'json',
		error : function(err) {
			console.log(err);
			alert("getApprovedThemes: check ajax!");
		},
		success : function(data) {
			console.log(data);
			var status = data["status"];
			if (status == 0) {
			} else {
				var themesHtml = '';
				
				var themes = data["themes"];
				for(var i in themes){
					var t = themes[i];
					
					themesHtml += '\
						<div class="radio" onclick="injectTheme(\''+t.URL+'\')">\
							<label>\
								<input type="radio" name="theme" value="'+t.ThemeID+'"> '+t.Name+'\
								<i class="fa fa-circle-o small"></i>\
							</label>\
						</div>';
					
				}
				
				$("#themes").append(themesHtml);
				
				var owner = JSON.parse(localStorage.getItem("OWNER"));
				var store = owner.store;
				var themeId = store.themeId;
				
				$('input[name="theme"][value="' + themeId + '"]').prop('checked', true);
				
			}
		}
	});
}

/*
 * changePassword()
 * Submit changePassword form to "ChangePasswordServlet" servlet and get the response.
 */

function changePassword(){
	var owner = JSON.parse(localStorage.getItem("OWNER"));
	var ownerId = owner.ownerId;
	$("#message").html('');
	$(".my-loading").addClass('sr-only');
	var oldPassword = $("#oldPassword").val();
	var password = $("#newPassword").val();
	var password2 = $("#confirmPassword").val();
	
	$("#oldPasswordFG").removeClass('has-error');
	$("#newPasswordFG").removeClass('has-error');
	$("#confirmPasswordFG").removeClass('has-error');
	
	if(oldPassword.length < 6 || password.length < 6 || password2.length < 6){
		$("#message").html('Password should not less than 6 digits!');
		$("#oldPasswordFG").addClass('has-error');
		$("#newPasswordFG").addClass('has-error');
		$("#confirmPasswordFG").addClass('has-error');
	}else if(password != password2){
		$("#message").html('Confirm your password again!');
		$("#newPasswordFG").addClass('has-error');
		$("#confirmPasswordFG").addClass('has-error');
	}else{
		$(".my-loading").removeClass('sr-only');
		
		var input = {};
		input.ownerId = ownerId;
		input.oldPassword = oldPassword;
		input.newPassword = password;
		
		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);
		
		$.ajax({
			url : '/Xiaobazaar/owner/ChangePasswordServlet?json='+inputJson,
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
				if (status == 0) {
					$("#message").html(message);
				} else {
					var owner = message;
					localStorage.setItem("OWNER", JSON.stringify(owner));
					$("#oldPassword").val('');
					$("#newPassword").val('');
					$("#confirmPassword").val('');
				}
			}
		});
	}
}

/*
 * function fillOwnerInfo()
 * Load owner's profile information.
 */
function fillOwnerInfo(){
	var owner = JSON.parse(localStorage.getItem("OWNER"));
	var ownerId = owner.ownerId;
	var name = owner.name;
	
	$("#ownerId").val(ownerId);
	$("#ownerName").val(name);
}

/*
 * function deleteProduct(id)
 * Delete product
 */

function deleteProduct(id){
	var input = {};
	input.productId = Number(id);
	
	console.log(input);
	
	var inputJson = JSON.stringify(input);
	inputJson = encodeURI(inputJson);
	
	$.ajax({
		url : '/Xiaobazaar/owner/DeleteProductServlet?json='+inputJson,
		type : "POST",
		dataType : 'json',
		error : function(err) {
			console.log(err);
			alert("editProduct: check ajax!");
		},
		success : function(data) {
			console.log(data);
			var status = data["status"];
			if (status == 0) {
			} else {
				var owner = JSON.parse(localStorage.getItem("OWNER"));
				var products = owner.store.products;
				
				for(var i in products){
					var pro = products[i];
					
					if(pro.productId == id){
						owner.store.products.splice(i, 1);
						break;
					}	
				}
				
				localStorage.setItem("OWNER", JSON.stringify(owner));
				location.reload();
			}
		}
	});
}

/*
 * function editProduct(id)
 * Edit Product
 */

function editProduct(id){
	console.log(id);
	
	var name = $("#productName-"+id).val();
	var url = $("#productPhoto-"+id+"-").val();
	var price = $("#productPrice-"+id).val();
	var description = $("#description-"+id).val();
	
	$("#descriptionFG-"+id).removeClass('has-error');
	$("#productPriceFG-"+id).removeClass('has-error');
	$("#productNameFG-"+id).removeClass('has-error');
	
	var noError = true;
	
	if(name.length == 0){
		$("#productNameFG-"+id).addClass('has-error');
		noError = false;
	}
	
	if(price.length == 0){
		$("#productPriceFG-"+id).addClass('has-error');
		noError = false;
	}
	
	if(price < 0){
		$("#productPriceFG-"+id).addClass('has-error');
		noError = false;
	}
	
	if(description.length == 0){
		$("#descriptionFG-"+id).addClass('has-error');
		noError = false;
	}
	
	if(noError){
		var input = {};
		input.productId = Number(id);
		input.name = name;
		input.imgUrl = url;
		input.price = price;
		input.description = description;
		
		console.log(input);
		
		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);
		
		$.ajax({
			url : '/Xiaobazaar/owner/EditProductServlet?json='+inputJson,
			type : "POST",
			dataType : 'json',
			error : function(err) {
				console.log(err);
				alert("editProduct: check ajax!");
			},
			success : function(data) {
				console.log(data);
				var status = data["status"];
				var message = data["message"];
				if (status == 0) {
					$("#descriptionFG").addClass('has-error');
					$("#productPriceFG").addClass('has-error');
					$("#productNameFG").addClass('has-error');
				} else {
					var product = message;
					
					var owner = JSON.parse(localStorage.getItem("OWNER"));
					var products = owner.store.products;
					
					for(var i in products){
						var pro = products[i];
						
						if(pro.productId == id){
							owner.store.products[i] = product;
							break;
						}	
					}
					
					localStorage.setItem("OWNER", JSON.stringify(owner));
					location.reload();
				}
			}
		});
	}
}

/*
 * function displayProduct()
 * Show all products belongs to the owner.
 */

function displayProduct(){
	var owner = JSON.parse(localStorage.getItem("OWNER"));
	var store = owner.store;
	var products = store.products;
	
	var productsHtml = '';
	
	for(var i in products){
		var pro = products[i];
		
		var id = pro.productId;
		var name = pro.name;
		var url = pro.imgUrl;
		var price = pro.price;
		var description = pro.description;
		
		productsHtml += '\
			<div class="col-sm-2">\
				<label for="productPhoto-'+id+'-Upload" class="center-block">\
					<img id="productPhoto-'+id+'-Img" class="img-responsive my-image center-block" width="100%" alt="productPhoto" src="'+url+'">\
				</label>\
				<form enctype="multipart/form-data" method="post" name="productPhoto-'+id+'-Form" id="productPhoto-'+id+'-Form">\
					<input type="file" class="sr-only" name="file" id="productPhoto-'+id+'-Upload" onchange="uploadImage(\'productPhoto-'+id+'-\')">\
				</form>\
				<input type="text" id="productPhoto-'+id+'-" value="'+url+'" class="form-control sr-only">\
			</div>\
			<div class="col-sm-2">\
				<div class="row">\
					<div class="col-sm-12">\
						<div id="productNameFG-'+id+'" class="form-group">\
							<input type="text" class="form-control" id="productName-'+id+'" placeholder="New product name" value="'+name+'">\
						</div>\
					</div>\
				</div>\
				<div class="row">\
					<div class="col-sm-12">\
						<div id="productPriceFG-'+id+'" class="form-group">\
							<div class="input-group">\
								<span class="input-group-addon">$</span>\
								<input type="number" class="form-control" id="productPrice-'+id+'" placeholder="0.00" value="'+price+'">\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class="row">\
					<div class="col-sm-12">\
						<div id="descriptionFG-'+id+'" class="form-group">\
							<textarea class="form-control" id="description-'+id+'" placeholder="Description...">'+description+'</textarea>\
						</div>\
					</div>\
				</div>\
				<div class="row">\
					<div class="col-sm-12">\
						<button class="btn btn-sm btn-warning" onclick="editProduct('+id+')"><i class="fa fa-edit"></i> Edit</button>\
						<button class="btn btn-sm btn-danger" onclick="deleteProduct('+id+')"><i class="fa fa-trash-o"></i> Delete</button>\
					</div>\
				</div>\
			</div>';
	}
	
	$("#productsHolder").prepend(productsHtml);
}

/*
 * function createNewProduct()
 * Create new product.
 */

function createNewProduct(){
	var owner = JSON.parse(localStorage.getItem("OWNER"));
	var store = owner.store;
	
	var name = $("#productName").val();
	var url = $("#productPhoto").val();
	var price = $("#productPrice").val();
	var description = $("#description").val();
	
	$("#descriptionFG").removeClass('has-error');
	$("#productPriceFG").removeClass('has-error');
	$("#productNameFG").removeClass('has-error');
	
	var noError = true;
	
	if(name.length == 0){
		$("#productNameFG").addClass('has-error');
		noError = false;
	}
	
	if(price.length == 0){
		$("#productPriceFG").addClass('has-error');
		noError = false;
	}
	
	if(price < 0){
		$("#productPriceFG").addClass('has-error');
		noError = false;
	}
	
	if(description.length == 0){
		$("#descriptionFG").addClass('has-error');
		noError = false;
	}
	
	if(noError){
		var input = {};
		input.storeId = store.storeId;
		input.name = name;
		input.imgUrl = url;
		input.price = price;
		input.description = description;
		
		console.log(input);
		
		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);
		
		$.ajax({
			url : '/Xiaobazaar/owner/CreateProductServlet?json='+inputJson,
			type : "POST",
			dataType : 'json',
			error : function(err) {
				console.log(err);
				alert("createNewProduct: check ajax!");
			},
			success : function(data) {
				console.log(data);
				var status = data["status"];
				var message = data["message"];
				if (status == 0) {
					$("#descriptionFG").addClass('has-error');
					$("#productPriceFG").addClass('has-error');
					$("#productNameFG").addClass('has-error');
				} else {
					var product = message;
					owner.store.products.push(product);
					localStorage.setItem("OWNER", JSON.stringify(owner));
					location.reload();
				}
			}
		});
	}
}

/*
 * function uploadImage(id)
 * Upload image of a product.
 */

function uploadImage(id) {
	var fd = new FormData(document.getElementById(id+"Form"));
	$.ajax({
		url : '/Xiaobazaar/FileUploadServlet?json={"fileType":"image,jpeg,jpg,png","uploadDirectory":"owner","folderName":"product"}',
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
				$("#"+id).val(fileUrl);
				$("#"+id+"Img").attr("src", fileUrl);
			}
		}
	});
}
/*
 * function updateStoreInfo()
 * Update store information
 */

function updateStoreInfo(){
	$("#message").html('');
	var owner = JSON.parse(localStorage.getItem("OWNER"));
	var store = owner.store;
	var name = $("#storeName").val();
	var url = $("#storeUrl").val();
	var layout = $("input:radio[name=layout]:checked").val();
	var description = $("#storeDescription").val();
	
	$("#storeUrlFG").removeClass('has-error');
	$("#storeNameFG").removeClass('has-error');
	$("#storeDescriptionFG").removeClass('has-error');
	
	var noError = true;
	
	if(name.length == 0){
		$("#storeNameFG").addClass('has-error');
		noError = false;
	}
	
	if(url.length == 0){
		$("#storeUrlFG").addClass('has-error');
		noError = false;
	}
	
	if(description.length == 0){
		$("#storeDescriptionFG").addClass('has-error');
		noError = false;
	}
	
	if(noError){
		$(".my-loading").removeClass('sr-only');
		var input = {};
		input.storeId = store.storeId;
		input.name = name;
		input.url = url;
		input.layout = Number(layout);
		input.description = description;
		
		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);
		
		$.ajax({
			url : '/Xiaobazaar/owner/EditStoreServlet?json='+inputJson,
			type : "POST",
			dataType : 'json',
			error : function(err) {
				console.log(err);
				$(".my-loading").addClass('sr-only');
				alert("updateStoreInfo: check ajax!");
			},
			success : function(data) {
				console.log(data);
				var status = data["status"];
				var message = data["message"];
				if (status == 0) {
					$("#message").html(message);
					$(".my-loading").addClass('sr-only');
				} else {
					var store = message;
					owner.store = store;
					localStorage.setItem("OWNER", JSON.stringify(owner));
					$(".my-loading").addClass('sr-only');
				}
			}
		});
	}
}

/*
 * function fillStoreInfo()
 * Load store information
 */

function fillStoreInfo(){
	var owner = JSON.parse(localStorage.getItem("OWNER"));
	var store = owner.store;
	
	$("#storeId").val(store.storeId);
	$("#storeName").val(store.name);
	$("#storeUrl").val(store.url);
	$("#storeDescription").val(store.description);
	
	$("#storeLink").attr("href", "/Xiaobazaar/store/?name="+store.url);
	
	switch(store.layout){
		case 0:
			$("#layout-0").button('toggle');
			break;
		case 1:
			$("#layout-1").button('toggle');
			break;
		default:
		
	}
	
	$("#storeTheme").val(store.themeName);
	
}

/*
 * function isLogin()
 * A protector of owner portal.
 */

function isLogin(){
	var owner = JSON.parse(localStorage.getItem("OWNER"));
	if(owner == undefined || owner == 'undefined'){
		return false;
	}else{
		$("#username").html(owner.name);
		return true;
	}
}

// logout
function ownerLogout(){
	localStorage.clear();
	window.location.href = "/Xiaobazaar/owner-login.html";
}

// create and login
function ownerRegister(){
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
			url : '/Xiaobazaar/owner/OwnerRegisterServlet?json='+inputJson,
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
					var owner = message;
					localStorage.clear();
					localStorage.setItem("OWNER", JSON.stringify(owner));
					location.href = "/Xiaobazaar/owner/";
				}
			}
		});
	}
}

/*
 * function owerLogin()
 * Submit login form to OwnerAuthServlet servlet and get the response.
 */

function ownerLogin(){
	$("#message").html('');
	$(".my-loading").addClass('sr-only');
	var username = $("#username").val();
	var password = $("#password").val();
	
	if(username.length == 0 || password.length == 0){
		$("#message").html('Do not leave blanks!');
	}else if(password.length < 6){
		$("#message").html('Password should not less than 6 digits!');
	}else{
		$(".my-loading").removeClass('sr-only');
		
		var input = {};
		input.name = username;
		input.password = password;
		
		var inputJson = JSON.stringify(input);
		inputJson = encodeURI(inputJson);
		
		$.ajax({
			url : '/Xiaobazaar/owner/OwnerAuthServlet?json='+inputJson,
			type : "POST",
			dataType : 'json',
			error : function(err) {
				console.log(err);
				$(".my-loading").addClass('sr-only');
				alert("ownerLogin: check ajax!");
			},
			success : function(data) {
				console.log(data);
				$(".my-loading").addClass('sr-only');
				var status = data["status"];
				var message = data["message"];
				if (status == 0) {
					$("#message").html(message);
				} else {
					var owner = message;
					localStorage.clear();
					localStorage.setItem("OWNER", JSON.stringify(owner));
					location.href = "/Xiaobazaar/owner/";
				}
			}
		});
	}
}
/*
 * function loadStorePreView()
 * Load CSS and display it in iframe.
 */
function loadStorePreView(){
	var owner = JSON.parse(localStorage.getItem("OWNER"));
	var store = owner.store;
	var url = store.url;
	$("#viewIframe").attr("src", "/Xiaobazaar/store/index.html?name="+url);
}

function resizeIframe(){
	$(".my-iframe").height($(window).height() - 200);
}