$(document).ready(function(){

	// =========================================
	// counter variable used in getDefinition()
	// =========================================

	var counter = 0;

	// =========================================
	// Functions
	// =========================================

	function reset() {
		$('h2').empty();
		$('.pronounce').empty();
		$('#sound').attr('src', '');
		$('.playSound').attr('style', 'display: hidden');
		$('.columns').hide();
		$('.left').empty().append('<h3>Definitions</h3>').hide();
		$('.center').empty().append('<h3>Related Words</h3>').hide();
		$('.right').empty().append('<h3>Examples</h3>').hide();
		counter = 0;
	}

	function getDefinition(input) {
		var inputLower = input.replace(input[0], input.charAt(0).toLowerCase());
		var inputUpper = input.replace(input[0], input.charAt(0).toUpperCase());

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
					if (data[0] === undefined && counter === 0) {				
						counter++;
						getDefinition(inputUpper);
					} else if (data[0] === undefined) {
						$('h2').text("Sorry, can't find " + inputLower + " or " + inputUpper);
					} else {
						$('h2').text(data[0].word);
						$.each(data, function(i, definition){
							$('.left').append('<span title="' + definition.attributionText + '" class="def">'+ definition.text + '</span>');					
							showColumns();
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
					var first = data[0];
					$('.pronounce').html(first.raw);
				} //end callback
			} //end settings
		); //end ajax
	}

	function playSound() {
		$('#sound')[0].volume = 0.9;
		$('#sound')[0].load();
		$('#sound')[0].play();
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
					limit: 10,
					api_key: 'dd938175caa9ac3a0a32c09fcc607d8638f0a0e82c8a0bbad'
				}, //end data
				success: function(data) {
					$.each(data.examples, function(i, example){
						$('.right').append('<span>'+ example.text + '</span>');
						$('.right').append('<span class="exSrc">-<strong>'+ example.provider.name + '</strong>, <em>' + example.title + '</em>, ' + example.year + '</span>');					
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

	function showColumns() {
		setTimeout(function() {
			$('.columns').show();
		}, 1500);

		setTimeout(function() {
			$('.left').slideDown(400);
			$('.center').slideDown(800);
			$('.right').slideDown(1200);
		}, 2500);

	}

	function wordUp(input) {
		reset();
		getRelated(input);
		getDefinition(input);
		getPronounce(input);
		getExamples(input);
		getAudio(input);
	}

	// =========================================
	// Event Handlers
	// =========================================

	$("form").submit(function(evt) {
		evt.preventDefault();
		var input = $('#search').val().trim().toLowerCase();
		wordUp(input);
		$('#search').val('');
	}); // end submit handler

	$('.center').on("click", "span", function(){
		var input = $(this).text();
		wordUp(input);
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

