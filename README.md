# angular-listview

## Description
Minimalistic load-on-demand behaviour ListView control for AngularJS. Tried to mimic the ListView controls we have in XML/XAML. It uses custom directive for repeating elements instead of ng-repeat, which may be faster than ng-repeat (performance test needed). The concept is to only have those items in DOM that are currently on the viewport. So in case of 100 or 100k elements in an array, it only add those items in DOM that can be seen.

Features include:<br/>
1. load-on-demand behaviour<br/>
2. Click event

Plan to add more options and feautres in coming days.

Idea taken from Angular Material Virtual Repeat
https://material.angularjs.org/latest/demo/virtualRepeat

## Live DEMO
https://goo.gl/8we8bz

## Usage
````html
<div ng-app="app" ng-controller="DemoController as vm">
  <div angular-listview="item in vm.list" on-click="vm.itemClick">
    number: {{item.num}} , index: {{$index}}
  </div>
</div>
````

````javascript
var app = angular.module("app", [ 'angular-listview' ]);
app.controller('DemoController', [UsersController]);

function UsersController(){
    var vm = this;
    vm.list = [{num: 1},{num: 2},{num: 3}];
    
    vm.itemClick = function(item, index){
        alert("index: " + index + ", value: " + item.num);
    };
}
````

also, can be used as an element
````html
<angular-listview="item in vm.list" on-click="vm.itemClick"></angular-listview>
````

#License

The MIT License (MIT)

Copyright (c) 2015 Talha khan kakerzai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
