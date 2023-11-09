import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useCollection} from "../components/composables/useCollection";
import {useTracker} from "../components/composables/useTracker";

export const useCollectionsStore = defineStore('collections', () => {

    /**
     * List of all collections
     */
    const collections = ref([
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
        return activeCollection.value.activeTracker;
    });

    return {collections, activeCollection, activeId, activeTracker}
})