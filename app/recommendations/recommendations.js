'use strict';

angular.module('bby-query-mixer.recommendations').controller('RecommendationsCtrl', [
    '$scope',
    '$resource',
    'recommendationsConfig',
    'categoryConfig',
    function ($scope, $resource, recommendationsConfig, categoryConfig) {
        $scope.results = {};
        $scope.remixResults = {};
        $scope.skuList = recommendationsConfig.skuList;
        $scope.categories = angular.copy(categoryConfig);
        $scope.category = $scope.categories[0];
        $scope.endpoint = { selected: ""};

        var httpClient = function (query) {
            return $resource(query, {}, {
                jsonp_query: {
                    method: 'JSONP'
                }
            });
        };

        $scope.buildRecommendationsQuery = function () {
            var categoryOption = $scope.category.value ? '(categoryPath.id='+$scope.category.value+')' : '';
            return $scope.apiKey ? 'http://api.bestbuy.com/beta/products/'+$scope.endpoint.selected+categoryOption+'?apiKey=' + $scope.apiKey + '&callback=JSON_CALLBACK' : '';
        };

        $scope.invokeRecommendationsQuery = function () {
            $scope.results = "Running";
            $scope.remixResults = {};
            var query = $scope.buildRecommendationsQuery();

            var successFn = function (value) {
                $scope.results = value;
                $scope.buildSkuList();
            };
            var errorFn = function (httpResponse) {
                $scope.results = httpResponse;
            }
            httpClient(query).jsonp_query(successFn, errorFn);
        };

        $scope.invokeRemixQuery = function () {
            $scope.remixResults = "Running";
            var query = $scope.buildRemixQuery();
            var successFn = function (value) {
                $scope.remixResults = value;
            };
            var errorFn = function (httpResponse) {
                console.log('invokeRemixQuery failure: ' + JSON.stringify(httpResponse));
                $scope.remixResults = [
                    {error: httpResponse}
                ];
            }
            httpClient(query).jsonp_query(successFn, errorFn);
        };

        $scope.isRemixQueryButtonDisabled = function () {
            return ($scope.skuList == recommendationsConfig.skuList);
        };

        $scope.resetRecommendationsQuery = function () {
            $scope.remixResults = {};
            $scope.endpoint = {selected:""};
            $scope.category = $scope.categories[0];
        }

        // $scope.popularImage = "assets/popular.png";
        // $scope.trendImage = "assets/trending.png";

    }
]);