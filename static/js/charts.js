document.addEventListener('DOMContentLoaded', function() {
  // ============================================================
  // 30 Image Type Bar Charts (shared config, only data differs)
  // ============================================================
  const sharedLabels = [
    'Adept Fuyu-8B', 'Qwen-VL-7B-Chat', 'InstructBLIP-T5-XXL',
    'LLaVA-1.5-13B', 'BLIP-2 FLAN-T5-XXL', 'Yi-VL-34B',
    'LLaVA-1.6-34B', 'InternVL-Chat-V1.2', 'VILA1.5', 'GPT-4V'
  ];

  const sharedColors = {
    backgroundColor: [
      'rgba(196, 123, 160, 0.6)', 'rgba(245, 123, 113, 0.6)',
      'rgba(255, 208, 80, 0.6)', 'rgba(110, 194, 134, 0.6)',
      'rgba(255, 153, 78, 0.6)', 'rgba(42, 149, 235, 0.6)',
      'rgba(183, 156, 220, 0.6)', 'rgba(143, 169, 209, 0.6)',
      'rgba(72, 199, 176, 0.6)', 'rgba(117, 209, 215, 0.6)'
    ],
    borderColor: [
      'rgba(196, 123, 160, 1)', 'rgba(245, 123, 113, 0.4)',
      'rgba(255, 208, 80, 1)', 'rgba(110, 194, 134, 1)',
      'rgba(255, 153, 78, 1)', 'rgba(42, 149, 235, 1)',
      'rgba(183, 156, 220, 1)', 'rgba(143, 169, 209, 1)',
      'rgba(72, 199, 176, 1)', 'rgba(117, 209, 215, 1)'
    ],
    hoverBackgroundColor: [
      'rgba(196, 123, 160, 1)', 'rgba(245, 123, 113, 1)',
      'rgba(255, 208, 80, 1)', 'rgba(110, 194, 134, 1)',
      'rgba(255, 153, 78, 1)', 'rgba(42, 149, 235, 1)',
      'rgba(183, 156, 220, 1)', 'rgba(143, 169, 209, 1)',
      'rgba(72, 199, 176, 1)', 'rgba(117, 209, 215, 1)'
    ]
  };

  const sharedOptions = {
    scales: {
      y: { beginAtZero: true, min: 0, max: 100, ticks: { stepSize: 20 } },
      x: { display: false }
    },
    plugins: {
      legend: { display: false },
      tooltip: {}
    }
  };

  const imageTypeCharts = [
    { id: 'chart_Diagrams',            data: [27.6, 30.1, 31.8, 30.0, 32.0, 38.5, 40.8, 44.6, 42.8, 46.8] },
    { id: 'chart_Tables',              data: [26.6, 29.0, 29.8, 27.8, 27.8, 33.6, 40.2, 37.8, 39.9, 61.8] },
    { id: 'chart_PlotsAndCharts',      data: [24.8, 31.8, 36.2, 30.4, 35.8, 43.6, 44.9, 44.3, 47.6, 55.6] },
    { id: 'chart_ChemicalStructures',  data: [25.0, 27.2, 27.1, 26.7, 25.5, 30.4, 32.5, 35.6, 38.7, 50.6] },
    { id: 'chart_Photographs',         data: [27.6, 40.5, 41.4, 44.4, 42.0, 51.9, 57.3, 58.4, 60.9, 64.2] },
    { id: 'chart_Paintings',           data: [28.7, 57.2, 53.6, 56.3, 52.1, 67.3, 68.9, 73.1, 71.7, 75.9] },
    { id: 'chart_GeometricShapes',     data: [21.1, 25.3, 21.4, 25.6, 28.3, 31, 33.9, 35.7, 37.8, 40.2] },
    { id: 'chart_SheetMusic',          data: [35.2, 33.4, 34.6, 35.8, 34.9, 37.3, 33.1, 39.4, 37.6, 38.8] },
    { id: 'chart_MedicalImages',       data: [25.4, 29.8, 31.6, 36.4, 29.8, 47.8, 50.7, 52.6, 51.8, 59.6] },
    { id: 'chart_PathologicalImages',  data: [26.5, 27.7, 31.2, 35.2, 35.6, 50.2, 57.3, 56.1, 52.6, 63.6] },
    { id: 'chart_MicroscopicImages',   data: [27.0, 37.6, 29.2, 36.3, 32.7, 49.1, 54.9, 50.4, 56.6, 58.0] },
    { id: 'chart_MRIsCTScansXrays',    data: [21.7, 36.9, 33.3, 39.4, 29.8, 44.9, 51.5, 48, 48.5, 50.0] },
    { id: 'chart_SketchesAndDrafts',   data: [37.0, 32.1, 29.9, 38.0, 33.7, 45.7, 45.7, 48.9, 52.7, 55.4] },
    { id: 'chart_Maps',                data: [38.2, 36.5, 45.9, 47.6, 43.5, 52.4, 58.2, 58.2, 62.4, 61.8] },
    { id: 'chart_TechnicalBlueprints', data: [24.7, 25.9, 28.4, 25.3, 27.8, 30.9, 37.7, 40.1, 36.4, 38.9] },
    { id: 'chart_TreesAndGraphs',      data: [30.1, 28.1, 28.8, 28.8, 34.9, 43.2, 33.6, 37, 41.1, 50.0] },
    { id: 'chart_MathematicalNotations', data: [15.8, 27.1, 22.6, 21.8, 21.1, 30.8, 33.8, 36.8, 34.6, 45.9] },
    { id: 'chart_ComicsAndCartoons',   data: [29.0, 51.9, 49.6, 54.2, 51.1, 64.9, 63.4, 71, 74.8, 68.7] },
    { id: 'chart_Sculpture',           data: [30.8, 46.2, 49.6, 51.3, 53.0, 65.8, 69.2, 76.9, 71.8, 76.1] },
    { id: 'chart_Portraits',           data: [20.9, 52.7, 46.2, 54.9, 47.3, 62.6, 62.6, 67, 70.3, 70.3] },
    { id: 'chart_Screenshots',         data: [38.6, 35.7, 38.6, 34.3, 47.1, 52.9, 60, 51.4, 57.1, 65.7] },
    { id: 'chart_Other',               data: [28.3, 38.3, 50.0, 51.7, 58.3, 60, 61.7, 60, 68.3, 68.3] },
    { id: 'chart_Poster',              data: [38.6, 50.9, 52.6, 61.4, 64.9, 66.7, 68.4, 71.9, 75.4, 80.7] },
    { id: 'chart_IconsAndSymbols',     data: [23.8, 66.7, 57.1, 59.5, 59.5, 73.8, 73.8, 76.2, 81, 78.6] },
    { id: 'chart_HistoricalTimelines', data: [30.0, 36.7, 40.0, 43.3, 43.3, 50, 66.7, 63.3, 63.3, 63.3] },
    { id: 'chart_3DRenderings',        data: [33.3, 28.6, 57.1, 38.1, 47.6, 42.9, 42.9, 57.1, 42.9, 47.6] },
    { id: 'chart_DNASequences',        data: [20.0, 45.0, 25.0, 25.0, 45.0, 45, 30, 30, 30, 55.0] },
    { id: 'chart_Landscapes',          data: [43.8, 43.8, 50.0, 31.2, 62.5, 50, 68.8, 62.5, 68.8, 68.8] },
    { id: 'chart_LogosAndBranding',    data: [21.4, 57.1, 64.3, 35.7, 50.0, 57.1, 78.6, 78.6, 71.4, 85.7] },
    { id: 'chart_Advertisements',      data: [30.0, 60.0, 50.0, 60.0, 70.0, 80, 70, 80, 80, 100.0] }
  ];

  imageTypeCharts.forEach(function(chart) {
    const canvas = document.getElementById(chart.id);
    if (!canvas) return;
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: sharedLabels,
        datasets: [{
          data: chart.data,
          backgroundColor: sharedColors.backgroundColor,
          borderColor: sharedColors.borderColor,
          hoverBackgroundColor: sharedColors.hoverBackgroundColor
        }]
      },
      options: sharedOptions
    });
  });

  // ============================================================
  // Single Image vs Multiple Image Chart
  // ============================================================
  const canvasImage = document.getElementById('single_vs_multiple_chart');
  if (canvasImage) {
    canvasImage.style.width = '500px';
    canvasImage.style.height = '120px';
    new Chart(canvasImage.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['InternLM-XComposer2-VL', 'Yi-VL-34B', 'LLaVA-1.6-34B', 'InternVL-Chat-V1.2', 'VILA1.5', 'GPT-4V(ision) (Playground)'],
        datasets: [
          { label: 'Single Image',   data: [38.6, 42, 45.1, 46.9, 47, 56.1],   backgroundColor: 'rgba(42, 149, 235, 0.6)',  borderColor: 'rgba(42, 149, 235, 1)',  borderWidth: 1, hoverBackgroundColor: 'rgba(42, 149, 235, 1)' },
          { label: 'Multiple Image', data: [34.5, 36.6, 40, 38.4, 45.9, 51.7], backgroundColor: 'rgba(255, 153, 78, 0.6)',  borderColor: 'rgba(255, 153, 78, 1)',  borderWidth: 1, hoverBackgroundColor: 'rgba(255, 153, 78, 1)' },
          { label: 'Overall',        data: [38.2, 41.6, 44.7, 46.2, 46.9, 55.7], backgroundColor: 'rgba(110, 194, 134, 0.6)', borderColor: 'rgba(110, 194, 134, 1)', borderWidth: 1, hoverBackgroundColor: 'rgba(110, 194, 134, 1)' }
        ]
      },
      options: {
        scales: {
          y: { beginAtZero: true, min: 0, max: 80, ticks: { stepSize: 20, font: { size: 16 } } },
          x: { ticks: { font: { size: 16 } } }
        },
        plugins: {
          legend: { labels: { font: { size: 16 } } },
          tooltip: { callbacks: { label: function(context) { return context.dataset.label + ': ' + context.parsed.y; } } }
        },
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
      }
    });
  }

  // ============================================================
  // Difficulty Level Chart
  // ============================================================
  const canvasDifficulty = document.getElementById('difficulty_level_chart');
  if (canvasDifficulty) {
    canvasDifficulty.style.width = '500px';
    canvasDifficulty.style.height = '120px';
    const difficultyModels = [
      { label: 'Adept Fuyu-8B',              data: [28.9, 27, 26.4, 27.4],     color: '196, 123, 160' },
      { label: 'Qwen-VL-7B-Chat',            data: [39.4, 31.9, 27.6, 32.9],   color: '245, 123, 113' },
      { label: 'LLaVA-1.5-13B',              data: [41.3, 32.7, 26.7, 33.6],   color: '255, 208, 80' },
      { label: 'InstructBLIP-T5-XXL',        data: [40.3, 32.3, 29.4, 33.8],   color: '110, 194, 134' },
      { label: 'BLIP-2 FLAN-T5-XXL',         data: [41, 32.7, 28.5, 34],       color: '255, 153, 78' },
      { label: 'Yi-VL-34B',                  data: [51.0, 39.9, 34.0, 41.6],   color: '42, 149, 235' },
      { label: 'LLaVA-1.6-34B',              data: [56.1, 43.4, 34.4, 44.7],   color: '183, 156, 220' },
      { label: 'InternVL-Chat-V1.2',         data: [56.2, 44.8, 37.8, 46.2],   color: '143, 169, 209' },
      { label: 'VILA1.5',                    data: [58.1, 45.5, 36.8, 46.9],   color: '172, 199, 176' },
      { label: 'GPT-4V(ision) (Playground)', data: [76.1, 55.6, 31.2, 55.7],   color: '117, 209, 215' }
    ];
    new Chart(canvasDifficulty.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Easy', 'Medium', 'Hard', 'Overall'],
        datasets: difficultyModels.map(function(m) {
          return {
            label: m.label,
            data: m.data,
            backgroundColor: 'rgba(' + m.color + ', 0.6)',
            borderColor: 'rgba(' + m.color + ', 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(' + m.color + ', 1)'
          };
        })
      },
      options: {
        scales: {
          y: { beginAtZero: true, min: 0, max: 100, ticks: { stepSize: 20, font: { size: 16 } } },
          x: { ticks: { font: { size: 16 } } }
        },
        plugins: {
          legend: { labels: { font: { size: 16 } } },
          tooltip: { callbacks: { label: function(context) { return context.dataset.label + ': ' + context.parsed.y; } } }
        },
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
      }
    });
  }
});
