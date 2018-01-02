angular
    .module("DragDropQuiz", [])
    .directive("dragDropQuiz", function () {
        return {
            link: function ($scope) {
            },
            templateUrl: "drag-drop-quiz.html",
            scope: {
                question: "=",
                answers: "="
            }
        };
    });
