import {computed, ref} from "vue";
import {v4 as uuidv4} from 'uuid';
import Sugar from 'sugar';
import {useGoal} from "./useGoal";
import {formatValue} from "../utility/helpers";
import regression from '../utility/regression';
import moment from "moment";

Sugar.extend();

export function useTracker(config = {
    id: null,
    label: '',
    startingValue: 0,
    numberFormat: 'number',
    trackingMode: 'value',
    goals: [],
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
            trackingMode: trackingMode.value,
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
     * A reference to the current time, used to know how long ago we updated the last updated date
     * This updates every 5 minutes, as updating it will cause the chart to re-render
     */
    const currentTime = ref(new Date());
    setInterval(() => {
        currentTime.value = new Date();
    }, 1000 * 60 * 5);

    /**
     * A placeholder for the date the current value was last updated
     */
    const lastUpdated = ref(Date.create('yesterday'));

    /**
     * The relative formatted value for the last updated date
     */
    const formattedLastUpdated = computed(() => {
        // Wrapped in a currentTime call, to ensure it updates every 5 minutes
        if(currentTime.value > 0) {
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
     * The tracking mode of the tracker (either 'value' or 'aggregate')
     */
    const trackingMode = ref(config.trackingMode || 'value');

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
            labels: recentDataPoints.value.map(point => point.createdAt),
            data: recentDataPoints.value.map(point => point.value),
        }
    });

    /**
     * The offset to apply to the time-series data to normalize it to a zero-basis.
     */
    const xOffset = computed(() => {
        if (recentDataPoints.value.length === 0) {
            return 0;
        }
        return moment(recentDataPoints.value[0].createdAt).valueOf();
    });

    /**
     * Get the regression data for the given data points.
     */
    const regressionData = computed(() => {
        const data = recentDataPoints.value.map((point) => [moment(point.createdAt - xOffset.value).valueOf(), point.value]);
        const linear = regression.linear(data);
        const exponential = regression.exponential(data);
        const logarithmic = regression.logarithmic(data);
        const power = regression.power(data);
        const polynomial2 = regression.polynomial(data, {order: 2});
        const polynomial3 = regression.polynomial(data, {order: 3});
        const results = [
            {name: 'Linear', calculation: linear},
            {name: 'Exponential', calculation: exponential},
            {name: 'Logarithmic', calculation: logarithmic},
            {name: 'Power', calculation: power}
        ];
        // Only support polynomials with more than 50 data points
        if (data.length > 50) {
            if (polynomial2.r2 > 0.5) {
                results.push({name: 'Polynomial (2)', calculation: polynomial2});
            }
            if (polynomial3.r2 > 0.5) {
                results.push({name: 'Polynomial (3)', calculation: polynomial3});
            }
        }
        results.sort((a, b) => {
            if (a.calculation.r2 < 0 || isNaN(a.calculation.r2)) return 1;
            if (b.calculation.r2 < 0 || isNaN(b.calculation.r2)) return -1;
            return b.calculation.r2 - a.calculation.r2;
        });
        return results[0];
    });

    /**
     * Take the best regression method and predict the immediate future of this progress tracker.
     */
    const chartRegressionData = computed(() => {
        let points = [];
        if (regressionData.value.calculation.points.length > 1) {
            const timeScale = (regressionData.value.calculation.points[regressionData.value.calculation.points.length - 1][0]);
            const interval = timeScale / 20 * 2;
            for (let i = 0; i <= 20; i++) {
                let futureTime = moment(timeScale).add(interval * i, 'milliseconds').valueOf();
                let predicted = regressionData.value.calculation.predict(futureTime);
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
        serializeState
    }
}
