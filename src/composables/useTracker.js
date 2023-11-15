import {computed, ref} from "vue";
import {v4 as uuidv4} from 'uuid';
import Sugar from 'sugar';
import {useGoal} from "./useGoal";
import {formatValue} from "../utility/helpers";

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
    const goals = ref(config.goals || []);

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
     * Accepts a goal configuration object and adds it to the tracker.
     * @param config
     */
    const addGoal = (config) => {
        goals.value.push(useGoal(config));
    };

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
        serializeState
    }
}
