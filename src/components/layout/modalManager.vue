<template>
  <div v-if="modalStore.activeModal">
    <component :is="modals[modalStore.activeModal]" v-bind="modalStore.activeModalProps" />
  </div>
</template>

<script setup>

import {useModalStore} from "../../stores/modal";
import progressTracker from "../modals/progressTracker.vue";
import deleteTrackerConfirmation from "../modals/deleteTrackerConfirmation.vue";
import goal from "../modals/goal.vue";

const modalStore = useModalStore();

/**
 * Map of modal names to their components
 */
const modals = {
  'progress-tracker': progressTracker,
  'delete-tracker': deleteTrackerConfirmation,
  'goal': goal,
};

</script>
