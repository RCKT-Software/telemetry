<template>

  <!-- OS Title Bar -->
  <osTitleBar/>

  <!-- Navigation Panel  -->
  <navigationPanel/>

  <!-- Main Content -->
  <main id="main">
    <h1 style="margin-bottom:10px">Label <span class="value-tag" style="margin-left: 6px">0</span></h1>
    <div class="quick-stats">
      <div class="quick-stats__statistic">
        <i class="fa-sharp fa-regular fa-database"></i> <span>0 data points</span>
      </div>
      <div class="quick-stats__statistic">
        <i class="fa-sharp fa-regular fa-clock-rotate-left"></i> <span>Last updated just now</span>
      </div>
    </div>

    <dataGraph/>
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
  position: fixed;
  top: 40px;
  left: 340px;
  bottom: 0;
  right: 0;
  padding: 30px 30px 0;
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


</style>
