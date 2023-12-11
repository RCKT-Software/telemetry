<template>

  <!-- Modal Window-->
  <div class="modal">

    <div class="modal__body">

      <p>We found <strong>{{props.csvData.numRecords}} records</strong>. Do you want to import them to "{{appDataStore.activeTracker.label}}".</p>

    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="confirmImport">Yes - Import Data</button>
    </div>
  </div>

  <!-- Overlay -->
  <div class="overlay" @click.prevent="modalStore.closeModal()" />

</template>

<script setup>

import {useModalStore} from "../../stores/modal";
import {useAppDataStore} from "../../stores/appData";

const modalStore = useModalStore();
const appDataStore = useAppDataStore();

const props = defineProps({
  csvData: Object
});

/**
 * Deletes the tracker and closes the modal
 */
const confirmImport = () => {
  appDataStore.activeTracker.importCSV(props.csvData.filePath);
  modalStore.closeModal();
};

</script>

<style scoped lang="scss">

</style>
