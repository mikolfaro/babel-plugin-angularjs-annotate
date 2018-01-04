module.exports = {
  name: "Require Angular Tests",
  tests: [
  {
    name: "Long form",
    implicit: true,
    input: function(){
      require("angular").module("MyMod").controller("MyCtrl", function($scope, $timeout) {
      });
    },
    expected: function(){
      require("angular").module("MyMod").controller("MyCtrl", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "w/ dependencies",
    implicit: true,
    input: function(){
      require("angular").module("MyMod", ["OtherMod"]).controller("MyCtrl", function($scope, $timeout) {
      });
    },
    expected: function(){
      require("angular").module("MyMod", ["OtherMod"]).controller("MyCtrl", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Implict config function",
    implicit: true,
    input: function(){
      // implicit config function
      require("angular").module("MyMod", function($interpolateProvider) {});
      require("angular").module("MyMod", ["OtherMod"], function($interpolateProvider) {});
      require("angular").module("MyMod", ["OtherMod"], function($interpolateProvider) {}).controller("foo", function($scope) {});
    },
    expected: function(){
      // implicit config function
      require("angular").module("MyMod", ["$interpolateProvider", function($interpolateProvider) {}]);
      require("angular").module("MyMod", ["OtherMod"], ["$interpolateProvider", function($interpolateProvider) {}]);
      require("angular").module("MyMod", ["OtherMod"], ["$interpolateProvider", function($interpolateProvider) {}]).controller("foo", ["$scope", function($scope) {}]);
    }
  },
  {
    name: "Object property",
    implicit: true,
    input: function(){
      // object property
      var myObj = {};
      myObj.myMod = require("angular").module("MyMod");
      myObj.myMod.controller("foo", function($scope, $timeout) { a });

    },
    expected: function(){
      // object property
      var myObj = {};
      myObj.myMod = require("angular").module("MyMod");
      myObj.myMod.controller("foo", ["$scope", "$timeout", function($scope, $timeout) { a }]);
    }
  },
  {
    name: "$provide",
    implicit: true,
    input: function(){
      require("angular").module("myMod").controller("foo", function() {
          $provide.decorator("foo", function($scope) {});
          $provide.service("foo", function($scope) {});
          $provide.factory("foo", function($scope) {});
          //$provide.provider
          $provide.provider("foo", function($scope) {
              this.$get = function($scope) {};
              return { $get: function($scope, $timeout) {}};
          });
          $provide.provider("foo", {
              $get: function($scope, $timeout) {}
          });
      });
    },
    expected: function(){
      require("angular").module("myMod").controller("foo", function() {
          $provide.decorator("foo", ["$scope", function($scope) {}]);
          $provide.service("foo", ["$scope", function($scope) {}]);
          $provide.factory("foo", ["$scope", function($scope) {}]);
          //$provide.provider
          $provide.provider("foo", ["$scope", function($scope) {
              this.$get = ["$scope", function($scope) {}];
              return { $get: ["$scope", "$timeout", function($scope, $timeout) {}]};
          }]);
          $provide.provider("foo", {
              $get: ["$scope", "$timeout", function($scope, $timeout) {}]
          });
      });
    }
  },
  {
    name: "ControllerProvider",
    implicit: true,
    input: function(){
      require("angular").module("myMod").controller("foo", function() {
          $controllerProvider.register("foo", function($scope) {});
      });
      function notInContext() {
          $controllerProvider.register("foo", function($scope) {});
      }
    },
    expected: function(){
      require("angular").module("myMod").controller("foo", function() {
          $controllerProvider.register("foo", ["$scope", function($scope) {}]);
      });
      function notInContext() {
          $controllerProvider.register("foo", function($scope) {});
      }
    }
  },
  {
    name: "IIFE-jumping with reference support",
    implicit: true,
    input: function(){
      var myCtrl = (function () {
          return function($scope) {
          };
      })();
      require("angular").module("MyMod").controller("MyCtrl", myCtrl);
    },
    expected: function(){
      var myCtrl = (function () {
          return function($scope) {
          };
      })();
      myCtrl.$inject = ["$scope"];
      require("angular").module("MyMod").controller("MyCtrl", myCtrl);
    }
  },
  {
    name: "advanced IIFE-jumping (with reference support)",
    implicit: true,
    input: function(){
      var myCtrl10 = (function() {
          "use strict";
          // the return statement can appear anywhere on the functions topmost level,
          // including before the myCtrl function definition
          return myCtrl;
          function myCtrl($scope) {
              foo;
          }
          post;
      })();
      require("angular").module("MyMod").controller("MyCtrl", myCtrl10);
    },
    expected: function(){
      var myCtrl10 = (function() {
          "use strict";
          // the return statement can appear anywhere on the functions topmost level,
          // including before the myCtrl function definition
          myCtrl.$inject = ["$scope"];
          return myCtrl;
          function myCtrl($scope) {
              foo;
          }
          post;
      })();
      require("angular").module("MyMod").controller("MyCtrl", myCtrl10);
    }
  },
  {
    name: "injectable component templates/controller/templateurl",
    implicit: true,
    input: function(){
      require("angular").module("mod").component("cmp", {
        controller: function(a){},
        template: function(b){},
        templateUrl: function(c){},
      }).component("cmp2", {
        controller: "myCtrl",
        template: "tmpl",
        templateUrl: "template.html"
      });
    },
    expected: function(){
      require("angular").module("mod").component("cmp", {
        controller: ["a", function(a){}],
        template: ["b", function(b){}],
        templateUrl: ["c", function(c){}],
      }).component("cmp2", {
        controller: "myCtrl",
        template: "tmpl",
        templateUrl: "template.html"
      });
    }
  }
 ]
};
