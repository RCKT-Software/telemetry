import {ref} from "vue";
import { v4 as uuidv4 } from 'uuid';

export function useTracker(config = {
    id: null,
    label: 'My Progress Tracker'
}){

    /**
     * The state to persist between application restarts
     */
    const serializeState = () => {
        return {
            id: id,
            label: label.value,
            currentValue: currentValue.value
        };
    };

    /**
     * The assigned ID of the collection
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


    return {id, label, currentValue, serializeState}
}
