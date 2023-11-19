<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <i class="fa-sharp fa-solid fa-flag modal__header-icon"></i>
      <h1 class="modal__header-title">Set a goal for "<strong>{{appDataStore.activeTracker.label}}</strong>"</h1>
      <span class="modal__header-details">What do you want to accomplish?</span>
    </div>

    <div class="modal__body">

        <div class="input-group">
          <label>Goal</label>
          <input type="text" :placeholder="'Ex: ' + appDataStore.activeTracker.currentValue" v-model="goalConfig.targetValue">
        </div>

    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="addGoal">Set goal</button>
    </div>
  </div>

  <!-- Overlay -->
  <div class="overlay" @click.prevent="modalStore.closeModal()" />

</template>

<script setup>

import {useModalStore} from "../../stores/modal";
import {ref} from "vue";
import {useAppDataStore} from "../../stores/appData";

const modalStore = useModalStore();
const appDataStore = useAppDataStore();

/**
 * Define the configuration for the new goal
 */
const goalConfig = ref({
  targetValue: null,
});

/**
 * Adds the goal to the active tracker and closes the modal
 */
const addGoal = () => {
  appDataStore.activeTracker.addGoal(goalConfig.value);
  modalStore.closeModal();
};

</script>

<style scoped lang="scss">

</style>
