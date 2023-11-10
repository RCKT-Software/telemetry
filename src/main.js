// Import necessary functions from Vue and component libraries
import { createApp, ref } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

// Import state management for application data
import { useCollectionsStore } from "./stores/collections";

// Import composables (reusable composition functions) related to collections and tracker functionality
import { useCollection } from "./components/composables/useCollection";
import { useTracker } from "./components/composables/useTracker";

// Initialize Pinia state management
const pinia = createPinia();

// Create a Vue application instance
const app = createApp(App);

// Tell Vue to use Pinia for state management
app.use(pinia);

// Check if the application is running in Electron and `electronAPI` is available
if (window.electronAPI) {
    // Use the Electron API to hydrate the store with data from the Electron layer
    window.electronAPI.hydrateStore((data) => {
        // Obtain an instance of the collections store
        const collectionsStore = useCollectionsStore();

        // Parse the hydrated data received from Electron
        const hydratedData = JSON.parse(data);

        // Convert the raw collection data into proper collection objects
        hydratedData.collections = hydratedData.collections.map(collectionData => {
            // Convert each tracker within the collection into a tracker instance
            collectionData.trackers = ref(collectionData.trackers.map(trackerData => {
                return useTracker(trackerData);
            }));
            // Convert the collection data into a collection instance
            return useCollection(collectionData);
        });

        // Apply the hydrated data to the collections store
        collectionsStore.$patch(hydratedData);

        // Subscribe to changes in the collections store to persist state changes back to Electron
        collectionsStore.$subscribe((mutation, state) => {
            // Serialize the state for storage, converting collections to their serialized form
            const serializedData = {
                ...state,
                collections: state.collections.map(collection => collection.serializeState())
            };
            // Send the serialized data back to Electron for persistence
            window["electronAPI"].updateStore(JSON.stringify(serializedData));
        });

        // Now that state is hydrated and listeners are active, mount the Vue application to the DOM
        app.mount('#app');
    });
}
