angular
    .module("DragDropQuiz", ["dndLists"])
    .directive("dragDropQuiz", function ($sce) {
        return {
            link: function ($scope) {
                function shuffle(b) {
                    var a = b;
                    var j, x, i;
                    for (i = a.length - 1; i > 0; i--) {
                        j = Math.floor(Math.random() * (i + 1));
                        x = a[i];
                        a[i] = a[j];
                        a[j] = x;
                    }
                    return a;
                }
                var scope = $scope;
                var placeholderSign = 'placeholderSegment';
                scope.placeholderSegments = scope.placeholder.replace(/{\d}/gi, placeholderSign).split(placeholderSign);

                scope.segmentsCollection = [scope.placeholderSegments, scope.answers];
                scope.shuffleAnswers = shuffle(scope.answers);
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
                    if(typeof segment==='object'){
                        return {
                            typeof:'placeholder',
                            text: segment.text
                        };
                    }
                    if(typeof segment==='string'){
                        return {
                            typeof:'raw',
                            text: segment
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
