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
import captureDataPoint from "../modals/captureDataPoint.vue";
import collection from "../modals/collection.vue";
import deleteCollectionConfirmation from "../modals/deleteCollectionConfirmation.vue";
import importCSVConfirmation from "../modals/importCSVConfirmation.vue";

const modalStore = useModalStore();

/**
 * Map of modal names to their components
 */
const modals = {
  'progress-tracker': progressTracker,
  'delete-tracker': deleteTrackerConfirmation,
  'delete-collection': deleteCollectionConfirmation,
  'goal': goal,
  'capture-data-point': captureDataPoint,
  'collection': collection,
  'import-csv': importCSVConfirmation
};

</script>
