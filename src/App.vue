<template>

  <!-- Dark Mode Wrapper -->
  <section id="top-level" :style="rootStyles">

    <!-- OS Title Bar -->
    <osTitleBar/>

    <!-- Navigation Panel  -->
    <navigationPanel/>

    <!-- Main Content -->
    <main id="main" :class="{'hide-navigation': !interfaceStore.navigationOpen}">
      <section v-if="appDataStore.activeTracker" id="tracker-view" class="center-content">

        <div class="title-bar">
          <div class="title-bar__left">

            <h1 style="margin-bottom: 10px"><span class="tracker-title"
                                                  @click.prevent="modalStore.openModal('progress-tracker', {tracker: appDataStore.activeTracker})">{{
                appDataStore.activeTracker.label
              }}</span> <span class="value-tag"
                              style="margin-left: 6px">{{
                appDataStore.activeTracker.formattedCurrentValue
              }}</span>
            </h1>
            <div class="quick-stats">
              <div class="quick-stats__statistic">
                <Database :size="16"/>
                <span>{{ appDataStore.activeTracker.recentDataPoints.length }} data points</span>
              </div>
              <div class="quick-stats__statistic" v-if="appDataStore.activeTracker.recentDataPoints.length > 0">
                <History :size="16"/>
                <span>Last updated {{ appDataStore.activeTracker.formattedLastUpdated }}</span>
              </div>
            </div>

          </div>
          <div class="title-bar__right" v-if="appDataStore.activeTracker.recentDataPoints.length > 0">

            <select class="time-period" disabled>
              <option value="0" selected>Automatic Timeframe</option>
            </select>

          </div>
        </div>

        <!-- Chart & Next Goal -->
        <div class="chart-row">
          <chart v-if="appDataStore.activeTracker.recentDataPoints.length > 0"/>
          <div class="chart-placeholder" v-else>
            <label>Let's start tracking something...</label>
            <div style="display: flex; flex-direction: row; flex-wrap: nowrap; gap: 20px">
              <button class="btn btn--primary" @click.prevent="modalStore.openModal('capture-data-point')">
                <Plus :size="16"/>
                <span>Update current value</span>
              </button>
              <button class="btn" @click.prevent="getCSVData">
                <FileInput :size="16"/>
                <span>Import CSV file</span>
              </button>
            </div>
          </div>
          <goalBox/>
        </div>

        <!-- Tabbed Section -->
        <div class="tab-section">
          <div class="tabs">
            <button class="tab" :class="{'tab--active': activeTab === 'data'}" @click.prevent="setActiveTab('data')">
              <Table2 :size="16"/>
              Data
            </button>
            <button class="tab" :class="{'tab--active': activeTab === 'settings'}"
                    @click.prevent="setActiveTab('settings')">
              <Settings2 :size="16"/>
              Settings
            </button>
          </div>

          <!-- Data Tab -->
          <section class="tab-content--data" v-if="activeTab === 'data'">
            <dataTable/>
            <section style="margin-top:-35px">
              <label style="margin-bottom: 20px">Manage Data</label>
              <button class="btn btn--primary" @click.prevent="modalStore.openModal('capture-data-point')">
                <Plus :size="16"/>
                <span>Update current value</span>
              </button>
              <button class="btn" style="margin-top: 10px" @click.prevent="getCSVData">
                <FileInput :size="16"/>
                <span>Import CSV file</span>
              </button>
            </section>
          </section>

          <!-- Settings Tab -->
          <section class="tab-content--settings" v-if="activeTab === 'settings'">
            <trackerSettings/>
          </section>


        </div>

      </section>
      <section v-if="!appDataStore.activeTracker" id="empty-view" class="center-content">
        <welcome v-if="appDataStore.showWelcome"/>
        <emptyCollection v-if="!appDataStore.showWelcome"/>
      </section>
    </main>

    <!-- New Progress Tracker Modal -->
    <modalManager v-if="modalStore.activeModal"/>

  </section>

</template>

<script setup>

import {ref, onMounted, computed} from 'vue';
import chart from "./components/chart.vue";
import OsTitleBar from "./components/layout/osTitleBar.vue";
import NavigationPanel from "./components/layout/navigationPanel.vue";
import GoalBox from "./components/goalBox.vue";
import {useAppDataStore} from "./stores/appData";
import {useModalStore} from "./stores/modal";
import ModalManager from "./components/layout/modalManager.vue";
import {useInterfaceStore} from "./stores/interface";
import DataTable from "./components/dataTable.vue";
import EmptyCollection from "./components/layout/emptyCollection.vue";
import Welcome from "./components/layout/welcome.vue";
import {Database, History, Plus, Table2, Settings2, FileInput} from "lucide-vue-next";
import TrackerSettings from "./components/layout/trackerSettings.vue";

const appDataStore = useAppDataStore();
const modalStore = useModalStore();
const interfaceStore = useInterfaceStore();

const systemInformation = ref({
  version: null,
  uuid: null,
  platform: null,
});

/**
 * The active tab to display below the chart
 * @type {Ref<UnwrapRef<string>>}
 */
const activeTab = ref('data');

/**
 * Swap active tabs
 * @param tab
 */
const setActiveTab = (tab) => {
  activeTab.value = tab;
}

/**
 * Get system information when available
 * Send anonymous usage data once per minute
 */
onMounted(async () => {
  systemInformation.value = await window["electronAPI"].getSystemInformation();
  await sendAnonymousUsageData();
  setInterval(async () => {
    await sendAnonymousUsageData();
  }, 1000 * 60);
});

/**
 * Sends anonymous usage data to the server
 * @returns {Promise<void>}
 */
const sendAnonymousUsageData = async () => {
  await fetch('https://telemetry.software/api/usage', {
    method: 'POST',
    body: JSON.stringify({
      deviceId: systemInformation.value.uuid,
      platform: systemInformation.value.platform,
      version: systemInformation.value.version,
      numCollections: appDataStore.collections.length,
      numTrackers: appDataStore.numTrackers,
      numGoals: appDataStore.numGoals,
      numDataPoints: appDataStore.numDataPoints,
    })
  });
}

const getCSVData = () => {
  window["electronAPI"].getCSVData((csvData) => {
    modalStore.openModal('import-csv', {csvData});
  });
}

const rootStyles = computed(() => {
  if (appDataStore.darkMode) {
    return {
      '--primary': '#59DEC3',
      '--heading': '#EFEFEF',
      '--black': '#EFEFEF',
      '--darker': '#91A4CB',
      '--dark': '#6D82AB',
      '--medium': '#243351',
      '--light': '#18243B',
      '--lighter': '#101828',
      '--white': '#0C131F',
      '--success': '#68c026',
      '--success-light': '#D7FAC0',
    };
  } else {
    return {
      '--primary': '#59DEC3',
      '--heading': '#060a10',
      '--black': '#060a10',
      '--darker': '#475467',
      '--dark': '#9AB2D4',
      '--medium': '#E1E6F5',
      '--light': '#EEF2FD',
      '--lighter': '#F7F9FF',
      '--white': '#FFFFFF',
      '--success': '#68c026',
      '--success-light': '#D7FAC0',
    };
  }
});

</script>

<style lang="scss">

/* Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary: #59DEC3;
  --heading: #060a10;
  --black: #060a10;
  --darker: #475467;
  --dark: #9AB2D4;
  --medium: #E1E6F5;
  --light: #EEF2FD;
  --lighter: #F7F9FF;
  --white: #FFFFFF;
  --success: #68c026;
  --success-light: #D7FAC0;
}

body, html {
  background-color: var(--white);
  position: relative;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--darker);
  cursor: default;

  * {
    user-select: none;
  }
}

h1, h2, h3, h4, h5, h6 {
  color: var(--heading);
  cursor: default;
  margin: 0;
}

p {
  margin: 0;
}

a {
  color: unset;
  text-decoration: unset;
}

h1 {
  font-size: 20px;
  font-weight: 600;

  .value-tag {
    padding: 3px 8px;
    font-size: 14px;
  }
}


#main {
  width: calc(100vw - 341px);
  height: calc(100vh - 40px);
  margin-left: 341px;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-snap-type: y proximity;
  scrollbar-color: var(--medium);
  scrollbar-width: thin;
  background-color: var(--white);

  &.hide-navigation {
    width: 100vw;
    margin: 0 auto;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-clip: content-box;
    background-color: var(--medium);
    border: 1px solid transparent;
    border-radius: 8px;
  }

  .center-content {
    width: 1140px;
    margin: 0 auto;
  }

  @media (max-width: 1481px) {
    width: 100vw;
    margin: 0 auto;
  }
}


.quick-stats {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 15px;
  align-items: center;
  justify-content: start;

  .quick-stats__statistic {
    display: flex;
    align-items: center;
    gap: 5px;

    svg {
      color: var(--dark);
    }

    span {
      font-size: 12px;
      font-weight: 400;
      color: var(--darker);
    }
  }
}

.value-tag {
  display: inline-flex;
  color: var(--darker);
  background-color: var(--light);
  border-radius: 3px;
  font-size: 12px;
  padding: 4px 7px;
  vertical-align: baseline;
  width: fit-content;
  align-items: center;

  svg {
    margin-right: 3px;
  }

  &.value-tag--success {
    color: var(--success);
    background-color: var(--success-light);
  }
}

.overlay {
  position: fixed;
  top: 40px;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 9000;
  background-color: rgba(0, 0, 0, 0.7);
}

.title-bar {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: space-between;
  padding: 25px 30px;

  .title-bar__right {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 30px;
  }
}

.btn {
  padding: 12px 18px;
  gap: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--light);
  color: var(--heading);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background-color: var(--lighter);
  }

  &.btn--primary {
    background-color: var(--black);
    color: var(--lighter);

    &:hover {
      background-color: var(--darker);
      color: var(--white);
    }
  }
}

select, input {
  border: 1px solid var(--medium);
  border-radius: 5px;
  font-family: 'Inter', sans-serif;
  padding: 12px 15px;
  color: var(--heading);
  outline: none;
  min-width: 180px;
  font-weight: 500;
  background-color: var(--white);

  &:focus {
    box-shadow: var(--medium) 0 0 0 2px;
  }

  &::placeholder {
    color: var(--dark);
    opacity: 1;
  }
}

input {
  font-weight: 400;
  min-width: unset;
  width: 100%;
  box-sizing: border-box;
}

label {
  display: block;
  color: var(--black);
  font-weight: 500;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  margin-bottom: 8px;

  span {
    color: var(--dark);
    font-weight: 400;
    font-size: 12px;
  }

  svg {
    color: var(--dark);
    cursor: pointer;
    margin-left: 4px;
  }
}

.input-group {
  margin-bottom: 20px;
}

.time-period {
  width: 275px;
}

.chart-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 0;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.divider {
  height: 1px;
  width: 100%;
  background-color: var(--light);
}

.tabs {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 15px;
  margin-bottom: 25px;
  width: 100%;
  justify-content: flex-start;
}

.tab {
  padding: 10px 15px;
  gap: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--white);
  color: var(--heading);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;

  &:hover {
    background-color: var(--lighter);
  }

  &.tab--active {
    background-color: var(--lighter);
  }
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 15px;
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--white);
  border-radius: 8px;
  z-index: 9050;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 3px, rgba(0, 0, 0, 0.01) 0 1px 4px 0;
  border: 1px solid var(--lighter);
  min-width: 430px;

  .modal__header {
    padding: 20px 20px 10px;
  }

  .modal__header-icon {
    color: var(--heading);
    font-size: 24px;
    margin-bottom: 15px;
  }

  .modal__header-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 2px;
    color: var(--heading);
  }

  .modal__header-details {
    font-size: 12px;
    color: var(--darker);
  }

  .modal__body {
    padding: 20px;
    color: var(--heading);
  }
}

.modal__footer, .collection-selector-popup__footer {
  padding: 20px;
  border-top: 1px solid var(--light);
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: var(--lighter);
  border-radius: 0 0 8px 8px;
}

.tab-section {
  border-top: 1px solid var(--medium);
  display: block;
  padding: 30px 30px 0;
}

.tracker-title {
  border-bottom: 2px solid transparent;
  padding-bottom: 2px;

  &:hover {
    border-bottom: 2px dotted var(--dark);
    cursor: pointer;
  }
}

div.chart-placeholder {
  border: 1px solid var(--medium);
  width: 850px;
  aspect-ratio: 2.07;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  margin-left: 30px;
}

.lucide {
  line-height: 1;
  display: inline-block;
  width: fit-content;
}

.tab-content--data {
  display: grid;
  grid-template-columns: 775px 1fr;
  gap: 30px;

  .btn {
    width: 100%;
    justify-content: center;
  }
}

.setting-item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: start;
  gap: 60px;
  padding: 30px 0;
  border-bottom: 1px solid var(--light);

  &:first-child {
    padding-top: 20px;
  }

  .setting-item__meta {
    width: 400px;
  }

  .setting-item__label {
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--heading);
  }

  .setting-item__description {
    color: var(--darker);
  }

  .setting-item__support-link {
    color: var(--heading);
    font-weight: 500;
    text-decoration: underline;
  }
}

</style>
