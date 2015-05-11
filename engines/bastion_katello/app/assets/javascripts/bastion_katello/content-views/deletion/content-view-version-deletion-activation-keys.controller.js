/**
 * @ngdoc object
 * @name  Bastion.content-views.controller:ContentViewVersionDeletionActivationKeys
 *
 * @requires $scope
 * @requires $location
 * @requires Organization
 * @requires CurrentOrganization
 * @requires Nutupane
 * @requires ActivationKey
 *
 * @description
 *   Provides the functionality for selecting an environment and content view to move activation
 *   keys to.
 */
angular.module('Bastion.content-views').controller('ContentViewVersionDeletionActivationKeysController',
    ['$scope', '$location', 'Organization', 'CurrentOrganization', 'Nutupane', 'ActivationKey',
    function ($scope, $location, Organization, CurrentOrganization, Nutupane, ActivationKey) {
        var params, nutupane;

        $scope.validateEnvironmentSelection();
        params = {
            'organization_id': CurrentOrganization,
            'content_view_id': $scope.contentView.id,
            'sort_by': 'name',
            'sort_order': 'ASC'
        };
        nutupane = new Nutupane(ActivationKey, params);

        nutupane.searchTransform = function (term) {
            var addition = "(environment_id:(" + $scope.selectedEnvironmentIds().join(" OR ") + "))";
            if (term === "" || angular.isUndefined(term)) {
                return addition;
            }

            return term + " AND " + addition;
        };

        $scope.detailsTable = nutupane.table;
        $scope.detailsTable.closeItem = function () {};

        $scope.environments = Organization.readableEnvironments({id: CurrentOrganization});
        $scope.initEnvironmentWatch($scope);

        if ($scope.deleteOptions.activationKeys.contentView) {
            $scope.selectedContentViewId = $scope.deleteOptions.activationKeys.contentView.id;
        }
        $scope.selectedEnvironment = $scope.deleteOptions.activationKeys.environment;

        $scope.processSelection = function () {
            $scope.deleteOptions.activationKeys.environment = $scope.selectedEnvironment;
            $scope.deleteOptions.activationKeys.contentView = _.findWhere($scope.contentViewsForEnvironment,
                {id: $scope.selectedContentViewId});
            $scope.selectedEnvironment = undefined;
            $scope.selectedContentViewId = undefined;
            $scope.transitionToNext();
        };

        $scope.activationKeyLink = function () {
            var search = $scope.searchString($scope.contentView, $scope.deleteOptions.environments);
            return $scope.$state.href('activation-keys.index') + '?search=' + search;
        };

        $scope.toggleKeys = function () {
            $scope.showKeys = !$scope.showKeys;
        };
    }]
);
