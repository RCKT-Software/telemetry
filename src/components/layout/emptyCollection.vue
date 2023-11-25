<template>
  <div class="empty-message">
    <emptyTumbleweed />
    <h1>This collection is empty</h1>
    <p>This is no mirage, just a place for progress...</p>
    <button class="btn btn--primary" @click.prevent="modalStore.openModal('progress-tracker')">Create a new progress tracker</button>
  </div>
</template>

<script setup>

import EmptyTumbleweed from "../illustrations/emptyTumbleweed.vue";
import {useModalStore} from "../../stores/modal";

const modalStore = useModalStore();
</script>

<style scoped lang="scss">
.empty-message {
  width: 100%;
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 0;

  h1{
    margin-top: 60px;
    margin-bottom: 5px;
  }

  p{
    margin-bottom: 30px;
  }
}

</style>
