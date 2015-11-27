(function(){
    'use strict';

    angular.module('app').directive('tkListView', function($compile){
        return{
            restrict: 'AE',
            scope: true,
            replace: false,
            link: function(scope, elem, attr){
                var firstIndex = 0;
                var lastIndex = 8;
                scope.firstIndex = firstIndex;
                var threshold = 2;
                var clickHandler = attr.onClick || null;
                clickHandler = scope.$eval(clickHandler);
                var exp = (attr.listView) ? attr.listView.split(' in ') : attr.src.split(' in ');
                var child = exp[0];
                var data = scope.$eval(exp[1]);
                var template = elem[0].innerHTML;
                scope.listViewSrc = data.slice(firstIndex, lastIndex);

                appendTkRepeat(child, 'listViewSrc');
                var rowHeight = floor(elem[0].lastChild.offsetHeight / scope.listViewSrc.length);

                /*lastIndex = elem[0].offsetHeight / rowHeight;
                scope.listViewSrc = data.slice(firstIndex, lastIndex + 4);*/

                appendVirtualContainers();
                adjustVirtualContainers(firstIndex, lastIndex, rowHeight, data.length);

                scope.$watchCollection(function(sc){
                        return sc.$eval(exp[1])
                    },
                    function(newVal, oldVal){
                        if(newVal !== oldVal){
                            scope.listViewSrc = newVal;
                        }
                    }
                );

                elem.on('scroll', function(){
                    var firstIndex = ceil(elem[0].scrollTop / rowHeight) - threshold;
                    firstIndex = (firstIndex < 0) ? 0 : firstIndex;
                    var lastIndex = firstIndex + ceil(elem[0].offsetHeight / rowHeight) + threshold;
                    scope.$apply(function(){
                        scope.listViewSrc = data.slice(firstIndex, lastIndex);
                        scope.firstIndex = firstIndex;
                    });
                    adjustVirtualContainers(firstIndex, lastIndex, rowHeight, data.length);
                });

                function appendTkRepeat(child, data){
                    var tkRepeat = angular.element(createTkRepeat(child,data))
                        .html(template)
                        .on('click',function(e){
                            var index = parseInt(e.target.id);          // Trimmed list index
                            var actualIndex = index + scope.firstIndex;
                            clickHandler(this.listViewSrc[index],actualIndex);
                        }.bind(scope));
                    elem.append($compile(tkRepeat)(scope));
                }

                function appendVirtualContainers(){
                    var topHeight = 0;
                    var bottomHeight = 0;
                    elem.prepend(angular.element(createDiv("virtual-container-top",topHeight)));
                    elem.append(angular.element(createDiv("virtual-container-bottom",bottomHeight)));
                }

                function adjustVirtualContainers(firstIndex, lastIndex, rowHeight, itemsLength){
                    var topHeight = firstIndex * rowHeight;
                    var bottomHeight = (itemsLength - lastIndex) * rowHeight;
                    bottomHeight += 300;
                    angular.element('.virtual-container-top').css({height: topHeight});
                    angular.element('.virtual-container-bottom').css({height: bottomHeight});
                }

                function createDiv(className, topHeight){
                    return "<div class='"+className+"' style='height: "+topHeight+"px'></div>";
                }

                function createTkRepeat(child, data){
                    return "<div tk-repeat='"+child+" in "+data+"'></div>";
                }

                function floor(num){
                    return Math.floor(num);
                }

                function ceil(num){
                    return Math.ceil(num);
                }
            }
        }
    });
})();