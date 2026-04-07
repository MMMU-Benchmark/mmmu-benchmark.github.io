document.addEventListener('DOMContentLoaded', function() {
  // Generate carousel slides dynamically to keep HTML concise
  function populateCarousel(containerId, folder, count, skip) {
    const container = document.getElementById(containerId);
    if (!container) return;
    for (let i = 1; i <= count; i++) {
      if (skip.includes(i)) continue;
      const slide = document.createElement('div');
      slide.className = 'box m-5';
      slide.innerHTML =
        '<div class="content has-text-centered">' +
        '<img src="static/images/' + folder + '/' + i + '.png" alt="grade-lv" width="60%"/>' +
        '</div>';
      container.appendChild(slide);
    }
  }

  populateCarousel('error-carousel', 'error', 50, [14]);
  populateCarousel('results-carousel', 'correct', 38, [13]);
});
