'use strict';


// Directive for Facebook Share
angular.module('mean.rizers').directive('fbShare', [
	function() {
		return {
			restrict: 'A',
			link: function(scope, element) {
				element.on('click', function(e) {
					var link = 'http://google.com';
					var name = 'test2';
					var picture = 'test3';
					var description = 'test4';
					var shareConfig = {
						Width: 500,
						Height: 500
					};

				    // popup position
				    var px = Math.floor(((screen.availWidth || 1024) - shareConfig.Width) / 2),
				        py = Math.floor(((screen.availHeight || 700) - shareConfig.Height) / 2);

				    // open popup
				    var popup = window.open(this.href, "social", 
				        "width="+shareConfig.Width+",height="+shareConfig.Height+
				        ",left="+px+",top="+py+
				        ",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1");
				    if (popup) {
				        popup.focus();
				        if (e.preventDefault) e.preventDefault();
				        e.returnValue = false;
				    }
				});
			}
		};
	}
]);
angular.module('mean.rizers').directive('twShare', [
	function() {
		return {
			restrict: 'A',
			link: function(scope, element) {
				element.on('click', function(e) {

					var shareConfig = {
						Width: 500,
						Height: 500
					};

				    // popup position
				    var px = Math.floor(((screen.availWidth || 1024) - shareConfig.Width) / 2),
				        py = Math.floor(((screen.availHeight || 700) - shareConfig.Height) / 2);

				    // open popup
				    var popup = window.open(this.href, "social", 
				        "width="+shareConfig.Width+",height="+shareConfig.Height+
				        ",left="+px+",top="+py+
				        ",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1");
				    if (popup) {
				        popup.focus();
				        if (e.preventDefault) e.preventDefault();
				        e.returnValue = false;
				    }
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


