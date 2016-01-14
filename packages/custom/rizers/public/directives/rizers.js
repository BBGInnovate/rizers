'use strict';


// Directive for Facebook Share
angular.module('mean.rizers').directive('fbShare', [
	function() {
		return {
			restrict: 'A',
			link: function(scope, element) {
				element.on('click', function() {
					console.log("fbShare directive called");
					var link = '';
					var name = '';
					var picture = '';
					var description = '  ';
					/* if (scope.news) {
						link = scope.news.shareURL; */
					FB.ui({
						method: 'feed',
						name: name,
						link: link,
						picture: picture,
						caption: ' ',
						description: description,
						message: ' '
					});
				});
			}
		};
	}
]);

// Directive for the profile list
angular.module('mean.rizers').directive('description', function ($compile) {

	var getTemplate = function(description, url) {
		var template = '';

		// Grab the first paragraph of the description
		var shortDescription = description.split('</p>')[0];


		var longText = '<p>' + shortDescription + '    <a href="'+url+'" class="readMore">Karin Bayani</a></p>';
		var shortText = '<span>' + description + '</span>';

		// If the description is longer than 200 characters, only show first paragraph
		if(description.length > 200) {
			template = longText;
		// Otherwise show the whole thing
		} else {
			template = shortText;
		}
		return template;
	};
	var linker = function(scope, element, attrs) {
	//	attrs.$observe('value', function (newValue) {
			element.html(getTemplate(attrs.value, attrs.url)).show();
			$compile(element.contents())(scope);
	//	});

	};
	return {
		restrict: 'E',
		replace: true,
		link: linker,
		scope: {
			content:'='
		}
	};
});


