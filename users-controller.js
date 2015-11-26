
angular.module("app").controller('UsersController',['$timeout',UsersController]);

function UsersController($timeout){
	var vm = this;
	vm.list = [{name: "talha", age:2},{name: "saad", age:3}];
}