// site.js
// Author: Michael Quinn
// Date: 12/25/2023

$(document).ready(function() {
 
  // Initial setup
  $('.tab-content:first').show(); // Show the first tab content
  $('.active-tab').click(); // Simulate a click to trigger initial content display
    // Fetch and display news (replace with actual API call)
  const newsContainer = $('#news-container');

  // Handle tab clicks
  $('nav li').click(function() {
      const tabId = $(this).attr('id').replace('-tab', '');
      $('.tab-content').hide(); // Hide all tab contents
      $('.active-tab').removeClass('active-tab'); // Remove active class from all tabs
      $(`#${tabId}-content`).show(); // Show the clicked tab content
      $(this).addClass('active-tab'); // Add active class to the clicked tab
  });
  
  // Example news data (replace with actual data from API)
const fakeNews = [
  { title: 'Golf Event 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { title: 'PGA Tour Update', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  // Add more news articles here
];

$.each(fakeNews, function(index, article) {
  const articleElement = $('<div>').addClass('news-article')
      .html(`<h2>${article.title}</h2><p>${article.content}</p>`);
  newsContainer.append(articleElement);
});

// Golf animation (replace with your animation code)
const golfAnimationContainer = $('#golf-animation');
golfAnimationContainer.html('<img src="img/leisure_moment_golf.gif" alt="Golf Animation" style="width: 300px; height: 200px;">');
});