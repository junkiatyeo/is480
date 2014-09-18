$(document) .ready(
	function() {
		loadStoreContent();

		$('#left-menu').sidr({
			name : 'sidr-left',
			side : 'left'
		});
		$('#right-menu').sidr({
			name : 'sidr-right',
			side : 'right'
		});
		$('#right-menu').css(
				"margin-left",
				$(document).width() - $('#right-menu').width() - 10 + "px");
});

function productScroll() {
	$(document).ready(function() {
		$('.mainnav a').smoothScroll();
		$('.product a').smoothScroll();
	});
}

function productImages() {
	$(document).ready(function() {
		var $container = $('#product-cont');

		$container.imagesLoaded(function() {
			$container.masonry({
				itemSelector : '.product',
				columnWidth : '.grid-sizer'
			});
		});
	});
}

function loadStoreContent() {
	var url = getParameterByName('name');

	var input = {};

	input.url = url;

	var inputJson = JSON.stringify(input);
	inputJson = encodeURI(inputJson);

	$
			.ajax({
				url : '/Xiaobazaar/GetStoreContentServlet?json=' + inputJson,
				type : "POST",
				dataType : 'json',
				error : function(err) {
					console.log(err);
					location.href = "https://www.xiaobazaar.com";
				},
				success : function(data) {
					console.log(data);
					var status = data["status"];
					if (status == 0) {
						location.href = "https://www.xiaobazaar.com";
					} else {
						var store = data["message"];
						var title = store.name;
						var description = store.description;
						var layout = store.layout;
						var products = store.products;
						
						var themeId = store.themeId;
						
						if(themeId != 0){
							updateTheme(store.themeUrl);
						}

						$("#storeName").html(title);
						$("#storeDescription").html(description);

						switch (layout) {
						case 0:
							$("#right-menu").addClass('sr-only');
							break;
						case 1:
							$("#left-menu").addClass('sr-only');
							break;
						default:
							$("#right-menu").addClass('sr-only');
						}

						var productsHtml = '';
						var menuHtml = '';

						for ( var i in products) {
							var product = products[i];
							var pId = product.productId;
							var pName = product.name;
							var pDesc = product.description;
							var pImg = product.imgUrl;
							var price = product.price;
							
							menuHtml += '\
								<li><a href="#'+pId+'">'+pName+'</a></li>';

							productsHtml += '\
						<div class="product" id="'
									+ pId
									+ '">\
							<img src="'
									+ pImg
									+ '" class="image"> <a class="overlay" href="#'
									+ pId
									+ '">\
								<h3 class="title">'
									+ pName
									+ '</h3>\
								<h4 class="price">S$ '
									+ price
									+ '</h4>\
								<div class="description">\
									<p>'
									+ pDesc
									+ '</p>\
								</div>\
							</a>\
						</div>';
						}

						$("#product-cont").append(productsHtml);
						$("#sidr-left .mainnav").append(menuHtml);
						$("#sidr-right .mainnav").append(menuHtml);

						productImages();
						productScroll();
					}
				}
			});
}

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex
			.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g,
			" "));
}

function updateTheme(themeUrl){
	$("#themeLink").attr("href", themeUrl);
}
