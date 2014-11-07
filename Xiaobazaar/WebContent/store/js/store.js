$(document) .ready(
	function() {
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
				
		productImages();
		productScroll();
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
