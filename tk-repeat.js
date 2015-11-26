
angular.module('app').directive('listView',function($compile){
	return{
		restrict: 'A',
		scope:true,
		replace: false,
		link: function(scope,elem,attr){

			var exp = attr.listView.split(' in ');
			var child = exp[0];
			var data = scope.$eval(exp[1]);
			var template = elem[0].outerHTML;
			insertElements(data,template);
			console.log(template);

			function insertElements(data,template){
				var e = [];
				for(var i=0;i<data.length;i++){
					var el = angular.element(template);
					var childScope = createChildScope(child,data[i]);
					//$compile(el)(childScope);
					//$compile(el)(scope).insertAfter(elem);
				}
			}

			function createChildScope(child,row){
				var cs = scope.$new();
				cs[child] = row;
				return cs;
			}

			/*var arr = [];
			var html = elem.children()[0].innerHTML;
			elem.html("");
			for(var i=0;i<scope.src.length;i++){
				scope.name = scope.src[i].name;
				scope.age = scope.src[i].age;
				var el = angular.element(html);
				arr = arr.concat($compile(el)(scope));
				arr[i].insertAfter(elem);
			}*/
		}
	}
});