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
            var categoryOption = $scope.category.value ? '(categoryId='+$scope.category.value+')' : '';
            return $scope.apiKey ? 'http://api.bestbuy.com/beta/products/'+$scope.endpoint.selected+categoryOption+'?apiKey=' + $scope.apiKey + '&callback=JSON_CALLBACK' : '';
        };

        $scope.invokeRecommendationsQuery = function () {
            $scope.results = "Running";
            var query = $scope.buildRecommendationsQuery();

            var successFn = function (value) {
                $scope.results = value;
                };
            var errorFn = function (httpResponse) {
                $scope.results = httpResponse;
            }
            console.log('endpoint'+$scope.endpoint.selected);

            if (($scope.apiKey !=  "")&($scope.endpoint.selected != "")){
                httpClient(query).jsonp_query(successFn, errorFn);
            }else if ($scope.apiKey ===  ""){
                $scope.results = "Please enter your API Key";
            } else{
                $scope.results = "Please pick an endpoint"
            };
        };

        $scope.isRemixQueryButtonDisabled = function () {
            return ($scope.skuList == recommendationsConfig.skuList);
        };

        $scope.resetRecommendationsQuery = function () {
            $scope.results = {};
            $scope.endpoint = {selected:""};
            $scope.category = $scope.categories[0];
        }

        // $scope.popularImage = "assets/popular.png";
        // $scope.trendImage = "assets/trending.png";

    }
]);