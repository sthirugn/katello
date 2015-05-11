/**
 * @ngdoc object
 * @name  Bastion.content-views.controller:PackageFilterListController
 *
 * @requires $scope
 * @requires translate
 * @requires Filter
 * @requires Rule
 * @requires Nutupane
 *
 * @description
 *   Handles loading package groups that have been added to the filter via filter rules
 *   and provides a method to remove them.
 */
angular.module('Bastion.content-views').controller('PackageGroupFilterListController',
    ['$scope', 'translate', 'Filter', 'Rule', 'Nutupane',
    function ($scope, translate, Filter, Rule, Nutupane) {
        var nutupane;

        function success(rule) {
            nutupane.removeRow(rule.uuid, 'id');
            $scope.filter.rules = _.reject($scope.filter.rules, function (filterRule) {
                return rule.id === filterRule.id;
            });
            $scope.successMessages = [translate('Package Group successfully removed.')];
        }

        function failure(response) {
            $scope.errorMessages = [response.data.displayMessage];
        }

        function findRules(packageGroupIds) {
            var rules = [];

            angular.forEach(packageGroupIds, function (id) {
                var found;

                found = _.find($scope.filter.rules, function (rule) {
                    return (rule.uuid === id);
                });

                if (found) {
                    rules.push(new Rule(found));
                }
            });

            return rules;
        }

        nutupane = new Nutupane(
            Filter,
            {filterId: $scope.$stateParams.filterId},
            'packageGroups'
        );

        $scope.detailsTable = nutupane.table;
        nutupane.table.closeItem = function () {};

        $scope.removePackageGroups = function () {
            var packageGroupIds = nutupane.getAllSelectedResults().included.ids,
                rules;

            rules = findRules(packageGroupIds);

            angular.forEach(rules, function (rule) {
                rule.$delete(success, failure);
            });
        };

    }]
);
