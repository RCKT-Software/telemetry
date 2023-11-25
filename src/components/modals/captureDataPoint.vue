<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <h1 class="modal__header-title">{{ appDataStore.activeTracker.label }}</h1>
      <span class="modal__header-details">Manually log a data point</span>
    </div>

    <div class="modal__body">

      <div class="input-group">
        <label>What's the current value?</label>
        <input type="text" :placeholder="'Ex: ' + appDataStore.activeTracker.formattedCurrentValue"
               v-model="captureConfig.datapoint">
      </div>

    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="captureDataPoint">Save</button>
    </div>
  </div>

  <!-- Overlay -->
  <div class="overlay" @click.prevent="modalStore.closeModal()"/>

</template>

<script setup>

import {useModalStore} from "../../stores/modal";
import {ref} from "vue";
import {useAppDataStore} from "../../stores/appData";

const modalStore = useModalStore();
const appDataStore = useAppDataStore();

/**
 * Define the data point payload to be captured
 */
const captureConfig = ref({
  datapoint: null,
});

/**
 * Captures the data point and closes the modal
 */
const captureDataPoint = () => {
  appDataStore.activeTracker.captureDataPoint(captureConfig.value);
  modalStore.closeModal();
};

</script>

<style scoped lang="scss">

</style>
