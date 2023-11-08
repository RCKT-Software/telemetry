<template>
  <div style="width: 850px; position: relative">
    <canvas id="chart-canvas"/>
  </div>
</template>

<script setup>

import {onBeforeUnmount, onMounted, watch} from "vue";
import Chart from 'chart.js/auto'
import {useCollectionsStore} from "../stores/collections";

/**
 * Placeholder input data.
 */
const data = [
  {year: 2010, count: 17},
  {year: 2011, count: 20},
  {year: 2012, count: 19},
  {year: 2013, count: 25},
  {year: 2014, count: 26},
  {year: 2015, count: 30},
  {year: 2016, count: 27},
  {year: 2017, count: 32},
  {year: 2018, count: 29},
  {year: 2019, count: 35},
  {year: 2020, count: 35},
  {year: 2021, count: 40},
  {year: 2022, count: 42},
  {year: 2023, count: 50},
];

/* Keep a record of the chart for mounting/unmounting */
let chart;

const collectionsStore = useCollectionsStore();

/**
 * Creates the chart with the latest data.
 */
const createChart = () => {
  if (chart) {
    chart.destroy();
  }
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = '#9AB2D4';
  Chart.defaults.borderColor = '#EEF1FD';
  chart = new Chart(
      document.getElementById('chart-canvas'),
      {
        type: 'line',
        options: {
          scales: {
            y: {
              min: 0,
              max: 70,
            }
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
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
              right: 0,
            }
          },
          aspectRatio: 2.07,
        },
        data: {
          labels: data.map(row => row.year),
          datasets: [
            {
              data: data.map(row => row.count),
              fill: {
                target: 'start',
                above: collectionsStore.activeCollection.transparentColor,
              },
              pointStyle: false,
              borderColor: collectionsStore.activeCollection.color,
            }
          ]
        }
      }
  );
}

/**
 * Start drawing the graph on mounted
 */
onMounted(async () => {
  createChart();
});

/**
 * Re-draw the chart when the active collection changes, or any data within it.
 */
watch(
    () => collectionsStore.activeCollection,
    () => {
      createChart();
    },
    {
      deep: true
    }
);

/**
 * Destroy the chart on unmount
 */
onBeforeUnmount(() => {
  chart.destroy();
});

</script>
