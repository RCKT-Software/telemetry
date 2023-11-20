import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useCollection} from "../composables/useCollection";
import {useTracker} from "../composables/useTracker";

const sampleCollections = [
    useCollection({
        label: 'Rosemary\'s Bakery',
        color: '#26DCB7',
        trackers: [
            useTracker({
                label: 'First-time customers'
            }),
            useTracker({
                label: 'Profit margin'
            }),
            useTracker({
                label: 'Gross sales'
            }),
            useTracker({
                label: 'Baking class attendees'
            }),
            useTracker({
                label: 'Facebook followers'
            })
        ]
    }),
    useCollection({
        label: 'Test Collection',
        color: '#9660e8',
        trackers: [
            useTracker({
                label: 'Example 1'
            }),
            useTracker({
                label: 'Example 2'
            })
        ]
    })
];

export const useAppDataStore = defineStore('appData', () => {

    /**
     * List of all collections
     */
    const collections = ref([
        useCollection()
    ]);

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
        return activeCollection.value ? activeCollection.value.activeTracker : null;
    });

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

    return {collections, activeCollection, activeId, activeTracker, activeGoal, darkMode};
})