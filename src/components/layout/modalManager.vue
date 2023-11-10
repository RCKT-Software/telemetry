<template>
  <div v-if="modalStore.activeModal">
    <component :is="modals[modalStore.activeModal]" v-bind="modalStore.activeModalProps" />
  </div>
</template>

<script setup>

import {useModalStore} from "../../stores/modal";
import progressTracker from "../modals/progressTracker.vue";

const modalStore = useModalStore();

/**
 * Map of modal names to their components
 */
const modals = {
  'progress-tracker': progressTracker
};

</script>
