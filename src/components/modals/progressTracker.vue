<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <TrendingUp :size="26" class="modal__header-icon"/>
      <div v-if="!isEditMode">
        <h1 class="modal__header-title">New progress tracker</h1>
        <span class="modal__header-details">Track your progress towards a goal.</span>
      </div>
      <div v-if="isEditMode">
        <h1 class="modal__header-title">{{ tracker.label.value }}</h1>
      </div>
    </div>

    <div class="modal__body">
      <div class="input-group">
        <label>Label</label>
        <input ref="startingInput" type="text" placeholder="Ex: 'Net Worth'" v-model="tracker.label.value">
      </div>
    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="addTracker">{{ isEditMode ? 'Save' : 'Next' }}</button>
    </div>
  </div>

  <!-- Overlay -->
  <div class="overlay" @click.prevent="modalStore.closeModal()"/>

</template>

<script setup>

import {useModalStore} from "../../stores/modal";
import {useAppDataStore} from "../../stores/appData";
import {useTracker} from "../../composables/useTracker";
import {TrendingUp} from "lucide-vue-next";
import {onMounted, ref} from "vue";
import {onKeyStroke} from "@vueuse/core";

const modalStore = useModalStore();
const appDataStore = useAppDataStore();

/**
 * Supports both creating a new tracker and editing an existing one
 */
const props = defineProps({
  tracker: Object
});
const tracker = props.tracker ? useTracker(props.tracker.serializeState()) : useTracker();
const isEditMode = !!props.tracker;

/**
 * Adds the tracker to the active collection and closes the modal
 */
const addTracker = () => {
  appDataStore.activeCollection.addTracker(tracker.serializeState());
  modalStore.closeModal();
};

/**
 * Listen for the enter key to add the tracker
 */
onKeyStroke('Enter', (e) => {
  addTracker();
});

/**
 * Focus the starting input when the modal is opened
 */
const startingInput = ref(null);
onMounted(() => {
  startingInput.value.focus();
});

</script>

<style scoped lang="scss">

</style>
