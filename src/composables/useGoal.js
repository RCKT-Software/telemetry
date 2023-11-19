import {computed, ref} from "vue";
import { v4 as uuidv4 } from 'uuid';
import Sugar from 'sugar';
import {formatValue} from "../utility/helpers";
import {useAppDataStore} from "../stores/appData";
Sugar.extend();

export function useGoal(config = {
    id: null,
    targetValue: 0,
    deadline: new Date()
}){

    /**
     * The state to persist between application restarts
     */
    const serializeState = () => {
        return {
            id: id,
            targetValue: targetValue.value,
            deadline: deadline.value
        };
    };

    /**
     * The assigned ID of the goal
     */
    const id = config.id || uuidv4();

    /**
     * The goal's target value
     */
    const targetValue = ref(config.targetValue || 0);

    /**
     * The goal's deadline, represented as a Date object
     */
    const deadline = ref(config.deadline || new Date.create('next Friday'));

    /**
     * Placeholder for the predicted completion of the goal
     */
    const predicted = ref(new Date.create('next Wednesday'));

    /**
     * The formatted version of the target value
     */
    const formattedTargetValue = computed(() => {
        return formatValue(targetValue.value, useAppDataStore().activeTracker.numberFormat);
    });

    /**
     * The formatted version of the deadline
     */
    const formattedDeadline = computed(() => {
        return new Date(deadline.value).medium();
    });

    /**
     * The formatted version of the deadline (relative)
     */
    const formattedRelativeDeadline = computed(() => {
        return new Date(deadline.value).relative();
    });

    /**
     * The formatted version of the predicted completion of the goal
     */
    const formattedPredicted = computed(() => {
        return new Date(predicted.value).medium();
    })

    return {id, targetValue, deadline, predicted, formattedTargetValue, formattedDeadline, formattedRelativeDeadline, formattedPredicted, serializeState}
}
