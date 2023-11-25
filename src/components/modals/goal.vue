<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <i class="fa-sharp fa-solid fa-flag modal__header-icon"></i>
      <div v-if="!isEditMode">
        <h1 class="modal__header-title">{{ appDataStore.activeTracker.label }}</h1>
        <span class="modal__header-details">Set a goal and predict when you'll reach it...</span>
      </div>
      <div v-if="isEditMode">
        <h1 class="modal__header-title">Edit goal: {{ appDataStore.activeTracker.label }}</h1>
      </div>
    </div>

    <div class="modal__body">

      <div class="input-group">
        <label>Goal</label>
        <input type="text" :placeholder="'Ex: ' + appDataStore.activeTracker.currentValue"
               v-model="goal.targetValue.value">
      </div>

    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="addGoal">{{isEditMode ? 'Save' : 'Set goal'}}</button>
    </div>
  </div>

  <!-- Overlay -->
  <div class="overlay" @click.prevent="modalStore.closeModal()"/>

</template>

<script setup>

import {useModalStore} from "../../stores/modal";
import {useAppDataStore} from "../../stores/appData";
import {useGoal} from "../../composables/useGoal";

const modalStore = useModalStore();
const appDataStore = useAppDataStore();

/**
 * Supports both creating a new goal and editing an existing one
 */
const props = defineProps({
  goal: Object
});
const goal = props.goal ? useGoal(props.goal.serializeState()) : useGoal({
  trackerId: appDataStore.activeTracker.id,
});
const isEditMode = !!props.goal;

/**
 * Adds the goal to the active tracker and closes the modal
 */
const addGoal = () => {
  appDataStore.activeTracker.addGoal(goal.serializeState());
  modalStore.closeModal();
};

</script>
