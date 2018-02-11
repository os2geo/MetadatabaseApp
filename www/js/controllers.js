/*jslint nomen: true */
/*jslint plusplus: true */
(function (window, angular, console) {
    'use strict';

    angular.module('metadata.controllers', []).controller('search', ['$scope', '$http', '$sce', '$rootScope',
        function ($scope, $http, $sce, $rootScope) {
            $rootScope.showSchemas = true;
            var sort = $rootScope.configuration.schema.sort.substr(1).replace(/\//g, '.') + '.raw',
                buildKeys = function (node, parent) {
                    var key;
                    for (key in node) {
                        if (node.hasOwnProperty(key)) {
                            if (node[key].properties) {
                                buildKeys(node[key].properties, parent + key + '.');

                            } else {
                                $scope.keys[parent + key] = node[key].title || key;
                            }
                        }

                    }
                };
            $scope.status = "icon-search";
            $scope.html = function (html) {
                return $sce.trustAsHtml(html);
            };
            $scope.search = function () {
                if ($scope.query.length > 1) {
                    $scope.status = "icon-spinner icon-spin";
                    $http({
                        method: 'POST',
                        url: '/es/db-' + $rootScope.configuration.database + '/_search',
                        data: {
                            query: {
                                wildcard: {
                                    "_all": $scope.query + '*'
                                }
                            },
                            highlight: {
                                fields: {
                                    "*": {}
                                }
                            },
                            size: 10000
                        }
                    }).success(function (data, status, headers, config) {
                        $scope.result = data;
                        $scope.status = "icon-search";
                    }).error(function (data, status, headers, config) {
                        $scope.error = data;
                        $scope.results = [];
                    });

                }
            };
            $scope.keys = {};
            buildKeys($rootScope.configuration.schema.schema.properties, "");
            $scope.visAlle = function () {
                $scope.query = "";
                $scope.status = "icon-spinner icon-spin";
                $http({
                    method: 'POST',
                    url: '/es/db-' + $rootScope.configuration.database + '/_search',
                    data: {
                        query: {
                            "match_all": {}
                        },
                        sort: sort,
                        size: 10000
                    }
                }).success(function (data, status, headers, config) {
                    $scope.result = data;
                    $scope.status = "icon-search";
                }).error(function (data, status, headers, config) {
                    $scope.error = data;
                    $scope.results = [];
                });
            };
        }]).controller('home', ['$scope', '$rootScope', '$templateCache', '$http', '$stateParams', '$modal', 'configuration',
        function ($scope, $rootScope, $templateCache, $http, $stateParams, $modal, configuration) {
            $scope.frame = $stateParams.frame === 'true';
            $scope.query = $scope.query || '';

            $rootScope.configuration = configuration;
            $templateCache.put('logo.html', configuration.logo);
            $templateCache.put('main.html', configuration.main);
            $templateCache.put('footer.html', configuration.footer);

            $scope.user = {
                name: '',
                password: ''
            };
            $rootScope.isDisabled = true;
            $scope.showError = false;
            $http.get('/couchdb/_session').success(function (data, status, headers, config) {
                if (data.userCtx && data.userCtx.name) {
                    $rootScope.userName = data.userCtx.name;
                    $rootScope.isDisabled = false;
                }
            }).error(function (data, status, headers, config) {
                $rootScope.userName = null;
                $rootScope.isDisabled = true;
            });
            $scope.logout = function () {
                $http["delete"]('/couchdb/_session').success(function (data, status, headers, config) {
                    $rootScope.userName = null;
                    $rootScope.isDisabled = true;
                }).error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            };

            $rootScope.login = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/login.html',
                    controller: 'login'
                });
            };
        }]).controller('login', ['$scope', '$rootScope', '$http',
        function ($scope, $rootScope, $http) {
            $scope.close = function () {
                $scope.$close();
            };
            $scope.submit = function () {
                $http.post('/couchdb/_session', $scope.user).success(function (data, status, headers, config) {
                    $scope.$close();
                    $scope.showError = false;
                    $rootScope.userName = $scope.user.name;
                    $rootScope.isDisabled = false;
                }).error(function (data, status, headers, config) {
                    $scope.data = data;
                    $scope.status = status;
                    $scope.showError = true;
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            };
        }]).controller('delete', ['$scope', '$state', '$http', '$rootScope',
        function ($scope, $state, $http, $rootScope) {
            $scope.close = function () {
                $scope.$close();
            };
            $scope.submit = function () {
                $http({
                    method: "DELETE",
                    url: '/couchdb/db-' + $rootScope.configuration.database + '/' + $scope.doc._id + '?rev=' + $scope.doc._rev
                }).success(function (data, status) {
                    $scope.$close();
                    $state.go("home.search");
                }).error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    $scope.showError = true;
                });
            };
        }]).controller('new', ['$scope', '$stateParams', '$http', '$location', '$rootScope', '$modal', '$state',
        function ($scope, $stateParams, $http, $location, $rootScope, $modal, $state) {
            $rootScope.new = true;
            $rootScope.showSchemas = true;
            $scope.form = $rootScope.configuration.form;
            $scope.schema = $rootScope.configuration.schema.schema;
            $scope.showMissing = false;
            $scope.valid = {};
            $scope.doc = {};
            $scope.gem = function () {
                $scope.spinner = "icon-spinner icon-spin icon-large";
                $http.post('/couchdb/db-' + $rootScope.configuration.database, $scope.doc).success(function (data, status) {
                    $state.go('home.search');
                }).error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    $scope.showError = true;
                    $scope.spinner = "icon-save icon-large";
                });
            };
        }]).controller('details', ['$scope', '$stateParams', '$http', '$location', '$rootScope', '$modal', '$state',
        function ($scope, $stateParams, $http, $location, $rootScope, $modal, $state) {
            $rootScope.showSchemas = false;
            $scope.form = $rootScope.configuration.form;
            $scope.schema = $rootScope.configuration.schema.schema;
            $scope.showMissing = false;
            $scope.valid = {};
            $scope.datepickers = {}
            $http.get('/couchdb/db-' + $rootScope.configuration.database + '/' + $stateParams.id).success(function (data, status, headers, config) {
                $scope.doc = data;
            }).error(function (data, status, headers, config) {
                $scope.showMissing = true;
            });

            $scope.gem = function () {
                $scope.spinner = "icon-spinner icon-spin icon-large";
                var doc = $scope.doc;
                angular.forEach(doc.properties, function (value, key) {
                    if (doc.properties[key] === "") {
                        delete doc.properties[key];
                    }
                });
                $http.put('/couchdb/db-' + $rootScope.configuration.database + '/' + $scope.doc._id, doc).success(function (data, status) {
                    $state.go('home.search');
                }).error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    $scope.showError = true;
                    $scope.spinner = "icon-save icon-large";
                });
            };
            $rootScope.slet = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'partials/confirm.html',
                    controller: 'delete',
                    scope: $scope
                });



            };
            $scope.ret = function () {
                $http({
                    method: 'GET',
                    url: '/couchdb/_session'
                }).success(function (data, status, headers, config) {
                    if (data.userCtx && data.userCtx.name) {
                        $rootScope.userName = data.userCtx.name;
                        $rootScope.isDisabled = false;
                    } else {
                        $rootScope.userName = null;
                        $rootScope.login();
                    }
                }).error(function (data, status, headers, config) {

                });
            };

            $scope.spinner = "icon-save icon-large";


        }]);

}(this, this.angular, this.console));