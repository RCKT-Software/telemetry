import {computed, ref} from "vue";
import {v4 as uuidv4} from 'uuid';
import Sugar from 'sugar';
import {useGoal} from "./useGoal";
import {formatValue} from "../utility/helpers";
import regression from '../utility/regression';
import moment from "moment";
import {useInterfaceStore} from "../stores/interface";

Sugar.extend();

export function useTracker(config = {
    id: null,
    label: '',
    startingValue: 0,
    numberFormat: 'number',
    trackingMode: 'value',
    regressionMode: 'Automatic',
    goals: [],
    steppedChart: false,
}) {

    /**
     * The state to persist between application restarts
     */
    const serializeState = () => {
        return {
            id: id,
            label: label.value,
            startingValue: startingValue.value,
            numberFormat: numberFormat.value,
            steppedChart: steppedChart.value,
            trackingMode: trackingMode.value,
            regressionMode: regressionMode.value,
            goals: goals.value.map(goal => goal.serializeState()),
        };
    };

    /**
     * The assigned ID of the tracker
     */
    const id = config.id || uuidv4();

    /**
     * The label (name) of the tracker
     */
    const label = ref(config.label || '');

    /**
     * The current value of the tracker
     */
    const currentValue = ref(null);

    /**
     * The recent data points for the tracker
     */
    const recentDataPoints = ref([]);

    /**
     * A placeholder for the date the current value was last updated
     */
    const lastUpdated = ref(Date.create('yesterday'));

    /**
     * The relative formatted value for the last updated date
     */
    const formattedLastUpdated = computed(() => {
        // Wrapped in a currentTime call, to ensure it updates occasionally
        const { currentTime } = useInterfaceStore();
        if(currentTime > 0) {
            return lastUpdated.value.relative();
        }
    });

    /**
     * The initial value of the tracker
     */
    const startingValue = ref(config.startingValue || 0);

    /**
     * The formatting schema to apply to values when displayed
     */
    const numberFormat = ref(config.numberFormat || 'number');

    /**
     * Does the chart display as a stepped chart? By default, it's smooth instead.
     */
    const steppedChart = ref(config.steppedChart || false);

    /**
     * The tracking mode of the tracker (either 'value' or 'aggregate')
     */
    const trackingMode = ref(config.trackingMode || 'value');

    /**
     * The type of regression to use for the tracker (either 'auto', 'linear', 'exponential', 'logarithmic', 'power', 'polynomial2', 'polynomial3')
     */
    const regressionMode = ref(config.regressionMode || 'Automatic');

    /**
     * The goals that belong to the tracker
     */
    const goalStartingData = [];
    if (Array.isArray(config.goals)) {
        for (let goalData of config.goals) {
            goalStartingData.push(useGoal({
                ...goalData,
                trackerId: id
            }));
        }
    }
    const goals = ref(goalStartingData);

    /**
     * Returns the next upcoming goal
     * TODO: Once we support multiple goals, this computed should sort by the goal's `targetValue` (ASC OR DESC depending on the goal direction)
     */
    const activeGoal = computed(() => {
        return goals.value.length ? goals.value[0] : null;
    });

    /**
     * The formatted version of the current value
     */
    const formattedCurrentValue = computed(() => {
        return formatValue(currentValue.value, numberFormat.value);
    });

    /**
     * Accepts a goal and adds it to the tracker.
     */
    const addGoal = (goal) => {
        const index = goals.value.findIndex(g => g.id === goal.id);
        if (index !== -1) {
            goals.value.splice(index, 1, useGoal(goal));
        } else {
            goals.value.push(useGoal(goal));
        }
    }

    /**
     * Accepts a data point and sends it to the main process to be persisted.
     * @param data
     */
    const captureDataPoint = (data) => {
        window["electronAPI"].captureDataPoint({
            value: parseFloat(data.datapoint),
            trackerId: id
        });
        updateDataPoints();
        currentValue.value = parseFloat(data.datapoint);
        lastUpdated.value = Date.create();
    }

    /**
     * Deletes a data point from the tracker, given a data point ID.
     * @param id
     */
    const deleteDataPoint = async (id) => {
        await window["electronAPI"].deleteDataPoint({
            id
        });
        updateDataPoints();
    }

    /**
     * Fetches the latest data points for the tracker and updates the current value and last updated date.
     */
    const updateDataPoints = () => {
        window["electronAPI"].getDataPoints(id, {}, (dataPoints) => {
            if (dataPoints.length > 0) {
                dataPoints.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                const lastDataPoint = dataPoints[dataPoints.length - 1];
                currentValue.value = lastDataPoint.value;
                lastUpdated.value = lastDataPoint.createdAt;
                recentDataPoints.value = dataPoints;
            }else{
                currentValue.value = null;
                lastUpdated.value = Date.create();
                recentDataPoints.value = [];
            }
        });
    }

    /**
     * Returns the chart data for the tracker.
     */
    const chartData = computed(() => {
        return {
            data: recentDataPoints.value.map((point) => ({
                x: point.createdAt,
                y: point.value
            })),
        }
    });

    /**
     * The offset to apply to the time-series data to normalize it to a zero-basis.
     */
    const xOffset = computed(() => {
        if (recentDataPoints.value.length === 0) {
            return 0;
        }
        return moment(recentDataPoints.value[0].createdAt).valueOf() - 1;
    });

    /**
     * Get the regression data for the given data points.
     * If auto-selecting, we'll try to find the best fit.
     * If manually selecting, we'll use the selected method.
     */
    const regressionData = computed(() => {
        const data = recentDataPoints.value.map((point) => [moment(point.createdAt - xOffset.value).valueOf(), point.value]);
        let results = [];
        if (regressionMode.value === 'Automatic') {
            const linear = regression.linear(data);
            const exponential = regression.exponential(data);
            const logarithmic = regression.logarithmic(data);
            const power = regression.power(data);
            const polynomial = regression.polynomial(data, {order: 2});
            results = [
                {name: 'Linear', calculation: linear},
                {name: 'Exponential', calculation: exponential},
                {name: 'Logarithmic', calculation: logarithmic},
                {name: 'Power', calculation: power}
            ];
            // Only automatically select polynomials with more than 50 data points and > 50% r2 fit
            if (data.length > 50) {
                if (polynomial.r2 > 0.5) {
                    results.push({name: 'Polynomial', calculation: polynomial});
                }
            }
            results.sort((a, b) => {
                if (a.calculation.r2 < 0 || isNaN(a.calculation.r2)) return 1;
                if (b.calculation.r2 < 0 || isNaN(b.calculation.r2)) return -1;
                return b.calculation.r2 - a.calculation.r2;
            });
        } else {
            const specificRegression = regression[regressionMode.value.toLowerCase()](data);
            results.push({name: regressionMode.value, calculation: specificRegression});
        }
        return results[0];
    });

    /**
     * Take the best regression method and predict the immediate future of this progress tracker.
     */
    const chartRegressionData = computed(() => {
        let points = [];
        if (regressionData.value.calculation.points.length > 1) {
            const firstTimestamp = xOffset.value;
            const lastTimestamp = (regressionData.value.calculation.points[regressionData.value.calculation.points.length - 1][0]) + xOffset.value;
            const currentTime = Date.now();
            const timeScale = (currentTime - firstTimestamp) + (currentTime - lastTimestamp);
            const interval = timeScale / 20;
            for (let i = 0; i <= 20; i++) {
                let futureTime = moment(lastTimestamp).add(interval * i, 'milliseconds').valueOf();
                let predicted = regressionData.value.calculation.predict(futureTime - xOffset.value);
                if (predicted) {
                    predicted[0] += xOffset.value;
                    points.push(predicted);
                }
            }
        }
        return points;
    });

    // Update the tracker's data points upon initialization
    updateDataPoints();

    /**
     * Takes an input CSV file path (already validated) and imports it into this tracker.
     * @param filePath
     * @returns {Promise<void>}
     */
    const importCSV = async (filePath) => {
        await window["electronAPI"].importCSVToTracker({
            filePath,
            trackerId: id
        });
        console.log('updating chart');
        updateDataPoints();
    }

    /**
     * Deletes the tracker from the collection
     */
    const deleteGoal = () => {
        goals.value = [];
    }

    return {
        id,
        label,
        currentValue,
        recentDataPoints,
        lastUpdated,
        startingValue,
        numberFormat,
        regressionMode,
        steppedChart,
        goals,
        activeGoal,
        formattedCurrentValue,
        formattedLastUpdated,
        xOffset,
        addGoal,
        captureDataPoint,
        deleteDataPoint,
        updateDataPoints,
        chartData,
        regressionData,
        chartRegressionData,
        deleteGoal,
        serializeState,
        importCSV
    }
}
