import {computed, ref} from "vue";
import { v4 as uuidv4 } from 'uuid';

export function useTracker(config = {
    id: null,
    label: 'My Progress Tracker',
    startingValue: 0,
    numberFormat: 'number',
    trackingMode: 'value',
    goals: [],
}){

    /**
     * The state to persist between application restarts
     */
    const serializeState = () => {
        return {
            id: id,
            label: label.value,
            currentValue: currentValue.value,
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
    const currentValue = ref(99);

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


    return {id, label, currentValue, startingValue, numberFormat, goals, activeGoal, serializeState}
}
