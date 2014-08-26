$(document).ready(function(){

	$("form").submit(function(evt) {
		evt.preventDefault();
		console.log('form submitted');

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
						var def = $('.template .result').clone();
						
						// if(i>0 && (definition[i].attributionText !== definition[i-1].attributionText)) {
							def.find('span:first-child').text(definition.attributionText);
						// } else {
						// 	def.find('span:first-child').hide();
						// }
						
						

						def.find('span:nth-child(2)').text(definition.text);
						$('.left').append(def);
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

