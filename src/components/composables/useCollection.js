import {computed, ref} from "vue";
import colorLib from '@kurkle/color';
import { v4 as uuidv4 } from 'uuid';

export function useCollection(config = {
    label: 'My Collection',
    color: '#26DCB7'
}){

    /**
     * The assigned ID of the collection
     */
    const id = uuidv4();

    /**
     * The label (name) of the collection
     */
    const label = ref(config.label);

    /**
     * The abbreviation of the collection's label
     */
    const abbreviation = computed(() => {
        const words = label.value.match(/\b(\w)/g);
        if (words && words.length >= 2) {
            return `${words[0]}${words[1]}`.toUpperCase();
        } else if (words && words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        } else {
            return '--';
        }
    });

    /**
     * The primary color of the collection
     */
    const color = ref(config.color);

    /**
     * The transparent version of the collection's primary color
     */
    const transparentColor = computed(() => colorLib(color.value).alpha(0.4).rgbString());


    return {id, label, abbreviation, color, transparentColor}
}
