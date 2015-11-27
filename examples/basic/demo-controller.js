angular.module("app").controller('DemoController', ['$timeout', UsersController]);

function UsersController($timeout){
    var vm = this;
    vm.list = getNumbers(100);

    function getNumbers(n){
        var arr = [];
        for(var i = 0; i < n; i++){
            arr.push({num: i});
        }
        return arr;
    }

    vm.clicker = function(item, index){
        console.log("index: " + index + ", value: " + item.num);
        alert("index: " + index + ", value: " + item.num);
    };

    vm.push = function(){
        vm.list.push({num: vm.list.length});
    };

    vm.unshift = function(){
        vm.list.unshift({num: (vm.list[0].num - 1)});
    };
}