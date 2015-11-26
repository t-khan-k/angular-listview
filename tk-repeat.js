
angular.module('app').directive('listView',function($compile){
	return{
		restrict: 'A',
		scope:true,
		replace: false,
		link: function(scope,elem,attr){

			var exp = attr.listView.split(' in ');
			var child = exp[0];
			var data = scope.$eval(exp[1]);
			var template = elem[0].innerHTML;
			elem.html("");
			insertElements(data,template);

			function insertElements(data,template){
				for(var i=0;i<data.length;i++){
					var el = angular.element(template);
					var childScope = createChildScope(child,data[i]);
					//$compile(el)(childScope).insertBefore(elem);
					elem.append($compile(el)(childScope))
				}
			}

			function createChildScope(child,row){
				var cs = scope.$new();
				cs[child] = row;
				return cs;
			}
		}
	}
});