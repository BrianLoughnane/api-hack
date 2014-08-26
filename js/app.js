$(document).ready(function(){

	$("form").submit(function(evt) {
		evt.preventDefault();
		console.log('form submitted');

		$('h2').empty();
		$('.examples').empty();
		$('.center').empty().append('<h3>Related Words</h3>');
		$('.left').empty().append('<h3>Definitions</h3>');


		var input = $('#search').val();

		$.ajax(
			'http://api.wordnik.com/v4/word.json/'+ input +'/definitions',
			{
				data: {
					word: input,
					limit: 10,
					includeRelated: true,
					useCanonical: false,
					includeTags: false,
					api_key: 'dd938175caa9ac3a0a32c09fcc607d8638f0a0e82c8a0bbad'
				}, //end data
				success:  function(data) {
					console.log(data);
					$('h2').text(data[0].word);

					$.each(data, function(i, definition){
						$('.left').append('<span class="def">'+ definition.text + '</span>');					
						console.log($(this));
					}); // end each loop
				} //end callback
			} // end settings
		); //end ajax

		$.ajax(
			'http://api.wordnik.com/v4/word.json/'+ input +'/relatedWords',
			{
				data : {
					word: input,
					limit: 200,
					api_key: 'dd938175caa9ac3a0a32c09fcc607d8638f0a0e82c8a0bbad'
				}, //end data
				success: function(data) {
					console.log(data);

					$.each(data, function(i, related) {
						var type = related.relationshipType;
						$('.center').append('<h4>'+type + '</h4>');
						$.each(related.words, function(i, word){
							$('.center').append(word + '<br>');
						});
						}
					);

				}
			} //end settings
		); //end ajax

		$.ajax(
			'http://api.wordnik.com/v4/word.json/'+ input +'/topExample',
			{
				data : {
					word: input,
					api_key: 'dd938175caa9ac3a0a32c09fcc607d8638f0a0e82c8a0bbad'
				}, //end data
				success: function(data) {
					console.log(data);

					$('.examples').html('<em>'+ data.text + '<br>' + '-' + data.title)+'</em>';

				}
			} //end settings
		); //end ajax


		// getDefinition(input);
		// getRelated(input);

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

