(function(){
	'use strict';

	angular.module('angular-listview').directive('angularListview', function($compile,$timeout){
		return{
			restrict: 'AE',
			scope: true,
			replace: false,
			link: function(scope, elem, attr){
				var clickHandler = attr.onClick || null;
				if(clickHandler){
					clickHandler = scope.$eval(clickHandler);
				}

				// tk-repeat
				var tkRepeatElem;

				// Margin, extra 2 rows on top and bottom
				var threshold = 2;

				var firstIndex = 0;

				// Initially, populate 8 rows
				var lastIndex = 8;

				scope.firstIndex = firstIndex;
				var exp = (attr.listView) ? attr.listView.split(' in ') : attr.src.split(' in ');
				var child = exp[0];

				// Supplied list
				var list = scope.$eval(exp[1]);

				var template = elem[0].innerHTML;

				// Clearing html template
				elem[0].innerHTML = "";

				// Initial rows from firstIndex to lastIndex
				scope.listViewSrc = list.slice(firstIndex, lastIndex);

				initializeTkRepeat(child, 'listViewSrc');

				// Row height
				var rowHeight = floor(elem[0].lastChild.offsetHeight / scope.listViewSrc.length);

				appendVirtualContainers();
				adjustVirtualContainers(firstIndex, lastIndex, rowHeight, list.length);
				addMoreRows();

				// Calculate what rows must appear on current viewport
				// add/insert them
				// adjust height of top and bottom virtual containers
				// to make sure the new trimmed list would appear
				// on the specific scroll position as it would on normal lists
				elem.on('scroll', function(){
					var firstIndex = ceil(elem[0].scrollTop / rowHeight) - threshold;
					firstIndex = (firstIndex < 0) ? 0 : firstIndex;
					var lastIndex = firstIndex + carryCount() + threshold;
					scope.$apply(function(){
						scope.listViewSrc = list.slice(firstIndex, lastIndex);
						scope.firstIndex = firstIndex;
					});
					adjustVirtualContainers(firstIndex, lastIndex, rowHeight, list.length);
				});

				// Compile and append tk-repeat directive
				// tk-repeat is used instead of ng-repeat
				function initializeTkRepeat(child, list){
					tkRepeatElem = angular.element(tkRepeat(child,list))
						.html(template);
					if(clickHandler){
						tkRepeatElem.on('click',itemClick);
					}
					elem.append($compile(tkRepeatElem)(scope));
				}

				// tk-repeat item/row click
				function itemClick(e){
					// Trimmed list index
					var index = parseInt(e.target.id);

					var actualIndex = index + scope.firstIndex;
					clickHandler(scope.listViewSrc[index],actualIndex);
				}

				// Append top and bottom virtual containers
				function appendVirtualContainers(){
					var topHeight = 0;
					var bottomHeight = 0;
					elem.prepend(angular.element(div("virtual-container-top",topHeight)));
					elem.append(angular.element(div("virtual-container-bottom",bottomHeight)));
				}

				// Set top and bottom containers height
				function adjustVirtualContainers(firstIndex, lastIndex, rowHeight, listLength){
					var topHeight = firstIndex * rowHeight;
					var bottomHeight = (listLength - lastIndex) * rowHeight;
					bottomHeight += 300;
					angular.element('.virtual-container-top').css({height: topHeight});
					angular.element('.virtual-container-bottom').css({height: bottomHeight});
				}

				// If viewport can carry more rows then add .. (initially 8 were added)
				function addMoreRows(){
					// Just to safely $apply
					$timeout(function(){
						scope.listViewSrc = list.slice(firstIndex, carryCount() + threshold);
					},0);
				}

				// Returns number of rows that can be rendered in the parent container
				function carryCount(){
					return ceil(elem[0].offsetHeight / rowHeight);
				}

				function div(className, topHeight){
					return "<div class='"+className+"' style='height: "+topHeight+"px'></div>";
				}

				function tkRepeat(child, list){
					return "<div tk-repeat='"+child+" in "+list+"'></div>";
				}

				function floor(num){
					return Math.floor(num);
				}

				function ceil(num){
					return Math.ceil(num);
				}

				// Update tk-repeat on main list update
				scope.$watchCollection(function(sc){
						return sc.$eval(exp[1]);
					},
					function(newVal, oldVal){
						if(newVal !== oldVal){
							scope.listViewSrc = newVal;
						}
					}
				);

				// Removing all handlers
				scope.$on('$destroy',function(){
					tkRepeatElem.off();
					elem.off();
				});
			}
		}
	});
})();