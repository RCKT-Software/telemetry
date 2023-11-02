<template>

  <!-- OS Title Bar -->
  <osTitleBar/>

  <!-- Navigation Panel  -->
  <navigationPanel/>

  <!-- Main Content -->
  <main id="main">
    <div class="center-content">

      <div class="title-bar">
        <div class="title-bar__left">

          <h1 style="margin-bottom:10px">Label <span class="value-tag" style="margin-left: 6px">0</span></h1>
          <div class="quick-stats">
            <div class="quick-stats__statistic">
              <i class="fa-sharp fa-regular fa-database"></i> <span>0 data points</span>
            </div>
            <div class="quick-stats__statistic">
              <i class="fa-sharp fa-regular fa-clock-rotate-left"></i> <span>Last updated just now</span>
            </div>
          </div>

        </div>
        <div class="title-bar__right">

          <button class="btn btn--primary">
            <i class="fa-sharp fa-regular fa-plus"></i>
            <span>Data point</span>
          </button>

          <select class="time-period">
            <i class="select__icon fa-sharp fa-regular fa-plus"></i>
            <option value="0">24 hours</option>
            <option value="0">3 days</option>
            <option value="0">7 days</option>
            <option value="0" selected>30 days</option>
            <option value="0">60 days</option>
            <option value="0">90 days</option>
            <option value="0">2023</option>
            <option value="0">All time</option>
          </select>

        </div>
      </div>

      <dataGraph/>


    </div>
  </main>

</template>

<script setup>

import {ref, onMounted} from 'vue';
import dataGraph from "./components/dataGraph.vue";
import OsTitleBar from "./components/layout/osTitleBar.vue";
import NavigationPanel from "./components/layout/navigationPanel.vue";

const systemInformation = ref({
  version: null,
  uuid: null
});

const displayMetrics = ref(true);

const toggleDisplayMetrics = () => {
  displayMetrics.value = !displayMetrics.value;
};

onMounted(async () => {
  systemInformation.value = await window["electronAPI"].getSystemInformation();
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
  overflow-y: auto;
  .center-content {
    max-width: 1140px;
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
      margin-right: 3px;
    }

    span {
      font-size: 12px;
      font-weight: 400;
      color: var(--darker);
    }
  }
}

.value-tag {
  color: var(--darker);
  background-color: var(--light);
  border-radius: 3px;
  font-size: 12px;
  padding: 2px 7px;
  vertical-align: baseline;
}

.overlay {
  position: fixed;
  top: 40px;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(190, 195, 205, 0.6);
  z-index: 9000;
  backdrop-filter: blur(2px);
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

  span {
    font-weight: 600;
    font-size: 14px;
  }

  &.btn--primary {
    background-color: var(--black);
    color: var(--lighter);

    &:hover {
      transform: scale(1.01);
      color: var(--white);
    }
  }
}

select {
  border: 1px solid var(--medium);
  border-radius: 5px;
  font-family: 'Inter', sans-serif;
  padding: 10px 15px;
  color: var(--darker);
  outline: none;
  min-width: 200px;
  font-weight: 500;
}

.time-period {
  width: 230px;
}


</style>
