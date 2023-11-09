import {computed, ref} from "vue";
import colorLib from '@kurkle/color';
import {v4 as uuidv4} from 'uuid';
import {useTracker} from "./useTracker";

export function useCollection(config = {
    id: null,
    label: 'My Collection',
    color: '#26DCB7',
    trackers: [
        useTracker()
    ],
    activeTrackerId: null,
}) {

    /**
     * The state to persist between application restarts
     */
    const serializeState = () => {
        return {
            id: id,
            label: label.value,
            color: color.value,
            trackers: trackers.value.map(tracker => tracker.serializeState()),
            activeTrackerId: activeTrackerId.value,
        };
    };

    /**
     * The assigned ID of the collection
     */
    const id = config.id || uuidv4();

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

    /**
     * The progress trackers that belong to this collection
     */
    const trackers = ref(config.trackers);

    /**
     * The ID of the active tracker
     * @type {null}
     */
    const activeTrackerId = ref(config.activeTrackerId);

    /**
     * The currently selected tracker (active)
     */
    const activeTracker = computed(() => {
        const tracker = trackers.value.find(tracker => tracker.id === activeTrackerId.value);
        if (!tracker && trackers.value.length > 0) {
            activeTrackerId.value = trackers.value[0].id;
            return trackers.value[0];
        }
        return tracker || null;
    });

    /**
     * Sets the active tracker
     * @param tracker
     */
    const setActiveTracker = (tracker) => {
        activeTrackerId.value = tracker.id;
    };


    return {id, label, abbreviation, color, transparentColor, trackers, activeTracker, setActiveTracker, serializeState};
}
