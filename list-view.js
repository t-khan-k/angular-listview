(function(){
    'use strict';

    angular.module('app').directive('listView',function($compile){
        return{
            restrict: 'AE',
            scope:true,
            replace: false,
            link: function(scope,elem,attr){
                var exp = (attr.listView)? attr.listView.split(' in ') : attr.repeater.split(' in ');
                var child = exp[0];
                var data = scope.$eval(exp[1]);
                var template = elem[0].innerHTML;
                scope.listViewSrc = data.slice().slice(0,8);
                var threshold = 2;

                appendTkRepeat(child,'listViewSrc');
                var rowHeight = Math.floor(elem[0].lastChild.offsetHeight/scope.listViewSrc.length);
                appendVirtualContainers();
                adjustVirtualContainers(0,8,rowHeight,data.length);

                scope.$watchCollection(function(sc){
                        return sc.$eval(exp[1])
                    },
                    function(newVal,oldVal){
                        if(newVal !== oldVal){
                            scope.listViewSrc = newVal;
                        }
                    }
                );

                elem.on('scroll',function(){
                    var firstIndex = ceil(elem[0].scrollTop/rowHeight) - threshold;
                    firstIndex = (firstIndex < 0)? 0 : firstIndex;
                    var lastIndex = firstIndex + ceil(elem[0].offsetHeight/rowHeight) + threshold - 1;
                    var subArray = data.slice(firstIndex,lastIndex + 1);
                    scope.$apply(function(){
                        scope.listViewSrc = subArray.slice();
                    });
                    adjustVirtualContainers(firstIndex,lastIndex,rowHeight,data.length);
                });

                function appendTkRepeat(child,data){
                    var tkRepeat = angular.element("<div tk-repeat='"+child+" in "+data+"'></div>").html(template);
                    elem.append($compile(tkRepeat)(scope));
                }

                function appendVirtualContainers(){
                    var topHeight = 0;
                    var bottomHeight = 10;
                    elem.prepend(angular.element("<div class='virtual-container-top' style='height: "+topHeight+"px'></div>"));
                    elem.append(angular.element("<div class='virtual-container-bottom' style='height: "+bottomHeight+"px'></div>"));
                }

                function adjustVirtualContainers(firstIndex,lastIndex,rowHeight,itemsLength){
                    var topHeight = firstIndex * rowHeight;
                    var bottomHeight = (itemsLength - lastIndex) * rowHeight;
                    bottomHeight += 300;
                    angular.element('.virtual-container-top').css({height: topHeight});
                    angular.element('.virtual-container-bottom').css({height: bottomHeight});
                }

                function ceil(num){
                    return Math.ceil(num);
                }
            }
        }
    });
})();