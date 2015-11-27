
angular.module("app").controller('UsersController',['$timeout',UsersController]);

function UsersController($timeout){
	var vm = this;
	vm.list = getNumbers(100);

	function getNumbers(n){
		var arr = [];
		for(var i=0;i<n;i++){
			arr.push({num: i});
		}
		return arr;
	}
}