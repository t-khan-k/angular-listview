(function(){
    'use strict';

    angular.module('app').directive('tkRepeat', function($compile){
        return{
            restrict: 'A',
            scope: true,
            replace: false,
            link: function(scope, elem, attr){
                var exp = attr.tkRepeat.split(' in ');
                var child = exp[0];
                var data = scope.$eval(exp[1]);
                var template = elem[0].innerHTML;
                insertElements(data, template);
                var rowHeight;

                function insertElements(data, template){
                    for(var i = 0, len = data.length; i < len; i++){
                        var el = angular.element(template);
                        var childScope = createChildScope(child, data[i]);
                        elem.append($compile(el)(childScope));
                        rowHeight = el[0].offsetHeight;
                    }
                }

                function createChildScope(child, row){
                    var cs = scope.$new();
                    cs[child] = row;
                    return cs;
                }

                scope.$watchCollection(function(sc){
                        return sc.$eval(exp[1])
                    },
                    function(newVal, oldVal){
                        if(newVal !== oldVal){
                            elem.html("");
                            insertElements(newVal, template);
                        }
                    }
                );
            }
        }
    });
})();