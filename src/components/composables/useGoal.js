import {ref} from "vue";
import { v4 as uuidv4 } from 'uuid';
import Sugar from 'sugar';
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
    const targetValue = ref(123);

    /**
     * The goal's deadline, represented as a Date object
     */
    const deadline = ref(config.deadline || new Date.create('next Friday'))


    return {id, targetValue, deadline, serializeState}
}
