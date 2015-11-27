
angular.module("app").controller('DemoController',[UsersController]);

function UsersController(){
	var vm = this;
	vm.list = getNumbers(100);

	function getNumbers(n){
		var arr = [];
		for(var i=0;i<n;i++){
			arr.push({num: i});
		}
		return arr;
	}

    vm.clicker = function(item,index){
        console.log("ctrl1: ",item," index:",index);
    };
}