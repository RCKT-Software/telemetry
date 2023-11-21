<template>
  <div style="width: 850px; position: relative">
    <canvas id="chart-canvas"/>
  </div>
</template>

<script setup>

import {nextTick, onBeforeUnmount, onMounted, watch} from "vue";
import Chart from 'chart.js/auto'
import 'chartjs-adapter-moment';
import {useAppDataStore} from "../stores/appData";

/* Keep a record of the chart for mounting/unmounting */
let chart;

const appDataStore = useAppDataStore();

/**
 * ChartJS draws with the canvas, so we need to manually pass it CSS vars.
 * @param variableName
 * @returns {string}
 */
const getCSSVariable = (variableName) => {
  return getComputedStyle(document.getElementById('top-level')).getPropertyValue(variableName);
}

/**
 * Creates the chart with the latest data.
 */
const createChart = async () => {
  if (chart) {
    chart.destroy();
  }
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = getCSSVariable('--dark');
  Chart.defaults.borderColor = getCSSVariable('--lighter');

  chart = new Chart(
      document.getElementById('chart-canvas'),
      {
        type: 'line',
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day'
              },
              grid: {
                color: getCSSVariable('--lighter')
              }
            },
            y: {
              grid: {
                color: getCSSVariable('--lighter')
              }
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
          labels: appDataStore.activeTracker.chartData.labels,
          datasets: [
            {
              data: appDataStore.activeTracker.chartData.data,
              fill: {
                target: 'start',
                above: appDataStore.activeCollection.transparentColor,
              },
              pointStyle: false,
              borderColor: appDataStore.activeCollection.color,
            },
            {
              data: appDataStore.activeTracker.chartRegressionData,
              fill: false,
              borderColor: getCSSVariable('--darker'),
              lineTension: 0,
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
  await createChart();
});

/**
 * Re-draw the chart when the active collection changes, or any data within it.
 */
watch(
    [() => appDataStore.activeCollection, () => appDataStore.darkMode],
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
