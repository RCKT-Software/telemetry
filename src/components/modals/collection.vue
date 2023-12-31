<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <Folder :size="26" class="modal__header-icon" />
      <div v-if="!isEditMode">
        <h1 class="modal__header-title">New collection</h1>
        <span class="modal__header-details">Organize your trackers and goals.</span>
      </div>
      <div v-if="isEditMode">
        <h1 class="modal__header-title">{{collection.label.value}}</h1>
      </div>

    </div>

    <div class="modal__body">

      <div class="input-group">
        <label>Label</label>
        <input ref="startingInput" type="text" placeholder="Ex: 'Personal Goals'" v-model="collection.label.value">
      </div>

    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="addCollection">{{isEditMode ? 'Save' : 'Create'}}</button>
    </div>
  </div>

  <!-- Overlay -->
  <div class="overlay" @click.prevent="modalStore.closeModal()"/>

</template>

<script setup>

import {useModalStore} from "../../stores/modal";
import {useAppDataStore} from "../../stores/appData";
import {useCollection} from "../../composables/useCollection";
import {Folder} from "lucide-vue-next";
import {onMounted, ref} from "vue";
import {onKeyStroke} from "@vueuse/core";

const modalStore = useModalStore();
const appDataStore = useAppDataStore();

/**
 * Supports both creating a new collection and editing an existing one
 */
const props = defineProps({
  collection: Object
});
const collection = props.collection ? useCollection(props.collection.serializeState()) : useCollection();
const isEditMode = !!props.collection;

/**
 * Adds the tracker to the active collection and closes the modal
 * If the collection already exists, it will be updated
 */
const addCollection = () => {
  appDataStore.addCollection(collection.serializeState());
  modalStore.closeModal();
};

/**
 * Listen for the enter key to add the collection
 */
onKeyStroke('Enter', (e) => {
  addCollection();
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
