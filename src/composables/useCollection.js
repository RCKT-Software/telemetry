import {computed, ref} from "vue";
import colorLib from '@kurkle/color';
import {v4 as uuidv4} from 'uuid';
import {useTracker} from "./useTracker";

const colorChoices = [
    '#26DCB7', // Existing color
    '#FFB3BA', // Light Pink
    '#FFDFBA', // Light Peach
    '#FFFFBA', // Light Yellow
    '#BAFFC9', // Light Mint
    '#BAE1FF', // Light Sky Blue
    '#BABDFF', // Light Periwinkle
    '#DABAFF', // Light Lavender
    '#FFBAFF', // Light Pink
    '#FFBAD2', // Light Rose
    '#B6FFB4', // Light Green
    '#BFFCC6'  // Light Greenish Blue
];

export function useCollection(config = {
    id: null,
    label: 'My Collection',
    color: colorChoices[Math.floor(Math.random() * colorChoices.length)],
    trackers: [useTracker()],
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
    const label = ref(config.label || 'My Collection');

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
    const color = ref(config.color || colorChoices[Math.floor(Math.random() * colorChoices.length)]);

    /**
     * The transparent version of the collection's primary color
     */
    const transparentColor = computed(() => colorLib(color.value).alpha(0.4).rgbString());

    /**
     * The progress trackers that belong to this collection
     */
    const trackers = ref(Array.isArray(config.trackers) ? config.trackers.map(trackerData => {
        return useTracker(trackerData);
    }) : []);

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
     * The total number of goals across all trackers in the collection
     */
    const goalCount = computed(() => {
        return trackers.value.reduce((accumulator, tracker) => {
            return accumulator + tracker.goals.length;
        }, 0);
    });

    /**
     * Sets the active tracker
     * @param tracker
     */
    const setActiveTracker = (tracker) => {
        activeTrackerId.value = tracker.id;
    };

    /**
     * Accepts a tracker configuration object and adds it to the collection, setting it as the active tracker.
     */

    const addTracker = (tracker) => {
        const index = trackers.value.findIndex(t => t.id === tracker.id);
        if (index !== -1) {
            trackers.value[index] = tracker;
        } else {
            trackers.value.push(tracker);
        }
        setActiveTracker(tracker);
    }

    /**
     * Deletes the tracker from the collection
     * @param tracker
     */
    const deleteTracker = (tracker) => {
        const index = trackers.value.indexOf(tracker);
        if (index > -1) {
            trackers.value.splice(index, 1);
        }
    }

    return {id, label, abbreviation, color, transparentColor, trackers, activeTracker, goalCount, deleteTracker, setActiveTracker, addTracker, serializeState};
}
