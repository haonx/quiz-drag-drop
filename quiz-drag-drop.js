angular
    .module("DragDropQuiz", [])
    .directive("dragDropQuiz", function ($sce) {
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
                scope.segments = scope.segments.map(function (segment) {
                    if(typeof segment === 'undefined'){
                        segment='';
                    }
                    if(typeof segment==='string'){
                        return {
                            typeof:'placeholder',
                            text: segment
                        };
                    }
                    if(typeof segment==='object'){
                        return {
                            typeof:'raw',
                            text: segment.text
                        };
                    }
                    return segment;
                });
                scope.segments = scope.segments.map(function (segment) {
                    var html;
                    html = segment.text;
                    html = html.replace(/\r\n/gi,'<br/>');
                    html = html.replace(/ /gi,'&nbsp;');
                    segment.html = html;
                    segment.html = $sce.trustAsHtml(segment.html);
                    return segment;
                });
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
