(function (window, angular, console, Modernizr) {
    'use strict';

    angular.module('metadata.directives', []).directive("formular", function ($compile, $rootScope) {
        return {
            restrict: "E",
            scope: {
                formular: '=',
                schema: '=',
                doc: '=',
                valid: '='
            },
            templateUrl: 'partials/form.html',
            compile: function (tElement, tAttr) {
                var contents = tElement.contents().remove(),
                    compiledContents;
                return function (scope, iElement, iAttr) {
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    compiledContents(scope, function (clone, scope) {
                        iElement.append(clone);
                    });
                };
            },
            controller: function ($scope) {
                $scope.validate = function () {
                    $scope.$emit('validate');
                };
                $scope.stringType = function (type) {
                    return 'text';
                };
                $scope.isDisabled = $rootScope.isDisabled;
                $rootScope.$watch("isDisabled", function () {
                    $scope.isDisabled = $rootScope.isDisabled;
                });

                var convert = function () {
                    if (!$scope.diabled && typeof ($scope.schema) !== 'undefined' && typeof ($scope.doc) !== 'undefined') {
                        angular.forEach($scope.schema.properties, function (value, key) {
                            $scope.valid[key] = {};
                            switch (value.type) {
                            case 'object':
                                $scope.doc[key] = $scope.doc[key] || {};

                                break;
                            case 'string':
                                if (typeof (value["default"]) !== "undefined") {
                                    $scope.doc[key] = value["default"];
                                } else {
                                    if (typeof (value.format) !== "undefined" && value.format === 'datetime') {
                                        $scope.doc[key] = new Date();
                                    }
                                }
                                break;
                            case 'boolean':
                                if (typeof (value["default"]) !== "undefined") {
                                    $scope.doc[key] = value["default"];
                                } else {

                                    $scope.doc[key] = false;

                                }
                                break;
                            default:
                                if (typeof (value["default"]) !== "undefined") {
                                    $scope.doc[key] = value["default"];
                                }
                                break;
                            }
                        });
                    }
                };
                if ($rootScope.new) {
                    convert();
                    $scope.$watch('doc', function (newValue, oldValue) {
                        convert();
                    });
                    $scope.$watch('schema', function (newValue, oldValue) {
                        convert();
                    });
                }
            }
        };
    }).directive('placeholder', ['$timeout',
        function ($timeout) {
            if (Modernizr.input.placeholder === true) {
                return {};
            }
            return {
                link: function (scope, elm, attrs) {
                    if (attrs.type === 'password') {
                        return;
                    }
                    elm.addClass("placeholder");
                    $timeout(function () {
                        elm.val(attrs.placeholder).bind('focus', function () {
                            elm.removeClass("placeholder");
                            if (elm.val() === elm.attr('placeholder')) {
                                elm.val('');
                            }
                        }).bind('blur', function () {
                            if (elm.val() === '') {
                                elm.val(elm.attr('placeholder'));
                                elm.addClass("placeholder");
                            } else {
                                elm.removeClass("placeholder");


                            }
                        });
                    });
                }
            };
        }]);

}(this, this.angular, this.console, this.Modernizr));