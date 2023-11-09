import {ref} from "vue";
import { v4 as uuidv4 } from 'uuid';

export function useTracker(config = {
    id: null,
    label: 'My Collection'
}){

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
    const currentValue = ref(10);


    return {id, label, currentValue}
}
