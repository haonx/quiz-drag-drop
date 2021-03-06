angular
    .module("DragDropQuiz", ["dndLists"])
    .directive("dragDropQuiz", ["$sce",function ($sce) {
        return {
            link: function ($scope) {
                function shuffle(b) {
                    var a = angular.copy(b);
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
                scope.segments = scope.segments.map(function (segment) {
                    segment.answers = [];
                    return segment;
                });
                scope.selectAnswer = function (answer) {
                    var selectedSegment;
                    if(scope.isSelectedAnswer(answer)){
                        return;
                    }
                    for(var i = 0;i<scope.segments.length;i++){
                        if(scope.segments[i].answers.length === 0 && scope.segments[i].typeof === 'placeholder') {
                            selectedSegment = scope.segments[i];
                            scope.segments[i].answers = [angular.copy(answer)];
                            break;
                        }
                    }

                    selectedSegment.answers = [];
                    selectedSegment.answers = [angular.copy(answer)];
                };
                scope.isSelectedAnswer = function (answer) {
                    for(var i = 0;i<scope.segments.length;i++){
                        if(scope.segments[i].answers.length > 0){
                            if (scope.segments[i].answers[0].id === answer.id) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                var runCheckerQuizzesCorrect = function () {
                    var selectedAnswers = [];
                    for(var i = 0; i <scope.segments.length;i++){
                        var segment = scope.segments[i];
                        var answer = segment.answers[0];
                        if(typeof answer === 'undefined'){
                            continue;
                        }
                        selectedAnswers.push(answer);
                    }
                    var answers_ids = scope.answers.map(function (t) {return t.id; });
                    var selected_answers_ids = selectedAnswers.map(function (t) { return t.id; });
                    if(answers_ids.length !== selected_answers_ids.length){
                        return false;
                    }
                    for(var l = 0; l<answers_ids.length;l++){
                        if(answers_ids[l]!==selected_answers_ids[l]){
                            return false;
                        }
                    }
                    scope.eventCorrect();
                };

                scope.$watch(function () {
                    return JSON.stringify(scope.segments.map(function (segment) {
                        return segment.answers.map(function (answer) {
                            return answer.id;
                        });
                    }));
                }, function () {
                    runCheckerQuizzesCorrect();
                })
            },
            template: '<div class="placeholderDragAndDropQuiz placeholderQuiz"> <div class="placeholders"> <div class="textblock raw"> <span ng-repeat="segment in segments track by $index"> <span ng-if="segment.typeof === \'raw\'" ng-bind-html="segment.html"></span> <span ng-if="segment.typeof === \'placeholder\'" class="placeholder" ng-class="{active:(segment.answers.length > 0)}"> <span class="answer" dnd-list="segment.answers" dnd-drop="segment.answers=[item]"> <span style="visibility: hidden;position: static;">{{segment.text}}</span> <span ng-repeat="answer in segment.answers" dnd-draggable="answer" dnd-moved="segment.answers=[]" ng-click="segment.answers=[]">{{answer.text}}</span> </span> <span class="underline"></span> </span> </span> </div> </div> <div class="answers" dnd-list="[]"> <div class="answer" ng-class="{selected:isSelectedAnswer(answer)}" ng-repeat="answer in shuffleAnswers" dnd-draggable="answer" dnd-effect-allowed="copy" ng-click="selectAnswer(answer)" >{{answer.text}}</div> </div> </div>',
            scope: {
                eventCorrect: "&eventCorrect",
                placeholder: "=",
                answers: "="
            }
        };
    }])
    .filter('typeof', function () {
        return function (value, wordwise, max, tail) {
            return typeof value;
        }
    })
;
