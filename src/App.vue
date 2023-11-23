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
                <i class="fa-sharp fa-regular fa-database"></i>
                <span>{{ appDataStore.activeTracker.recentDataPoints.length }} data points</span>
              </div>
              <div class="quick-stats__statistic">
                <i class="fa-sharp fa-regular fa-clock-rotate-left"></i>
                <span>Last updated {{ appDataStore.activeTracker.formattedLastUpdated }}</span>
              </div>
            </div>

          </div>
          <div class="title-bar__right">

            <button class="btn btn--primary" @click.prevent="modalStore.openModal('capture-data-point')">
              <i class="fa-sharp fa-regular fa-plus"></i>
              <span>Data point</span>
            </button>

            <select class="time-period" disabled>
              <option value="0">24 hours</option>
              <option value="0">3 days</option>
              <option value="0">7 days</option>
              <option value="0">30 days</option>
              <option value="0">60 days</option>
              <option value="0">90 days</option>
              <option value="0">2023</option>
              <option value="0" selected>All time</option>
            </select>

          </div>
        </div>

        <!-- Chart & Next Goal -->
        <div class="chart-row">
          <chart/>
          <goalBox/>
        </div>

        <!-- Tabbed Section -->
        <div class="tab-section">
          <div class="tabs">
            <!--            <button class="tab tab&#45;&#45;active"><i class="fa-sharp fa-solid fa-list-timeline"></i> Analytics</button>-->
            <button class="tab"><i class="fa-sharp fa-regular fa-table-rows"></i> Data</button>
            <button class="tab"><i class="fa-sharp fa-solid fa-gear"></i> Settings</button>
            <button class="tab" @click.prevent="modalStore.openModal('delete-tracker')"><i
                class="fa-sharp fa-solid fa-trash"></i> Delete
            </button>
            <!--            <button class="tab"><i class="fa-sharp fa-solid fa-chart-line"></i> Chart Settings</button>-->
          </div>

          <div style="background-color: var(--lighter); width: 100%; height: 800px; border-radius: 5px; padding: 20px">
            <p style="margin-bottom: 10px; display: block; font-weight: bold">
              {{ Math.floor(appDataStore.activeTracker.regressionData.calculation.r2 * 100) }}% regression model fit
              using {{ appDataStore.activeTracker.regressionData.name }}.</p>
            <p v-for="dataPoint in appDataStore.activeTracker.recentDataPoints">{{ dataPoint.createdAt }} =>
              {{ dataPoint.value }}</p>
          </div>
        </div>

      </section>
      <section v-if="!appDataStore.activeTracker" id="empty-view" class="center-content" style="margin-top:20px;">
        <div style="background-color: var(--lighter); width: 100%; border-radius: 5px; padding: 20px">
          <p style="font-weight: bold">
            This collection is empty.
          </p>
        </div>
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

const systemInformation = ref({
  version: null,
  uuid: null
});
;

/**
 * Get system information when available
 */
onMounted(async () => {
  systemInformation.value = await window["electronAPI"].getSystemInformation();
});

const appDataStore = useAppDataStore();
const modalStore = useModalStore();
const interfaceStore = useInterfaceStore();

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

  .quick-stats__statistic {

    i {
      margin-right: 6px;
    }

    span {
      font-size: 12px;
      font-weight: 400;
      color: var(--darker);
    }
  }
}

.value-tag {
  display: inline-block;
  color: var(--darker);
  background-color: var(--light);
  border-radius: 3px;
  font-size: 12px;
  padding: 2px 7px;
  vertical-align: baseline;
  width: fit-content;

  i {
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
  backdrop-filter: blur(8px) brightness(0.4) contrast(0.7);
}

.title-bar {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: space-between;
  padding: 30px;

  .title-bar__right {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 30px;
  }
}

.btn {
  padding: 10px 15px;
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

  i {
    color: var(--dark);
    cursor: pointer;
    margin-left: 4px;
  }
}

.input-group {
  margin-bottom: 20px;
}

.time-period {
  width: 230px;
}

.chart-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 0;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
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
  margin-bottom: 20px;
  border-bottom: 1px solid var(--light);
  padding-bottom: 10px;
  width: fit-content;
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

  &.tab--active, &:hover {
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
    padding: 25px;
    border-bottom: 1px solid var(--light);
  }

  .modal__header-icon {
    color: var(--heading);
    font-size: 26px;
    margin-bottom: 30px;
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
    padding: 25px;
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
  padding: 0 30px;
}

.tracker-title {
  border-bottom: 2px solid transparent;
  padding-bottom: 2px;

  &:hover {
    border-bottom: 2px dotted var(--dark);
    cursor: pointer;
  }
}

</style>
