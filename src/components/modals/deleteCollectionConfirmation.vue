<template>

  <!-- Modal Window-->
  <div class="modal">

    <div class="modal__body">

      <p>Are you sure you want to delete <strong>"{{appDataStore.activeCollection.label}}"</strong>? <br><br>Deleting this collection will remove all associated data permanently.</p>

    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="deleteCollection">Yes - Delete</button>
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

/**
 * Deletes the tracker and closes the modal
 */
const deleteCollection = () => {
  appDataStore.deleteCollection(appDataStore.activeCollection);
  modalStore.closeModal();
};

</script>

<style scoped lang="scss">

</style>
