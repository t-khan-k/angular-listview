(function(){
	'use strict';

	angular.module('tk-repeat').directive('tkRepeat', function($compile){
		return{
			restrict: 'A',
			scope: true,
			replace: false,
			link: function(scope, elem, attr){
				var rowHeight;
				var exp = attr.tkRepeat.split(' in ');
				var child = exp[0];
				var list = scope.$eval(exp[1]);
				var template = elem[0].innerHTML;

				// Clearing html template
				elem[0].innerHTML = "";

				// Inserting all rows
				insertRows(list, template);

				function insertRows(list, template){
					for(var i = 0, len = list.length; i < len; i++){
						// Using ID to keep track of index
						var el = angular.element(template).attr("id",i);
						var childScope = createChildScope(child, list[i], i + scope.firstIndex);
						elem.append($compile(el)(childScope));
						rowHeight = el[0].offsetHeight;
					}
				}

				// Creates a child scope with required model to bind against template
				function createChildScope(child, row, i){
					var cs = scope.$new();
					cs[child] = row;

					// ng-repeat $index
					cs.$index = i;

					return cs;
				}

				// Reinsert rows on list update
				scope.$watchCollection(function(sc){
						return sc.$eval(exp[1]);
					},
					function(newVal, oldVal){
						if(newVal !== oldVal){
							elem.html("");
							insertRows(newVal, template);
						}
					}
				);

				scope.$on('$destroy',function(){
					elem.off();
				});
			}
		}
	});
})();