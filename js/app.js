$(document).ready(function(){

	function playSound() {
		$('#sound')[0].volume = 0.9;
		$('#sound')[0].load();
		$('#sound')[0].play();
	}

	function reset() {
		$('h2').empty();
		$('.pronounce').empty();
		$('#sound').attr('src', '');
		$('.playSound').attr('style', 'display: hidden');
		$('.left').empty().append('<h3>Definitions</h3>');
		$('.center').empty().append('<h3>Related Words</h3>');
		$('.right').empty().append('<h3>Examples</h3>');
	}

	function getDefinition(input) {

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

					if(data[0] === undefined) {
						$('h2').text("Sorry, can't find " + input);
					} else {
						$('h2').text(data[0].word);
						$.each(data, function(i, definition){
							$('.left').append('<span class="def">'+ definition.text + '</span>');					
						}); // end each loop
					} //end if statement
				} //end callback
			} // end settings
		); //end ajax
	}

	function getPronounce(input) {

		$.ajax(
			'http://api.wordnik.com/v4/word.json/'+ input +'/pronunciations',
			{
				data : {
					word: input,
					api_key: 'dd938175caa9ac3a0a32c09fcc607d8638f0a0e82c8a0bbad'
				}, //end data
				success: function(data) {
					$('.pronounce').html(data[0].raw);
				} //end callback
			} //end settings
		); //end ajax
	}

	function getRelated(input) {

		$.ajax(
			'http://api.wordnik.com/v4/word.json/'+ input +'/relatedWords',
			{
				data : {
					word: input,
					limit: 200,
					api_key: 'dd938175caa9ac3a0a32c09fcc607d8638f0a0e82c8a0bbad'
				}, //end data
				success: function(data) {
					$.each(data, function(i, related) {
						var type = related.relationshipType;
						$('.center').append('<h4>'+type + '</h4>');
						$.each(related.words, function(i, word){
							$('.center').append('<span>' + word + '</span>');
						});
						} //end inner each
					); //end outer each
				} //end callback
			} //end settings
		); //end ajax
	}

	function getExamples(input) {

		$.ajax(
			'http://api.wordnik.com/v4/word.json/'+ input +'/examples',
			{
				data : {
					word: input,
					limit: 200,
					api_key: 'dd938175caa9ac3a0a32c09fcc607d8638f0a0e82c8a0bbad'
				}, //end data
				success: function(data) {
					$.each(data.examples, function(i, example){
						$('.right').append('<span class="ex">'+ example.text + '</span>');					
					}); // end each loop
				} //end callback
			} //end settings
		); //end ajax
	}

	function getAudio(input) {

		$.ajax(
			'http://api.wordnik.com/v4/word.json/'+ input +'/audio',
			{
				data : {
					word: input,
					limit: 3,
					api_key: 'dd938175caa9ac3a0a32c09fcc607d8638f0a0e82c8a0bbad'
				}, //end data
				success: function(data) {
					console.log('audio');
					console.log(data[0]);
					var firstData = data[0];
					if(firstData !== undefined) {
						$('#sound').attr('src', data[0].fileUrl);
						$('.playSound').attr('style', 'display: inline-block');
					} 
					playSound();
					
				} //end callback
			} //end settings
		); //end ajax
	}

	$("form").submit(function(evt) {
		evt.preventDefault();
		var input = $('#search').val();

		reset();
		getRelated(input);
		getDefinition(input);
		getPronounce(input);
		getExamples(input);
		getAudio(input);

		$('#search').val('');
	}); // end submit handler

	$('.center').on("click", "span", function(){
		
		var input = $(this).text();

		reset();
		getRelated(input);
		getDefinition(input);
		getPronounce(input);
		getExamples(input);
		getAudio(input);

	}); //end of related word click handler

	$('.container').on("click", ".playSound", playSound); //end of sound click handler

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

