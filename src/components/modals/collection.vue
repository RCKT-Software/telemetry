<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <i class="fa-sharp fa-solid fa-folder modal__header-icon"></i>
      <h1 class="modal__header-title">New collection</h1>
      <span class="modal__header-details">Organize your trackers and goals.</span>
    </div>

    <div class="modal__body">

      <div class="input-group">
        <label>Label</label>
        <input type="text" placeholder="Ex: 'Personal Goals'" v-model="collectionConfig.label">
      </div>

    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="addCollection">Next</button>
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
 * Define the configuration for the new tracker
 */
const collectionConfig = ref({
  label: null
});

/**
 * Adds the tracker to the active collection and closes the modal
 */
const addCollection = () => {
  appDataStore.addCollection(collectionConfig.value);
  modalStore.closeModal();
};

</script>

<style scoped lang="scss">

</style>
