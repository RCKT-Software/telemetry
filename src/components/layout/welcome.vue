<template>
  <div class="welcome-message">
    <emptyBicycle />
    <h1>Let's make some progress together</h1>
    <p>Telemetry is an open-source tool that predicts<br>when you'll reach your goals. Jump right in!</p>
    <button class="btn btn--primary" @click.prevent="modalStore.openModal('progress-tracker')">Create your first progress tracker</button>
  </div>
</template>

<script setup>

import {useModalStore} from "../../stores/modal";
import EmptyBicycle from "../illustrations/emptyBicycle.vue";

const modalStore = useModalStore();
</script>

<style scoped lang="scss">
.welcome-message {
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
    margin-bottom: 10px;
  }

  p{
    margin-bottom: 30px;
    text-align: center;
    line-height: 1.3em;
  }
}

</style>
