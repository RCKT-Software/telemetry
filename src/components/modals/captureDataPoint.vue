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
        <input type="text"
               :placeholder="'Ex: ' + appDataStore.activeTracker.formattedCurrentValue"
               :value="formattedValue"
               @blur="handleInput">
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
import {computed, ref} from "vue";
import {useAppDataStore} from "../../stores/appData";
import {formatValue} from "../../utility/helpers";

const modalStore = useModalStore();
const appDataStore = useAppDataStore();

/**
 * Define the data point payload to be captured
 */
const captureConfig = ref({
  datapoint: null,
});

/**
 * Handles setting the input value when it changes
 * @param event
 */
const handleInput = (event) => {
  setDataPointValue(event.target.value);
};

/**
 *  Sets the value of the data point
 * @param value
 */
const setDataPointValue = (value) => {
  captureConfig.value.datapoint = cleanValue(value);
};

/**
 * Cleans the value of the input field
 * @param value
 * @returns {number}
 */
const cleanValue = (value) => {
  return isNaN(parseFloat(value.replace(/[^0-9.]+/g, ''))) ? 0 : parseFloat(value.replace(/[^0-9.]+/g, ''));
}

/**
 * Formats the value to be displayed in the input field
 */
const formattedValue = computed(() => {
  return captureConfig.value.datapoint ? formatValue(captureConfig.value.datapoint, appDataStore.activeTracker.numberFormat) : null;
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
