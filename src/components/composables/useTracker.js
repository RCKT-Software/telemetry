import {computed, ref} from "vue";
import { v4 as uuidv4 } from 'uuid';

export function useTracker(config = {
    id: null,
    label: 'My Progress Tracker',
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
    const label = ref(config.label);

    /**
     * The current value of the tracker
     */
    const currentValue = ref(99);

    /**
     * The goals that belong to the tracker
     */
    const goals = ref(config.goals);

    /**
     * Returns the next upcoming goal
     * TODO: Once we support multiple goals, this computed should sort by the goal's `targetValue` (ASC OR DESC depending on the goal direction)
     */
    const activeGoal = computed(() => {
        return goals.value.length ? goals.value[0] : null;
    });


    return {id, label, currentValue, goals, activeGoal, serializeState}
}
