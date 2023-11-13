<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <h1 class="modal__header-title">Add Data for <strong>"{{ collectionsStore.activeTracker.label }}"</strong></h1>
    </div>

    <div class="modal__body">

      <div class="input-group">
        <label>Updated value</label>
        <input type="text" :placeholder="'Ex: ' + collectionsStore.activeTracker.formattedCurrentValue"
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
import {useCollectionsStore} from "../../stores/collections";

const modalStore = useModalStore();
const collectionsStore = useCollectionsStore();

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
  collectionsStore.activeTracker.captureDataPoint(captureConfig.value);
  modalStore.closeModal();
};

</script>

<style scoped lang="scss">

</style>
