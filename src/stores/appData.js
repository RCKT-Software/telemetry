import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useCollection} from "../composables/useCollection";

export const useAppDataStore = defineStore('appData', () => {

    /**
     * List of all collections
     */
    const collections = ref([]);

    /**
     * The currently selected collection (active)'s index
     */
    const activeId = ref(null);

    /**
     * The currently selected collection (active)
     */
    const activeCollection = computed(() => {
        const collection = collections.value.find(collection => collection.id === activeId.value);
        if (!collection && collections.value.length > 0) {
            activeId.value = collections.value[0].id;
            return collections.value[0];
        }
        return collection || null;
    });

    /**
     * The currently selected tracker (active)
     */
    const activeTracker = computed(() => {
        return activeCollection.value ? activeCollection.value.activeTracker : false;
    });

    /**
     * Get a tracker by its ID
     * @param id
     * @returns {*|null}
     */
    const getTrackerById = (id) => {
        for (let collection of collections.value) {
            const tracker = collection.trackers.find(tracker => tracker.id === id);
            if (tracker) {
                return tracker;
            }
        }
        return false;
    }

    /**
     * The currently selected goal (active)
     */
    const activeGoal = computed(() => {
        return activeTracker.value ? activeTracker.value.activeGoal : null;
    });

    /**
     * A flag indicating whether the app is in dark mode
     */
    const darkMode = ref(false);

    /**
     * Adds a new collection of trackers/goals
     * @param collection
     */
    const addCollection = (collection) => {
        const index = collections.value.findIndex(c => c.id === collection.id);
        if (index !== -1) {
            collections.value.splice(index, 1, useCollection(collection));
        } else {
            collections.value.push(useCollection(collection));
        }
        activeId.value = collection.id;
    }

    /**
     * Deletes a collection
     * TODO: This technically removes all trackers/goals, but it doesn't yet clear data from the SQLite instance
     * @param collection
     */
    const deleteCollection = (collection) => {
        const index = collections.value.findIndex(c => c.id === collection.id);
        if (index > -1) {
            collections.value.splice(index, 1);
        }
    }

    return {
        collections,
        activeCollection,
        activeId,
        activeTracker,
        activeGoal,
        darkMode,
        getTrackerById,
        addCollection,
        deleteCollection
    };
})
