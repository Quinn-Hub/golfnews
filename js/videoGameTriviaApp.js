// videoGameTriviaApp.js
// Author: Michael Quinn
// Date: 12/25/2023

$(document).ready(function() {

  let correctCount = 0;
  let incorrectCount = 0;
 
  // Initial setup
  $('.tab-content:first').show(); // Show the first tab content
  $('.active-tab').click(); // Simulate a click to trigger initial content display

  $('#video-game-tab').click(function() {
    // Your video game script goes here
    console.log('Video Game tab clicked');
    fetchTriviaQuestions('https://opentdb.com/api.php?amount=50&category=155');
});

  // Handle tab clicks
  $('nav li').click(function() {
      const tabId = $(this).attr('id').replace('-tab', '');
      $('.tab-content').hide(); // Hide all tab contents
      $('.active-tab').removeClass('active-tab'); // Remove active class from all tabs
      $(`#${tabId}-content`).show(); // Show the clicked tab content
      $(this).addClass('active-tab'); // Add active class to the clicked tab
      if (tabId === 'video-game') {
        fetchTriviaQuestions('https://opentdb.com/api.php?amount=50&category=15'); // Fetch trivia question based on the selected tab
    }
  });

  const triviaContainer = $('#vg-trivia-container');
  const resultContainer = $('#vg-result-container');
  const counterContainer = $('#counter-container');

  function fetchTriviaQuestions() {
    const loadingGif = '<img src="img/loading_.gif" alt="Loading..." style="width: 200px; height: 200px;">';
      $.ajax({
          url: 'https://opentdb.com/api.php?amount=50&category=15',
          method: 'GET',
          success: function(response) {
              if (response.results.length > 0) {
                  const question = response.results[0];
                  displayQuestion(question);
              } else {
                  triviaContainer.html('<p>No questions available.</p>');
              }
          },
          error: function() {
            triviaContainer.html(`<p>Please wait until the next trivia question is ready. ${loadingGif}</p>`);
              setTimeout(function() {
                fetchTriviaQuestions(); // Fetch the next question
            }, 1000); // 1-second delay
          }
      });
  }

  function decodeHtmlEntities(html) {
    const element = document.createElement('div');
    element.innerHTML = html;
    return element.textContent;
}

  function displayQuestion(question) {
      const questionElement = $('<div>').addClass('trivia-question')
          .html(`<p>${question.question}</p>`);

      const answers = question.incorrect_answers.concat(question.correct_answer);
      answers.sort(); // Shuffle answers

      answers.forEach(answer => {
        const decodedAnswer = decodeHtmlEntities(answer.trim()); // Decode HTML entities
        const answerElement = $('<button>').addClass('answer').text(decodedAnswer);
        answerElement.click(function() {
            checkAnswer($(this).html().trim() === question.correct_answer.trim(), question.correct_answer.trim());
        });

        questionElement.append(answerElement);
    });

      triviaContainer.html(questionElement);
      resultContainer.html('');
  }

  function checkAnswer(isCorrect, correctAnswer) {
    const resultElement = $('<div>').addClass('result');

    // Disable all answer buttons to prevent further clicks
    $('.answer').prop('disabled', true);

    if (isCorrect) {
      correctCount++;
      resultElement.html(`<p class="indented-text">Correct! The answer is: ${correctAnswer}. &#10003;</p>`);
      $('.answer').css('background-color', 'red'); // Set background color of all answers to red
      $('.answer:contains(\'' + correctAnswer + '\')').css('background-color', '#4CAF50'); // Set background color of correct answer to green
  } else {
      incorrectCount++;
      resultElement.html(`<p class="indented-text">Wrong! &#10007; The correct answer is: ${correctAnswer}.</p>`);
      $('.answer').css('background-color', 'red'); // Set background color of all answers to red
      $('.answer:contains(\'' + correctAnswer + '\')').css('background-color', '#4CAF50'); // Set background color of correct answer to green
  }
    resultContainer.html(resultElement);

    // Update the counter display
    updateCounter();

    setTimeout(function() {
        fetchTriviaQuestions(); // Fetch the next question
    }, 3000); // 3-second delay
}
  function updateCounter() {
    const ratio = (correctCount / (correctCount + incorrectCount)) * 100 || 0;
    counterContainer.html(`<p class="indented-text"> Wins: ${correctCount} | Losses: ${incorrectCount} | Ratio: ${ratio.toFixed(2)}%</p>`);
  }
});