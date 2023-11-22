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
        <input type="text" placeholder="Ex: 'Personal Goals'" v-model="collection.label.value">
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
import {useCollection} from "../../composables/useCollection";

const modalStore = useModalStore();
const appDataStore = useAppDataStore();

const props = defineProps({
  collection: Object
});

const collection = props.collection ? useCollection(props.collection.serializeState()) : useCollection();
//const collection = useCollection();

console.log(collection);



/**
 * Adds the tracker to the active collection and closes the modal
 * If the collection already exists, it will be updated
 */
const addCollection = () => {
  appDataStore.addCollection(collection);
  modalStore.closeModal();
};

</script>

<style scoped lang="scss">

</style>
