function saveTheme(number){
	
	var newThemeName = $("#name-"+number).val();
	if (newThemeName.length == 0) {
		$("#message").html('Do not leave blanks!');
	} else {
		var themeID = number;
		var input = {};
		input.themeID = themeID;
		input.newThemeName = newThemeName;
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
				if (status == 0) {
				//	$("#message").html(message);
				//} else (status==1) {
					
				}
			}
		});
	}
}