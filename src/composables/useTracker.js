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
    label: 'My Progress Tracker',
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
    const label = ref(config.label || 'My Tracker');

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
        return lastUpdated.value.relative()
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
    const goals = ref(Array.isArray(config.goals) ? config.goals.map(goalData => {
        return useGoal({
            ...goalData,
            trackerId: id
        });
    }) : []);

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
            goals.value[index] = goal;
        } else {
            goals.value.push(goal);
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
     * Fetches the latest data points for the tracker and updates the current value and last updated date.
     */
    const updateDataPoints = () => {
        window["electronAPI"].getDataPoints(id, {}, (dataPoints) => {
            if (dataPoints.length > 0) {
                const lastDataPoint = dataPoints[dataPoints.length - 1];
                currentValue.value = lastDataPoint.value;
                lastUpdated.value = lastDataPoint.createdAt;
                recentDataPoints.value = dataPoints;
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
     * Get the regression data for the given data points.
     */
    const regressionData = computed(() => {
        const data = recentDataPoints.value.map((point) => [moment(point.createdAt).valueOf(), point.value]);
        const linear = regression.linear(data);
        const exponential = regression.exponential(data);
        const logarithmic = regression.logarithmic(data);
        const power = regression.power(data);
        const polynomial2 = regression.polynomial(data, { order: 2 });
        const polynomial3 = regression.polynomial(data, { order: 3 });
        const results = [
            { name: 'linear', calculation: linear },
            { name: 'exponential', calculation: exponential },
            { name: 'logarithmic', calculation: logarithmic },
            { name: 'power', calculation: power },
            { name: 'polynomial (2)', calculation: polynomial2 },
            { name: 'polynomial (3)', calculation: polynomial3 }
        ];
        results.sort((a, b) => b.calculation.r2 - a.calculation.r2);
        return results[0];
    });

    const chartRegressionData = computed(() => {
        //let points = regressionData.value.calculation.points;
        let points = [regressionData.value.calculation.points[regressionData.value.calculation.points.length - 1]];
        if (activeGoal.value) {
            for (let i = 1; i <= 7; i++) {
                let predicted = regressionData.value.calculation.predict(new Date.create(`${i} days from now`).valueOf());
                if (predicted) {
                    points.push(predicted);
                }
            }
        }
        // TODO: Have each goal draw it's own point directly to the chart.
        /*if(regressionData.value.calculation.predictX(parseFloat(activeGoal.value.targetValue))){
            points.push([regressionData.value.calculation.predictX(parseFloat(activeGoal.value.targetValue))[0], parseFloat(activeGoal.value.targetValue)]);
        }*/
        return points;
    });

    // Update the tracker's data points upon initialization
    updateDataPoints();

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
        addGoal,
        captureDataPoint,
        updateDataPoints,
        chartData,
        regressionData,
        chartRegressionData,
        serializeState
    }
}
