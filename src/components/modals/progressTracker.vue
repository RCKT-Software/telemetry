<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <i class="fa-sharp fa-solid fa-chart-mixed modal__header-icon"></i>
      <div v-if="!isEditMode">
        <h1 class="modal__header-title">New progress tracker</h1>
        <span class="modal__header-details">Track your progress towards a goal.</span>
      </div>
      <div v-if="isEditMode">
        <h1 class="modal__header-title">{{tracker.label.value}}</h1>
      </div>
    </div>

    <div class="modal__body">

      <div class="row">
        <div class="input-group">
          <label>Label</label>
          <input type="text" placeholder="Ex: 'Net Worth'" v-model="tracker.label.value">
        </div>

        <div class="input-group">
          <label>Data type</label>
          <select v-model="tracker.numberFormat.value">
            <option value="number" selected>Number</option>
            <option value="usd">Currency ($)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
        </div>
      </div>

      <!--      <div class="input-group">
              <label>Starting value <span>(optional)</span></label>
              <input type="text" placeholder="Ex: '$80,000'" v-model="trackerConfig.startingValue">
            </div>

            <div class="input-group">
              <label>Tracking mode</label>
              <expandedSelect />
            </div>-->

    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="addTracker">{{isEditMode ? 'Save' : 'Next'}}</button>
    </div>
  </div>

  <!-- Overlay -->
  <div class="overlay" @click.prevent="modalStore.closeModal()"/>

</template>

<script setup>

import ExpandedSelect from "../input/expandedSelect.vue";
import {useModalStore} from "../../stores/modal";
import {ref} from "vue";
import {useAppDataStore} from "../../stores/appData";
import {useTracker} from "../../composables/useTracker";

const modalStore = useModalStore();
const appDataStore = useAppDataStore();

/**
 * Supports both creating a new collection and editing an existing one
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
  appDataStore.activeCollection.addTracker(tracker);
  modalStore.closeModal();
};

</script>

<style scoped lang="scss">

</style>
