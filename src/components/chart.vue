<template>
  <div style="width: 850px; position: relative">
    <canvas id="chart-canvas"/>
  </div>
</template>

<script setup>

import {computed, onBeforeUnmount, onMounted, watch} from "vue";
import Chart from 'chart.js/auto'
import 'chartjs-adapter-moment';
import {useAppDataStore} from "../stores/appData";
import moment from "moment";

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
 * Determines the unit of time to use for the X axis, based on the data to show.
 */
const getUnitOfTime = computed(() => {
  const firstDataPoint = appDataStore.activeTracker.chartData.labels[0];
  if (!firstDataPoint) {
    return 'day';
  }
  const lastDataPoint = appDataStore.activeTracker.chartData.labels[appDataStore.activeTracker.chartData.labels.length - 1];
  const timeDifference = lastDataPoint - firstDataPoint;
  if (timeDifference < 1000 * 60) {
    return 'second'; // less than a minute
  } else if (timeDifference < 1000 * 60 * 30) {
    return 'minute'; // less than 30 minutes
  } else if (timeDifference < 1000 * 60 * 60 * 12) {
    return 'hour'; // less than 12 hours
  } else if (timeDifference < 1000 * 60 * 60 * 24 * 30) {
    return 'day'; // less than 30 days
  } else if (timeDifference < 1000 * 60 * 60 * 24 * 12) {
    return 'month'; // less than a year
  } else {
    return 'year'; // more than a year
  }
});

/**
 * Set the options for how to display the user's data, allowing for points to be visible if only 1 data point.
 */
const baseDataOptions = () => {
  if (appDataStore.activeTracker.chartData.data.length > 1) {
    return {
      pointStyle: false
    }
  }
  return {
    pointStyle: 'circle',
    pointBackgroundColor: appDataStore.activeCollection.color,
    pointRadius: 6,
  }
};

/**
 * Determines the data to draw to the chart.
 */
const chartDatasets = () => {
  // Base Data
  const datasets = [
    {
      data: appDataStore.activeTracker.chartData.data,
      fill: {
        target: 'start',
        above: appDataStore.activeCollection.transparentColor,
      },
      borderColor: appDataStore.activeCollection.color,
      ...baseDataOptions()
    }
  ];
  // Goals
  if (appDataStore.activeTracker.chartRegressionData.length > 0) {
    for (const goal of appDataStore.activeTracker.goals) {
      if (goal.predicted > appDataStore.activeTracker.chartRegressionData[appDataStore.activeTracker.chartRegressionData.length - 1][0]) {
        continue;
      }
      if (goal.predicted < appDataStore.activeTracker.chartData.labels[0]) {
        continue;
      }
      datasets.push({
        data: [[moment(goal.predicted).valueOf(), goal.targetValue]],
        fill: false,
        pointStyle: 'rectRounded',
        pointBackgroundColor: getCSSVariable('--white'),
        pointBorderColor: getCSSVariable('--black'),
        pointBorderWidth: 2,
        pointRadius: 8,
      });
    }
  }
  // Regression Line
  datasets.push(
      {
        data: appDataStore.activeTracker.chartRegressionData,
        fill: false,
        pointStyle: false,
        borderColor: getCSSVariable('--dark'),
        borderDash: [5, 5],
        lineTension: 0,
      }
  )
  return datasets;
};


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
                unit: getUnitOfTime.value,
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
              enabled: false
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
          datasets: chartDatasets()
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
