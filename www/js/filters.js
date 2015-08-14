(function (window, angular, console) {
    'use strict';
    angular.module('metadata.filters', []).filter('valuepath', function () {
        return function (input, value) {
            if (typeof (input) !== 'undefined') {
                var path = value.split('/'),
                    item = input,
                    m,
                    key;
                for (m = 1; m < path.length; m += 1) {
                    key = path[m];
                    if (item.hasOwnProperty(key)) {
                        item = item[key];
                    }
                }
                return item;
            }
            return input;
        };
    }).filter('objectpath', function () {
        return function (input, doc) {
            var path = input.split('.'),
                item = doc,
                key,
                m;
            for (m = 0; m < path.length; m += 1) {
                if (item.properties) {
                    item = item.properties;
                    key = path[m];
                    if (item.hasOwnProperty(key)) {
                        item = item[key];
                    }
                }
            }
            return item.title || key;
        };
    });
}(this, this.angular, this.console));