import {ref} from "vue";
import { v4 as uuidv4 } from 'uuid';

export function useGoal(config = {
    id: null,
    targetValue: 0
}){

    /**
     * The state to persist between application restarts
     */
    const serializeState = () => {
        return {
            id: id,
            targetValue: targetValue.value
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


    return {id, targetValue, serializeState}
}
