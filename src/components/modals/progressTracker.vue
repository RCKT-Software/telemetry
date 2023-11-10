<template>

  <!-- Modal Window-->
  <div class="modal">
    <div class="modal__header">
      <i class="fa-sharp fa-solid fa-chart-mixed modal__header-icon"></i>
      <h1 class="modal__header-title">New progress tracker</h1>
      <span class="modal__header-details">Track your progress towards a goal.</span>
    </div>

    <div class="modal__body">

      <div class="row">
        <div class="input-group">
          <label>Label</label>
          <input type="text" placeholder="Ex: 'Net Worth'" v-model="collectionStore.activeTracker.label">
        </div>

        <div class="input-group">
          <label>Number format</label>
          <select>
            <option value="0" selected>None</option>
            <option value="0">Currency ($)</option>
            <option value="0">Percentage (%)</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <label>Starting value <span>(optional)</span></label>
        <input type="text" placeholder="Ex: '$80,000'">
      </div>

      <div class="input-group">
        <label>Tracking mode</label>
        <expandedSelect />
      </div>

    </div>

    <div class="modal__footer">
      <button class="btn">Cancel</button>
      <button class="btn btn--primary">Next</button>
    </div>
  </div>

  <!-- Overlay -->
  <div class="overlay"/>

</template>

<script setup>

import ExpandedSelect from "../input/expandedSelect.vue";
import {useCollectionsStore} from "../../stores/collections";

const collectionStore = useCollectionsStore();

</script>

<style scoped lang="scss">

</style>
