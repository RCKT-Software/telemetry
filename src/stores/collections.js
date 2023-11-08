import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useCollection} from "../components/composables/useCollection";

export const useCollectionsStore = defineStore('collections', () => {

    /**
     * List of all collections
     */
    const collections = ref([
        useCollection({
            label: 'Rosemary\'s Bakery',
            color: '#26DCB7'
        }),
        useCollection({
            label: 'Test Collection',
            color: '#9660e8'
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

    return {collections, activeCollection, activeId}
})
