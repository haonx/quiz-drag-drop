angular
    .module("DragDropQuiz", [])
    .directive("dragDropQuiz", function () {
        return {
            link: function ($scope) {
                var scope = $scope;
            },
            templateUrl: "drag-drop-quiz.html",
            scope: {
                placeholder: "=",
                answers: "="
            }
        };
    });
