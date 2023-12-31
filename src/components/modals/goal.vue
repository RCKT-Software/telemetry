<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <Flag :size="26" class="modal__header-icon" />
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
        <input type="number" :placeholder="'Ex: ' + (appDataStore.activeTracker.currentValue ? appDataStore.activeTracker.currentValue : 0)"
               v-model="goal.targetValue.value">
      </div>

    </div>

    <div class="modal__footer">
      <button class="btn" @click.prevent="modalStore.closeModal()">Cancel</button>
      <button class="btn btn--primary" @click.prevent="saveGoal">{{ isEditMode ? 'Save' : 'Set goal' }}</button>
    </div>
  </div>

  <!-- Overlay -->
  <div class="overlay" @click.prevent="modalStore.closeModal()"/>

</template>

<script setup>

import {useModalStore} from "../../stores/modal";
import {useAppDataStore} from "../../stores/appData";
import {useGoal} from "../../composables/useGoal";
import {Flag} from "lucide-vue-next";

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
 * If the value is empty, the goal is deleted
 */
const saveGoal = () => {
  if (!goal.targetValue.value) {
    appDataStore.activeTracker.deleteGoal();
  } else {
    appDataStore.activeTracker.addGoal(goal.serializeState());
  }
  modalStore.closeModal();
};

</script>
