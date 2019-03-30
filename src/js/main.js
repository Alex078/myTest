import $ from 'jquery'

$(document).ready(function () {
    const TIME_FOR_QUESTION = 60;

    let counterId;
    let counterValue = TIME_FOR_QUESTION;
    let $counterHtmlValue = $('.js-counter-value');

    const $btnOpenTest = $('.js-open-test-btn');
    const $testWrapper = $('.js-testing');

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
            }
        });

        startCounter();
    });

    $('body').on('click', '.js-testing__item-btn', function () {
        nextQuestionByClick();
    });

    function createTesting(data) {
        let htmlTest = [];

        for (let i = 0; i < data.length; i++) {
            htmlTest.push(getItemTesting(data[i]));
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
            <input type="radio" id="${item.answers[i].id}" name="answer_${item.question.id}">
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

    function nextQuestionByClick() {
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
});