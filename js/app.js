$(document).ready(function(){

	$("form").submit(function(evt) {
		evt.preventDefault();
		console.log('form submitted');

		var input = $('#search').val();

		$.ajax(
			'http://developer.wordnik.com/v4/word.json/'+ input +'/definitions',
			{
				data: {
					word: input,
					limit: 200,
					includeRelated: true,
					useCanonical: false,
					includeTags: false,
					api_key: 'dd938175caa9ac3a0a32c09fcc607d8638f0a0e82c8a0bbad'
				}, //end data
				dataType: 'jsonp'
			}, // end settings
			function(r) {
				console.log(r);
			} //end callback
		); //end ajax

	});


	// =========================================
	// Use enter key
	// =========================================
	$(document).on("keydown", function(event) {
		if(event.which === 13) {
			event.stopPropagation();
			event.preventDefault();
			$("form").submit();
		}
	});

});

