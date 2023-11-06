<template>
  <div style="width: 860px;">
    <canvas id="chart-canvas"/>
  </div>
</template>

<script setup>

import {onBeforeUnmount, onMounted} from "vue";
import Chart from 'chart.js/auto'

/**
 * Placeholder input data.
 */
const data = [
  {year: 2010, count: 10},
  {year: 2011, count: 20},
  {year: 2012, count: 15},
  {year: 2013, count: 25},
  {year: 2014, count: 22},
  {year: 2015, count: 30},
  {year: 2016, count: 27},
];

/* Keep a record of the chart for mounting/unmounting */
let chart;


/**
 * Start drawing the graph on mounted
 */
onMounted(async () => {
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = '#9AB2D4';
  Chart.defaults.borderColor = '#EEF1FD';
  chart = new Chart(
      document.getElementById('chart-canvas'),
      {
        type: 'line',
        options: {
          animation: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true
            }
          },
          layout: {
            padding: {
              left: 2,
            }
          }
        },
        data: {
          labels: data.map(row => row.year),
          datasets: [
            {
              label: 'Acquisitions by year',
              data: data.map(row => row.count),
              fill: {
                target: 'start',
                above: '#F0FFFC',
              },
              borderColor: '#26DCB7',
              tension: 0.1
            }
          ]
        }
      }
  );
});

/**
 * Destroy the chart on unmount
 */
onBeforeUnmount(() => {
  chart.destroy();
});

</script>
