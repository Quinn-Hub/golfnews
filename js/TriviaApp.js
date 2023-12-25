// TriviaApp.js

$(document).ready(function() {
  // Counter variables
  let wins = 0;
  let losses = 0;

  const triviaContainer = $('#trivia-container');
  const resultContainer = $('#result-container');
  const counterContainer = $('#counter-container');

    // Initial setup
    $('.tab-content:first').show(); // Show the first tab content
    $('.active-tab').click(); // Simulate a click to trigger initial content display
    fetchTriviaQuestions('home'); // Initial fetch for home content

  // Handle tab clicks
  $('nav li').click(function() {
      const tabId = $(this).attr('id').replace('-tab', '');
      $('.tab-content').hide(); // Hide all tab contents
      $('.active-tab').removeClass('active-tab'); // Remove active class from all tabs
      $(`#${tabId}-content`).show(); // Show the clicked tab content
      $(this).addClass('active-tab'); // Add active class to the clicked tab

      // Fetch trivia questions only if the tab is related to trivia
      if (tabId === 'tv-trivia' || tabId === 'film-trivia' || tabId === 'board-game' || tabId === 'video-game') {
        fetchTriviaQuestions(tabId);
    }
    else {
      console.error(`Error fetching trivia questions. Status: ${status}, Error: ${error}`);
    }
  });

  function fetchTriviaQuestions(category) {
      const loadingGif = '<img src="img/loading_.gif" alt="Loading..." style="width: 200px; height: 200px;">';
      let apiUrl;

      // Determine the API URL based on the category
      switch (category) {
          case 'television':
              apiUrl = 'https://opentdb.com/api.php?amount=10&category=14';
              break;
          case 'film':
              apiUrl = 'https://opentdb.com/api.php?amount=10&category=11';
              break;
          case 'board-game':
              apiUrl = 'https://opentdb.com/api.php?amount=50&category=16';
              break;
          case 'video-game':
              apiUrl = 'https://opentdb.com/api.php?amount=50&category=15';
              break;
          default:
              // Default to home content if the category is not recognized
              apiUrl = ''; // Add the URL for home content if available
              break;
      }

      // Handle the case when the category is not recognized
      if (!apiUrl) {
          triviaContainer.html('<p>Welcome to the Golf News website!</p>');
          resultContainer.html('');
          updateCounter(); // Update the counter for home content
          return;
      }

      $.ajax({
          url: apiUrl,
          method: 'GET',
          success: function(response) {
              if (response.results.length > 0) {
                  const question = response.results[0];
                  displayQuestion(question);
              } else {
                  triviaContainer.html('<p>No questions available.</p>');
                  updateCounter(); // Update the counter if no questions are available
              }
          },
          error: function() {
              triviaContainer.html(`<p>Please wait until the next trivia question is ready. ${loadingGif}</p>`);
              setTimeout(function() {
                  fetchTriviaQuestions(category); // Fetch the next question
              }, 1000); // 1-second delay
          }
      });
  }

  function displayQuestion(question) {
      const questionElement = $('<div>').addClass('trivia-question')
          .html(`<p class="indented-text">${question.question}</p>`);

      const answers = question.incorrect_answers.concat(question.correct_answer);
      answers.sort(); // Shuffle answers

      answers.forEach(answer => {
          const decodedAnswer = decodeHtmlEntities(answer.trim()); // Decode HTML entities and trim any extra spaces
          const answerElement = $('<button>').addClass('answer').text(decodedAnswer);
          answerElement.click(function() {
              const isCorrect = decodedAnswer === question.correct_answer.trim();
              checkAnswer(isCorrect, question.correct_answer.trim());
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
          wins++;
          resultElement.html(`<p>Correct! The answer is: ${correctAnswer}. &#10003;</p>`);
          $('.answer').css('background-color', 'red'); // Set background color of all answers to red
          $('.answer:contains(\'' + correctAnswer + '\')').css('background-color', '#4CAF50'); // Set background color of correct answer to green
      } else {
          losses++;
          resultElement.html(`<p>Wrong! &#10007; The correct answer is: ${correctAnswer}.</p>`);
          $('.answer').css('background-color', 'red'); // Set background color of all answers to red
          $('.answer:contains(\'' + correctAnswer + '\')').css('background-color', '#4CAF50'); // Set background color of correct answer to green
      }
      resultContainer.html(resultElement);

      updateCounter(); // Update the counter
      setTimeout(function() {
          fetchTriviaQuestions(getActiveTabId()); // Fetch the next question for the active tab
      }, 3000); // 3-second delay
  }

  function updateCounter() {
      const totalAttempts = wins + losses;
      const winPercentage = totalAttempts === 0 ? 0 : Math.round((wins / totalAttempts) * 100);
      const counterText = `Wins: ${wins} | Losses: ${losses} | Win Percentage: ${winPercentage}%`;
      counterContainer.html(counterText);
  }

  function getActiveTabId() {
      return $('.active-tab').attr('id').replace('-tab', '');
  }

  function decodeHtmlEntities(html) {
      const element = document.createElement('div');
      element.innerHTML = html;
      return element.textContent;
  }
});