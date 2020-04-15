$(document).ready(function() {
	var table = $('#example').DataTable({
		dom: 'Bfrtip',
		buttons: [
			'copy', {
				extend: 'csv',
				exportOptions: {
					format: {
						body: function(data, row, column) {
							var result = data;
							var cols = [2];
							var field_separator = ",";
							if ($.inArray(column, cols) > -1) {
								tokens = data.split(/["']/);
								url = tokens[1].replace(",", "%2c");
								link_text = tokens[2].replace("</a>", "").replace(">", "").replace("\"", "'");
								result = "=HYPERLINK(\"" + url + "\"" + field_separator + "\"" + link_text + "\")";
							}
							return result;
						}
					}
				}
			},
			'excel',
			'pdf',
			'print'
		]
	});
	// Set OnClick Event
	$('#example tbody').on('click', 'tr', function() {
		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
		} else {
			table.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
		}
	});
	// Set OnMouseEnter Event
	$('#example tbody').on('mouseenter', 'td', function() {
		var colIdx = table.cell(this).index().column;

		$(table.cells().nodes()).removeClass('selected');
		$(table.column(colIdx).nodes()).addClass('selected');
	});
});