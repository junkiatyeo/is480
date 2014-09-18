//$(document).ready(function() {
//	$('#themetable').DataTable({
//		"sAjaxSource" : '/Xiaobazaar/getThemes',
//		"sAjaxDataProp" : "aaData",
//	});
//});

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
										alert("ownerRegister: check ajax!");
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
					<td>'
													+ url
													+ '</td>\
					<td><button type="button" class="btn btn-success">Accept</button>  '

													+ '<button type="button" class="btn btn-danger">Deny</button></td>\
				</tr>';
										}

										$("#themelist").html(dataHtml);

										LoadDataTablesScripts(AllTables);
									}
								});

					});

}