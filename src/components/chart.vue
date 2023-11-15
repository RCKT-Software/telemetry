<template>
  <div style="width: 850px; position: relative">
    <canvas id="chart-canvas"/>
  </div>
</template>

<script setup>

import {onBeforeUnmount, onMounted, watch} from "vue";
import Chart from 'chart.js/auto'
import {useCollectionsStore} from "../stores/collections";

/* Keep a record of the chart for mounting/unmounting */
let chart;

const collectionsStore = useCollectionsStore();

/**
 * Creates the chart with the latest data.
 */
const createChart = async () => {
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
            /*y: {
              min: 0,
              max: 70,
            }*/
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
          labels: collectionsStore.activeTracker.chartData.labels,
          datasets: [
            {
              data: collectionsStore.activeTracker.chartData.data,
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
  await createChart();
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
