$(document).ready(function(){

	$("form").submit(function(evt) {
		evt.preventDefault();
		console.log('hi');

		var input = $('#search').val();

		$.ajax({
			url: 'http://developer.wordnik.com/v4/word.json/'+ input +'/definitions',
			data: {
				word: input,
				api_key: 'dd938175caa9ac3a0a32c09fcc607d8638f0a0e82c8a0bbad',
				dataType: 'jsonp'
			}
		});


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

