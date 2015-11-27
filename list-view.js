
angular.module('app').directive('listView',function($compile){
	return{
		restrict: 'E',
		scope:true,
		replace: false,
		link: function(scope,elem,attr){

			var exp = attr.repeater.split(' in ');
			var child = exp[0];
			var data = scope.$eval(exp[1]);
			var template = elem[0].innerHTML;
			scope.listViewSrc = data.slice().slice(0,8);
			appendRepeater(child,'listViewSrc');
			var rowHeight = elem[0].lastChild.offsetHeight/scope.listViewSrc.length;
			var totalHeight = elem[0].lastChild.offsetHeight * data.length;

			elem.on('scroll',function(){
				var threshold = 2;
				var firstIndex = Math.ceil(elem[0].scrollTop/rowHeight) - threshold;
				firstIndex = (firstIndex < 0)? 0 : firstIndex;
				var lastIndex = firstIndex + Math.ceil(elem[0].offsetHeight/rowHeight) + threshold;
				var subArray = data.slice(firstIndex,lastIndex + 1);
				var height = Math.ceil(elem[0].scrollTop) + 50;
				//scope.listViewSrc = subArray.slice();
				//appendRepeater(child,'listViewSrc');
				/*scope.$apply(function(){
				 elem.html("<div class='offset'></div>");
				 insertElements(subArray,template);
				 //elem.append("<div class='offset'></div>");
				 //$('.offset').css({height: height});
				 });*/
				console.log(subArray);
			});

			function appendRepeater(child,data){
				var template = elem[0].innerHTML;
				elem.html("");
				elem.append($compile(angular.element("<div tk-repeat='"+child+" in "+data+"'></div>").html(template))(scope));
			}
		}
	}
});