<template>
    <canvas id="graph-canvas" width="2400" height="800"/>
</template>

<script setup>

import {computed, onMounted, ref} from 'vue';
import {useFetch} from "@vueuse/core";

const width = 2400;
const height = 800;

const configuration = ref({
    gridLinePadding: 4,
    innerGridLines: 6
});

/**
 * Placeholder input data.
 */
let inputData = ref([]);

/**
 * Calculates the minimum and maximum values in the dataset.
 * @returns {{valueMin: number, valueMax: number}}
 */
const dataAnalysis = computed(() => {
    const data = inputData.value;
    let valueMin = data[0].value;
    let valueMax = data[0].value;
    for (let i = 1; i < data.length; i++) {
        if (data[i].value < valueMin) {
            valueMin = data[i].value;
        }
        if (data[i].value > valueMax) {
            valueMax = data[i].value;
        }
    }
    const valueRange = valueMax - valueMin;
    const dateMin = new Date(data[0].time);
    const dateMax = new Date(data[data.length - 1].time);
    return {valueMin, valueMax, valueRange, dateMin, dateMax};
});

/**
 * Generates final axis data for both vertical and horizontal axis.
 */
const axisData = computed(() => {

    // Vertical axis
    //const {valueMin, valueRange} = dataAnalysis.value;
    //const verticalAxisMin = valueMin - (valueRange * configuration.value.gridLinePadding);
    //const verticalAxisMax = valueMin + (valueRange * configuration.value.gridLinePadding);
    //const verticalAxisRange = verticalAxisMax - verticalAxisMin;
    //const gridLineSpace = canvas.height / configuration.value.innerGridLines;

    const numGridLines = configuration.value.innerGridLines + (configuration.value.gridLinePadding * 2);
    const pixelsPerVerticalGridline = height / numGridLines;

    // Horizontal axis

    // All done
    return {
        numGridLines,
        pixelsPerVerticalGridline
    }
});

const getPointCoords = computed(() => {
    const outputCoords = [];
    const {valueMin, valueRange} = dataAnalysis.value;
    const {pixelsPerVerticalGridline} = axisData.value;
    const pixelsPerValue = pixelsPerVerticalGridline * configuration.value.innerGridLines / valueRange;
    for (let i = 0; i < inputData.value.length; i++) {
        outputCoords.push({
            x: i * ((width / 2) / inputData.value.length),
            y: (height - (pixelsPerVerticalGridline * configuration.value.gridLinePadding)) - (inputData.value[i].value - valueMin) * pixelsPerValue
        });
    }
    return outputCoords;
});

/**
 * Draws a graph on the canvas
 */
function drawGraph() {

    // Canvas and context
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');

    // Get data
    const data = inputData.value;
    const {valueMin, valueRange} = dataAnalysis.value;
    const {numGridLines, pixelsPerVerticalGridline} = axisData.value;

    // Draw the vertical grid lines
    ctx.strokeStyle = '#EEF1FD';
    ctx.lineWidth = 2;
    for (let i = 0; i <= numGridLines; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * pixelsPerVerticalGridline);
        ctx.lineTo(width - 120, i * pixelsPerVerticalGridline);
        ctx.stroke();
    }

    // Draw the vertical axis labels
    ctx.font = '22px Inter';
    ctx.fillStyle = '#9AB2D4';
    ctx.textAlign = 'right';
    for (let i = 0; i <= numGridLines; i++) {
        const label = Math.round(valueMin + i * (valueRange / numGridLines));
        ctx.fillText(label.toString(), width - 50, height - i * pixelsPerVerticalGridline + 5);
    }

    // Draw data line
    ctx.beginPath();
    ctx.strokeStyle = '#7436BC';
    ctx.lineWidth = 10;
    ctx.moveTo(getPointCoords.value[0].x, getPointCoords.value[0].y);
    for (const dataPoint of getPointCoords.value) {
        ctx.lineTo(dataPoint.x, dataPoint.y);
    }
    ctx.stroke();

    // Draw area fill
    ctx.lineTo(getPointCoords.value[getPointCoords.value.length - 1].x, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, getPointCoords.value[getPointCoords.value.length - 1].x, 0);
    gradient.addColorStop(0, '#FFECE8');
    gradient.addColorStop(0.33, '#FEE8F2');
    gradient.addColorStop(0.66, '#F2E6F7');
    gradient.addColorStop(1, '#CEE0FF');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw circle at last point
    ctx.beginPath();
    ctx.arc(getPointCoords.value[getPointCoords.value.length - 1].x, getPointCoords.value[getPointCoords.value.length - 1].y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#7436BC';
    ctx.lineWidth = 5;
    ctx.stroke();

    // White gradient
    ctx.beginPath();
    ctx.moveTo(0, height - (pixelsPerVerticalGridline * (configuration.value.gridLinePadding)));
    ctx.lineTo(getPointCoords.value[getPointCoords.value.length - 1].x, height - (pixelsPerVerticalGridline * (configuration.value.gridLinePadding)));
    ctx.lineTo(getPointCoords.value[getPointCoords.value.length - 1].x, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const whiteGradient = ctx.createLinearGradient(0, height - (pixelsPerVerticalGridline * (configuration.value.gridLinePadding)), 0, height);
    whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
    ctx.fillStyle = whiteGradient;
    ctx.fill();

    // Draw horizontal axis labels
    const numLabels = 6; // Number of labels to display
    const dataLength = data.length;
    const labelInterval = Math.floor(dataLength / (numLabels - 1));
    ctx.textAlign = 'left';
    ctx.fillStyle = '#9AB2D4';
    for (let i = 0; i < dataLength; i++) {
        if (i % labelInterval === 0 || i === dataLength - 1) {
            const xPos = (width * 0.5) * (i / (dataLength - 1));
            ctx.fillText(new Date(data[i].time).toLocaleDateString(), xPos, height - 20);
        }
    }
}

/**
 * Start drawing the graph on mounted
 */
onMounted(async () => {
    //drawGraph();
});

</script>

<style scoped lang="scss">

#graph-canvas {
  margin-top: 30px;
  width: calc(100% + 60px);
  aspect-ratio: 3/1;
  margin-left: -30px;
  image-rendering: crisp-edges;
}

</style>
