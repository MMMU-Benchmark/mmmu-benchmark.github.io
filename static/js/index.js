$(document).ready(function() {
  const options = {
    slidesToScroll: 1,
    slidesToShow: 1,
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  }
  // Initialize all div with carousel class
  const carousels = bulmaCarousel.attach('.carousel', options);

})

document.addEventListener('DOMContentLoaded', function() {
  loadTableData();
  setupEventListeners();
  window.addEventListener('resize', adjustNameColumnWidth);

  // Navbar burger toggle for mobile
  var burger = document.querySelector('.navbar-burger');
  if (burger) {
    burger.addEventListener('click', function() {
      var menu = document.querySelector('.navbar-menu');
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-active');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

function loadTableData() {
      fetch('./leaderboard_data.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          const tbody = document.querySelector('#mmmu-table tbody');

          // Prepare data for styling
          const proScores = prepareScoresForStyling(data.leaderboardData, 'pro');
          const valScores = prepareScoresForStyling(data.leaderboardData, 'validation');
          const testScores = prepareScoresForStyling(data.leaderboardData, 'test');

          data.leaderboardData.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.classList.add(row.info.type);
            const nameCell = row.info.link && row.info.link.trim() !== '' ?
              '<a href="' + row.info.link + '" target="_blank"><b>' + row.info.name + '</b></a>' :
              '<b>' + row.info.name + '</b>';
            const safeGet = (obj, path, defaultValue) => {
              if (defaultValue === undefined) defaultValue = '-';
              return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
            };

            const formatOverallValue = (value, source) => {
              return source === 'author' ? '&nbsp;' + (value || '-') + '*' : (value || '-');
            };

            const proOverall = formatOverallValue(applyStyle(safeGet(row, 'pro.overall'), proScores.overall[index]), safeGet(row, 'pro.source'));
            const valOverall = formatOverallValue(applyStyle(safeGet(row, 'validation.overall'), valScores.overall[index]), safeGet(row, 'validation.source'));
            const testOverall = formatOverallValue(applyStyle(safeGet(row, 'test.overall'), testScores.overall[index]), safeGet(row, 'test.source'));

            tr.innerHTML =
              '<td>' + nameCell + '</td>' +
              '<td>' + row.info.size + '</td>' +
              '<td>' + row.info.date + '</td>' +
              '<td class="pro-overall">' + proOverall + '</td>' +
              '<td class="hidden pro-details">' + applyStyle(safeGet(row, 'pro.vision'), proScores.vision[index]) + '</td>' +
              '<td class="hidden pro-details">' + applyStyle(safeGet(row, 'pro.original'), proScores.original[index]) + '</td>' +
              '<td class="val-overall">' + valOverall + '</td>' +
              '<td class="hidden val-details">' + applyStyle(safeGet(row, 'validation.artDesign'), valScores.artDesign[index]) + '</td>' +
              '<td class="hidden val-details">' + applyStyle(safeGet(row, 'validation.business'), valScores.business[index]) + '</td>' +
              '<td class="hidden val-details">' + applyStyle(safeGet(row, 'validation.science'), valScores.science[index]) + '</td>' +
              '<td class="hidden val-details">' + applyStyle(safeGet(row, 'validation.healthMedicine'), valScores.healthMedicine[index]) + '</td>' +
              '<td class="hidden val-details">' + applyStyle(safeGet(row, 'validation.humanSocialSci'), valScores.humanSocialSci[index]) + '</td>' +
              '<td class="hidden val-details">' + applyStyle(safeGet(row, 'validation.techEng'), valScores.techEng[index]) + '</td>' +
              '<td class="test-overall">' + testOverall + '</td>' +
              '<td class="hidden test-details">' + applyStyle(safeGet(row, 'test.artDesign'), testScores.artDesign[index]) + '</td>' +
              '<td class="hidden test-details">' + applyStyle(safeGet(row, 'test.business'), testScores.business[index]) + '</td>' +
              '<td class="hidden test-details">' + applyStyle(safeGet(row, 'test.science'), testScores.science[index]) + '</td>' +
              '<td class="hidden test-details">' + applyStyle(safeGet(row, 'test.healthMedicine'), testScores.healthMedicine[index]) + '</td>' +
              '<td class="hidden test-details">' + applyStyle(safeGet(row, 'test.humanSocialSci'), testScores.humanSocialSci[index]) + '</td>' +
              '<td class="hidden test-details">' + applyStyle(safeGet(row, 'test.techEng'), testScores.techEng[index]) + '</td>';
            tbody.appendChild(tr);
          });

          // Auto-update "Last updated" from the latest model date in the data
          var latestDate = data.leaderboardData
            .filter(row => row.info.type !== 'human_expert' && row.info.date)
            .map(row => new Date(row.info.date))
            .reduce((max, d) => d > max ? d : max, new Date(0));
          if (latestDate > new Date(0)) {
            var mm = String(latestDate.getUTCMonth() + 1).padStart(2, '0');
            var dd = String(latestDate.getUTCDate()).padStart(2, '0');
            var yy = latestDate.getUTCFullYear();
            document.getElementById('last-updated').textContent = 'Last updated: ' + mm + '/' + dd + '/' + yy;
          }

          setTimeout(function() {
            adjustNameColumnWidth();
            fixStickyHeaderOffsets();
          }, 0);
          initializeSorting();
        })
        .catch(error => {
          console.error('Error loading table data:', error);
          document.querySelector('#mmmu-table tbody').innerHTML =
            '<tr><td colspan="21"> Error loading data: ' + error.message +
            '<br> Please ensure you\'re accessing this page through a web server (http://localhost:8000) and not directly from the file system. </td></tr>';
        });
  }

function setupEventListeners() {
  document.querySelector('.reset-cell').addEventListener('click', function() {
    resetTable();
  });

  document.querySelector('.pro-details-cell').addEventListener('click', function() {
    toggleDetails('pro');
  });
  document.querySelector('.val-details-cell').addEventListener('click', function() {
    toggleDetails('val');
  });
  document.querySelector('.test-details-cell').addEventListener('click', function() {
    toggleDetails('test');
  });

  var headers = document.querySelectorAll('#mmmu-table thead tr:last-child th.sortable');
  headers.forEach(function(header) {
    header.addEventListener('click', function() {
      sortTable(this);
    });
  });
}

function toggleDetails(section) {
  var sections = ['pro', 'val', 'test'];
  sections.forEach(function(sec) {
    var detailCells = document.querySelectorAll('.' + sec + '-details');
    var overallCells = document.querySelectorAll('.' + sec + '-overall');
    var headerCell = document.querySelector('.' + sec + '-details-cell');
    if (sec === section) {
      var isExpanding = headerCell.getAttribute('colspan') === '1';
      detailCells.forEach(function(cell) { cell.classList.toggle('hidden'); });
      headerCell.setAttribute('colspan', isExpanding ? (sec === 'pro' ? '3' : '7') : '1');
      headerCell.classList.toggle('expanded', isExpanding);
    } else {
      detailCells.forEach(function(cell) { cell.classList.add('hidden'); });
      overallCells.forEach(function(cell) { cell.classList.remove('hidden'); });
      headerCell.setAttribute('colspan', '1');
      headerCell.classList.remove('expanded');
    }
  });

  setTimeout(function() {
    adjustNameColumnWidth();
    fixStickyHeaderOffsets();
  }, 0);
}

function resetTable() {
  document.querySelectorAll('.pro-details, .val-details, .test-details').forEach(function(cell) {
    cell.classList.add('hidden');
  });

  document.querySelectorAll('.pro-overall, .val-overall, .test-overall').forEach(function(cell) {
    cell.classList.remove('hidden');
  });

  document.querySelectorAll('.expandable').forEach(function(cell) {
    cell.setAttribute('colspan', '1');
    cell.classList.remove('expanded');
  });

  var proOverallHeader = document.querySelector('#mmmu-table thead tr:last-child th.pro-overall');
  sortTable(proOverallHeader, true);

  setTimeout(function() {
    adjustNameColumnWidth();
    fixStickyHeaderOffsets();
  }, 0);
}

function sortTable(header, forceDescending, maintainOrder) {
  forceDescending = forceDescending || false;
  maintainOrder = maintainOrder || false;
  var table = document.getElementById('mmmu-table');
  var tbody = table.querySelector('tbody');
  var rows = Array.from(tbody.querySelectorAll('tr'));
  var headers = Array.from(header.parentNode.children);
  var columnIndex = headers.indexOf(header);
  var sortType = header.dataset.sort;

  var isDescending = forceDescending || (!header.classList.contains('asc') && !header.classList.contains('desc')) || header.classList.contains('asc');

  if (!maintainOrder) {
    rows.sort(function(a, b) {
      var aValue = getCellValue(a, columnIndex);
      var bValue = getCellValue(b, columnIndex);

      if (aValue === '-' && bValue !== '-') return isDescending ? 1 : -1;
      if (bValue === '-' && aValue !== '-') return isDescending ? -1 : 1;

      if (sortType === 'number') {
        return isDescending ? parseFloat(bValue) - parseFloat(aValue) : parseFloat(aValue) - parseFloat(bValue);
      } else if (sortType === 'date') {
        return isDescending ? new Date(bValue) - new Date(aValue) : new Date(aValue) - new Date(bValue);
      } else {
        return isDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      }
    });
  }

  headers.forEach(function(th) {
    th.classList.remove('asc', 'desc');
  });

  header.classList.add(isDescending ? 'desc' : 'asc');

  rows.forEach(function(row) {
    tbody.appendChild(row);
  });

  setTimeout(adjustNameColumnWidth, 0);
}

function getCellValue(row, index) {
  var cells = Array.from(row.children);
  var cell = cells[index];

  if (cell.classList.contains('hidden')) {
    if (cell.classList.contains('pro-details') || cell.classList.contains('pro-overall')) {
      cell = cells.find(c => (c.classList.contains('pro-overall') || c.classList.contains('pro-details')) && !c.classList.contains('hidden'));
    } else if (cell.classList.contains('val-details') || cell.classList.contains('val-overall')) {
      cell = cells.find(c => (c.classList.contains('val-overall') || c.classList.contains('val-details')) && !c.classList.contains('hidden'));
    } else if (cell.classList.contains('test-details') || cell.classList.contains('test-overall')) {
      cell = cells.find(c => (c.classList.contains('test-overall') || c.classList.contains('test-details')) && !c.classList.contains('hidden'));
    }
  }
  return cell ? cell.textContent.trim() : '';
}

function initializeSorting() {
  var proOverallHeader = document.querySelector('#mmmu-table thead tr:last-child th.pro-overall');
  sortTable(proOverallHeader, true);
}

function adjustNameColumnWidth() {
  var nameColumn = document.querySelectorAll('#mmmu-table td:first-child, #mmmu-table th:first-child');
  var maxWidth = 0;

  var span = document.createElement('span');
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.style.whiteSpace = 'nowrap';
  document.body.appendChild(span);

  nameColumn.forEach(function(cell) {
    span.textContent = cell.textContent;
    var width = span.offsetWidth;
    if (width > maxWidth) {
      maxWidth = width;
    }
  });

  document.body.removeChild(span);

  maxWidth += 20;

  nameColumn.forEach(function(cell) {
    cell.style.width = maxWidth + 'px';
    cell.style.minWidth = maxWidth + 'px';
    cell.style.maxWidth = maxWidth + 'px';
  });
}

// Dynamically set second header row sticky offset based on actual first row height
function fixStickyHeaderOffsets() {
  var firstRow = document.querySelector('#mmmu-table thead tr:first-child');
  var secondRowCells = document.querySelectorAll('#mmmu-table thead tr:last-child th');
  if (firstRow && secondRowCells.length > 0) {
    var height = firstRow.getBoundingClientRect().height;
    secondRowCells.forEach(function(th) {
      th.style.top = height + 'px';
    });
  }
}

function prepareScoresForStyling(data, section) {
  var scores = {};
  var fields = [
    'overall', 'vision', 'original', 'artDesign', 'business',
    'science', 'healthMedicine', 'humanSocialSci', 'techEng'
  ];

  fields.forEach(function(field) {
    var values = data.map(row => row[section] && row[section][field])
                     .filter(value => value !== '-' && value !== undefined && value !== null)
                     .map(parseFloat);

    if (values.length > 0) {
      var sortedValues = [...new Set(values)].sort((a, b) => b - a);
      scores[field] = data.map(function(row) {
        var value = row[section] && row[section][field];
        if (value === '-' || value === undefined || value === null) {
          return -1;
        }
        return sortedValues.indexOf(parseFloat(value));
      });
    } else {
      scores[field] = data.map(() => -1);
    }
  });

  return scores;
}

function applyStyle(value, rank) {
  if (value === undefined || value === null || value === '-') return '-';
  if (rank === 0) return '<b>' + value + '</b>';
  if (rank === 1) return '<span style="text-decoration: underline;">' + value + '</span>';
  return value;
}
