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
import annotationPlugin from 'chartjs-plugin-annotation';
import flagIcon from '../assets/flag.svg';
import flagIconDark from '../assets/flag-dark.svg';

Chart.register(annotationPlugin);

/* Get our goal (flag) icon ready */
const flagPointStyle = new Image(20, 20);

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
  const firstDataPoint = appDataStore.activeTracker.recentDataPoints[0].createdAt;
  if (!firstDataPoint || appDataStore.activeTracker.recentDataPoints.length === 1) {
    return 'day';
  }
  const lastDataPoint = appDataStore.activeTracker.recentDataPoints[appDataStore.activeTracker.recentDataPoints.length - 1].createdAt;
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
 * A vertical line representing today's date/time on the chart.
 */
const annotation = () => {
  return {
    type: 'box',
    backgroundColor: getCSSVariable('--lighter'),
    borderWidth: 0,
    xMin: new Date(),
    adjustScaleRange: false,
    z: -1,
    drawTime: 'beforeDatasetsDraw',
  }
};

/**
 * Set the options for how to display the user's data, allowing for points to be visible if only 1 data point.
 */
const baseDataOptions = () => {
  return {
    pointStyle: false
  }
};

/**
 * Determines the data to draw to the chart.
 */
const chartDatasets = () => {
  const datasets = [];
  // Goals (appears on top of everything else)
  if (appDataStore.activeTracker.chartRegressionData.length > 0) {
    for (const goal of appDataStore.activeTracker.goals) {
      if (goal.predicted > appDataStore.activeTracker.chartRegressionData[appDataStore.activeTracker.chartRegressionData.length - 1][0]) {
        continue;
      }
      if (goal.predicted < appDataStore.activeTracker.recentDataPoints[0].createdAt) {
        continue;
      }
      datasets.push({
        data: [[goal.completedDate ? moment(goal.completedDate).valueOf() : moment(goal.predicted).valueOf(), goal.targetValue]],
        fill: false,
        pointStyle: [flagPointStyle],
        pointBorderColor: getCSSVariable('--black'),
        pointBorderWidth: 2,
        pointRadius: 10,
      });
    }
  }
  // User Data
  datasets.push({
    data: appDataStore.activeTracker.chartData.data.length === 1 ? [
      {
        x: moment(appDataStore.activeTracker.chartData.data[0].x).subtract(7, 'days').toDate(),
        y: appDataStore.activeTracker.chartData.data[0].y,
      },
      appDataStore.activeTracker.chartData.data[0]
    ] : appDataStore.activeTracker.chartData.data,
    fill: {
      target: 'start',
      above: appDataStore.activeCollection.transparentColor,
    },
    stepped: appDataStore.activeTracker.steppedChart,
    borderColor: appDataStore.activeCollection.color,
    ...baseDataOptions()
  });
  // Regression Line
  datasets.push(
      {
        data: appDataStore.activeTracker.chartRegressionData,
        fill: false,
        pointStyle: false,
        borderWidth: 2,
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
  if (appDataStore.darkMode) {
    flagPointStyle.src = flagIconDark;
  } else {
    flagPointStyle.src = flagIcon;
  }
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
                stepSize: 1,
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
            },
            annotation: {
              annotations: {
                annotation
              }
            }
          },
          layout: {
            padding: {
              left: 2,
              right: 0,
            }
          },
          aspectRatio: 2,
        },
        data: {
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
