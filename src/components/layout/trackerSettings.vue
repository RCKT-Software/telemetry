<template>
  <div class="settings-list">
    <div class="setting-item">
      <div class="setting-item__meta">
        <label class="setting-item__label">Formatting</label>
        <span class="setting-item__description">How the data points are formatted.</span>
      </div>
      <div class="setting-item__control">
        <select v-model="appDataStore.activeTracker.numberFormat">
          <option value="number" selected>Number</option>
          <option value="usd">Currency ($)</option>
          <option value="percentage">Percentage (%)</option>
        </select>
      </div>
    </div>
    <div class="setting-item">
      <div class="setting-item__meta">
        <label class="setting-item__label">Interpolation</label>
        <span class="setting-item__description">The "smoothness" between points</span>
      </div>
      <div class="setting-item__control">
        <select v-model="appDataStore.activeTracker.steppedChart">
          <option :value="false" selected>Smooth (default)</option>
          <option :value="true">Stepped</option>
        </select>
      </div>
    </div>
    <div class="setting-item">
      <div class="setting-item__meta">
        <label class="setting-item__label">Regression Mode</label>
        <span class="setting-item__description">The model used to generate predictions.
                  <a href="#" class="setting-item__support-link" @click.prevent="interfaceStore.openLink('https://docs.telemetry.software/Understanding+Regression+Modes')" target="_blank">Learn more</a></span>
      </div>
      <div class="setting-item__control">
        <select disabled>
          <option value="0">Automatic</option>
          <option value="1">Linear</option>
          <option value="2">Exponential</option>
          <option value="3">Logarithmic</option>
          <option value="4">Power</option>
          <option value="5">Polynomial</option>
        </select>
      </div>
    </div>
    <div class="setting-item">
      <div class="setting-item__meta">
        <label class="setting-item__label">Delete tracker</label>
        <span class="setting-item__description">Danger! This action is irreversible.</span>
      </div>
      <div class="setting-item__control">
        <button class="btn" @click.prevent="modalStore.openModal('delete-tracker')">
          <span>Delete "{{ appDataStore.activeTracker.label }}"</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

import {useAppDataStore} from "../../stores/appData";
import {useInterfaceStore} from "../../stores/interface";
import {useModalStore} from "../../stores/modal";

const appDataStore = useAppDataStore();
const interfaceStore = useInterfaceStore();
const modalStore = useModalStore();

</script>

<style scoped lang="scss">

</style>
