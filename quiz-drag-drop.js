angular
    .module("DragDropQuiz", [])
    .directive("dragDropQuiz", function () {
        return {
            link: function ($scope) {
                var scope = $scope;
                var placeholderSign = 'placeholderSegment';
                scope.placeholderSegments = scope.placeholder.replace(/{\d}/gi, placeholderSign).split(placeholderSign);

                scope.segmentsCollection = [scope.placeholderSegments, scope.answers];
                scope.lengths = [];
                for(var i = 0; i<scope.segmentsCollection.length;i++) {
                    scope.lengths.push(scope.segmentsCollection[i].length);
                }

                scope.segments = [];
                var maxLength = Math.max.apply(null,scope.lengths);
                for(var k = 0; k<maxLength; k++){
                    for(var j = 0; j<scope.segmentsCollection.length;j++) {
                        if (scope.segmentsCollection[j]) {
                            scope.segments.push(scope.segmentsCollection[j][k]);
                        }
                    }
                }
            },
            templateUrl: "drag-drop-quiz.html",
            scope: {
                placeholder: "=",
                answers: "="
            }
        };
    })
    .filter('typeof', function () {
        return function (value, wordwise, max, tail) {
            return typeof value;
        }
    })
;
