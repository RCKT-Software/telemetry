import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useCollectionsStore = defineStore('collections', () => {

    /**
     * List of all collections
     */
    const collections = ref([
        {
            id: 0,
            label: 'My Collection',
            abbreviation: 'MC',
            color: '#9660e8'
        },
        {
            id: 1,
            label: 'Rosemary\'s Bakery',
            abbreviation: 'RB',
            color: '#26DCB7'
        }
    ]);

    /**
     * The currently selected collection (active)'s index
     */
    const activeId = ref(0);

    /**
     * The currently selected collection (active)
     */
    const activeCollection = computed(() => collections.value.find(collection => collection.id === activeId.value));

    return {collections, activeCollection, activeId}
})
