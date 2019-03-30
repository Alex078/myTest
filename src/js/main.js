import $ from 'jquery'

$(document).ready(function () {
   $.ajax({
      url: "http://localhost:63342/myTest/questions.json",
      type: "get",

      success: function (data) {
         $('.js-testing').append(createTesting(data));
      }
   })
});

function createTesting(data) {
   let htmlTest = [];

   for (let i=0; i<data.length; i++){
      htmlTest.push(getItemTesting(data[i]));
      console.log(getItemTesting(data[i]));
   }

   return htmlTest.join('');
}

function getItemTesting(item) {
   let testItem = $(`
    <div class="testing__item">
        <div class="testing__question" id="${item.question.id}">${item.question.value}</div>
        <div class="testing__answers"></div>
    </div>
   `);

   $(testItem).find('.testing__answers').append(getAnswersOfItemQuestion(item));
   return testItem.html();
}

function getAnswersOfItemQuestion (item) {
   let answers = [];
   for(let i=0; i<item.answers.length; i++){
      let itemAnswers = `
        <div class="testing__answers-item">
            <input type="radio" id="${item.answers[i].id}" name="answer_${item.question.id}">
            <label for="${item.answers[i].id}">${item.answers[i].value}</label>
        </div>`;
      answers.push(itemAnswers);
   }
   return answers.join('');
}