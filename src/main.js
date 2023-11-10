import {createApp, ref} from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
import {useCollectionsStore} from "./stores/collections";
import {useCollection} from "./components/composables/useCollection";
import {useTracker} from "./components/composables/useTracker";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

if (window.electronAPI) {
    window.electronAPI.hydrateStore((data) => {
        const collectionsStore = useCollectionsStore();
        const hydratedData = JSON.parse(data);
        hydratedData.collections = hydratedData.collections.map(collectionData => {
            collectionData.trackers = ref(collectionData.trackers.map(trackerData => {
                return useTracker(trackerData);
            }));
            return useCollection(collectionData);
        });
        collectionsStore.$patch(hydratedData);
        collectionsStore.$subscribe((mutation, state) => {
            const serializedData = {
                ...state,
                collections: state.collections.map(collection => collection.serializeState())
            };
            window["electronAPI"].updateStore(JSON.stringify(serializedData));
        });
        app.mount('#app');
    });
}
