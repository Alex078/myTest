import $ from 'jquery'

$(document).ready(function () {
    const TIME_FOR_QUESTION = 10;

    let testAnswersObject = {};

    let counterId;
    let counterValue = TIME_FOR_QUESTION;
    let $counterHtmlValue = $('.js-counter-value');

    const $btnOpenTest = $('.js-open-test-btn');
    const $testWrapper = $('.js-testing');
    const $indicatorAnswersWrapper = $('.js-indicator-answers');

    $btnOpenTest.click(function () {
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://alex078.github.io/myTest/questions.json",
            type: "get",
            contentType: false,
            withCredentials: false,
            processData: false,
            cache: false,
            crossDomain: true,

            success: function (data) {
                $btnOpenTest.remove();
                $testWrapper.append(createTesting(data));
                $testWrapper.find('.testing__item').eq(0).addClass('active');
                startCounter();
            }
        });
    });

    $('body').on('click', '.js-testing__item-btn', function () {
        nextQuestionByClick($(this).parent());
    });

    function createTesting(data) {
        let htmlTest = [];

        for (let i = 0; i < data.length; i++) {
            htmlTest.push(getItemTesting(data[i]));
            testAnswersObject[`${data[i].question.id}`] = data[i].trueAnswerId;
            $indicatorAnswersWrapper.append(`<div class="indicator-answers__item" data-question="${data[i].question.id}">${i}</div>`)
        }

        return htmlTest.join('');
    }

    function getItemTesting(item) {
        let testItem = $(`
            <div class="testing__item">
                <div class="testing__question" id="${item.question.id}">${item.question.value}</div>
                <div class="testing__answers"></div>
                <button class="testing__item-btn js-testing__item-btn">Відповісти</button>
            </div>
        `);

        $(testItem).find('.testing__answers').append(getAnswersOfItemQuestion(item));
        return testItem[0].outerHTML;
    }

    function getAnswersOfItemQuestion(item) {
        let answers = [];
        for (let i = 0; i < item.answers.length; i++) {
            let itemAnswers = `
                <div class="testing__answers-item">
                    <input type="radio" id="${item.answers[i].id}" name="answer_${item.question.id}" class="js-radio-answer">
                    <label for="${item.answers[i].id}">${item.answers[i].value}</label>
                </div>`;
            answers.push(itemAnswers);
        }
        return answers.join('');
    }

    function changeActiveQuestion() {
        let isNextQuestion = false;
        let $currentQuestion = $testWrapper.find('.testing__item.active');
        let $nextQuestion = $currentQuestion.next('.testing__item');

        updateIndicatorsOfAnswers($currentQuestion);

        if ($nextQuestion.length > 0) {
            $currentQuestion.removeClass('active');
            $nextQuestion.addClass('active');
            isNextQuestion = true;
            resetCounter();

        } else {
            $currentQuestion.removeClass('active');
            if (counterId) {
                clearInterval(counterId);
            }
        }

        return isNextQuestion;
    }

    function nextQuestionByClick(currentQuestion) {
        updateIndicatorsOfAnswers(currentQuestion);

        let isNextQuestion = changeActiveQuestion();
        if (isNextQuestion) {
            resetCounter();
        }
    }

    function resetCounter() {
        clearInterval(counterId);
        startCounter();
    }

    function startCounter() {
        counterValue = TIME_FOR_QUESTION;
        $counterHtmlValue.html(counterValue);

        counterId = setInterval(function () {
            if (counterValue == 0) {
                changeActiveQuestion();
            } else {
                $counterHtmlValue.html(--counterValue);
            }
        }, 1000);
    }

    function updateIndicatorsOfAnswers(currentQuestion) {
        let idAnswer;
        let idQuestion = currentQuestion.find('.testing__question').attr('id');

        let arrayInputs = currentQuestion.find('.js-radio-answer');

        for (let i = 0; i < arrayInputs.length; i++) {
            if (arrayInputs.eq(i).prop('checked')) {
                idAnswer = arrayInputs.eq(i).attr('id');
            }
        }

        if (idAnswer && testAnswersObject[idQuestion] == idAnswer) {
            $indicatorAnswersWrapper.find(`.indicator-answers__item[data-question=${idQuestion}]`).addClass('true');
        } else if (idAnswer && testAnswersObject[idQuestion] != idAnswer) {
            $indicatorAnswersWrapper.find(`.indicator-answers__item[data-question=${idQuestion}]`).addClass('false');

        } else {
            $indicatorAnswersWrapper.find(`.indicator-answers__item[data-question=${idQuestion}]`).addClass('late');
        }
    }
});