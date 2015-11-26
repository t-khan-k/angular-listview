
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
			insertElements(data,template);
            var rowHeight;

			function insertElements(data,template){
				for(var i=0,len=data.length;i<len;i++){
					var el = angular.element(template);
					var childScope = createChildScope(child,data[i]);
					elem.append($compile(el)(childScope));
                    rowHeight = el[0].offsetHeight;
				}
			}

			function createChildScope(child,row){
				var cs = scope.$new();
				cs[child] = row;
				return cs;
			}

            elem.on('scroll',function(){
                var threshold = 2;
                var firstIndex = Math.ceil(elem[0].scrollTop/rowHeight) - threshold;
                firstIndex = (firstIndex < 0)? 0 : firstIndex;
                var lastIndex = firstIndex + Math.ceil(elem[0].offsetHeight/rowHeight) + threshold;
                var subArray = data.slice(firstIndex,lastIndex + 1);
                var height = Math.ceil(elem[0].scrollTop) + 50;
                scope.$apply(function(){
                    //elem.html("<div class='offset'></div>");
                    //insertElements(subArray,template);
                    //elem.append("<div class='offset'></div>");
                    //$('.offset').css({height: height});
                });
                console.log(subArray);
            });
		}
	}
});