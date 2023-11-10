<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <i class="fa-sharp fa-solid fa-chart-mixed modal__header-icon"></i>
      <h1 class="modal__header-title">New progress tracker</h1>
      <span class="modal__header-details">Track your progress towards a goal.</span>
    </div>

    <div class="modal__body">

      <div class="row">
        <div class="input-group">
          <label>Label</label>
          <input type="text" placeholder="Ex: 'Net Worth'" v-model="trackerConfig.label">
        </div>

        <div class="input-group">
          <label>Number format</label>
          <select v-model="trackerConfig.numberFormat">
            <option value="number" selected>None</option>
            <option value="usd">Currency ($)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <label>Starting value <span>(optional)</span></label>
        <input type="text" placeholder="Ex: '$80,000'" v-model="trackerConfig.startingValue">
      </div>

      <div class="input-group">
        <label>Tracking mode</label>
        <expandedSelect />
      </div>

    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="addTracker">Next</button>
    </div>
  </div>

  <!-- Overlay -->
  <div class="overlay" @click.prevent="modalStore.closeModal()" />

</template>

<script setup>

import ExpandedSelect from "../input/expandedSelect.vue";
import {useModalStore} from "../../stores/modal";
import {ref} from "vue";
import {useCollectionsStore} from "../../stores/collections";

const modalStore = useModalStore();
const collectionsStore = useCollectionsStore();

/**
 * Define the configuration for the new tracker
 */
const trackerConfig = ref({
  label: null,
  numberFormat: 'number',
  startingValue: null,
  trackingMode: null
});

/**
 * Adds the tracker to the active collection and closes the modal
 */
const addTracker = () => {
  collectionsStore.activeCollection.addTracker(trackerConfig.value);
  modalStore.closeModal();
};

</script>

<style scoped lang="scss">

</style>
