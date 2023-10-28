<template>

  <!-- OS Title Bar -->
  <osTitleBar />

  <!-- Left Sidebar -->
  <aside id="menu">

    <!-- Collection Selector -->
    <div class="collection-selector">
      <div class="collection-selector__icon">

      </div>
      <div class="collection-selector__meta">
        <div class="collection-selector__meta__name">
          <span>Collection Label</span>
        </div>
        <div class="collection-selector__meta__count">
          <span>0 upcoming goals</span>
        </div>
      </div>
      <div class="collection-selector__shortcut-indicator">
        <i class="fa-sharp fa-regular fa-slash-forward"></i>
      </div>
    </div>

    <!-- Metrics -->
    <div class="metric-nav-toggle" @click.prevent="toggleDisplayMetrics">
      <i class="fa-regular fa-chevron-down" v-if="displayMetrics"></i>
      <i class="fa-regular fa-chevron-up" v-if="!displayMetrics"></i>
      <span>Trackers</span>
    </div>
    <ul class="metric-nav" v-if="displayMetrics">
      <li class="tracker-nav-item">
        <span class="tracker-nav-item__label">Label</span>
        <span class="tracker-nav-item__records">0</span>
      </li>
      <li class="tracker-nav-item">
        <span class="tracker-nav-item__label">Label</span>
        <span class="tracker-nav-item__records">0</span>
      </li>
      <li class="tracker-nav-item">
        <span class="tracker-nav-item__label">Label</span>
        <span class="tracker-nav-item__records">0</span>
      </li>
      <li class="tracker-nav-item">
        <span class="tracker-nav-item__label">Label</span>
        <span class="tracker-nav-item__records">0</span>
      </li>
      <li class="tracker-nav-item">
        <span class="tracker-nav-item__label">Label</span>
        <span class="tracker-nav-item__records">0</span>
      </li>
    </ul>

  </aside>

  <!-- Main Content -->
  <main id="main">
    <h1 style="margin-bottom:5px">Telemetry for Windows <small
        v-if="systemInformation.version">v{{ systemInformation.version }}</small></h1>
    <p class="subtitle" v-if="systemInformation.uuid">Device Identity: {{ systemInformation.uuid }}</p>

    <dataGraph/>
  </main>

</template>

<script setup>

import {ref, onMounted} from 'vue';
import dataGraph from "./components/dataGraph.vue";
import OsTitleBar from "./components/osTitleBar.vue";

const systemInformation = ref({
  version: null,
  uuid: null
});

const displayMetrics = ref(true);

const toggleDisplayMetrics = () => {
  displayMetrics.value = !displayMetrics.value;
};

let metrics = ref([]);

onMounted(async () => {
  systemInformation.value = await window["electronAPI"].getSystemInformation();
});

</script>

<style lang="scss">

/* Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

$heading: #060a10;
$copy: #43556b;

body, html {
  background-color: white;
  position: relative;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: $copy;
  cursor: default;
}

h1, h2, h3, h4, h5, h6 {
  color: $heading;
  cursor: default;
  margin: 0;
}

p {
  margin: 0;
}

h1 {
  font-size: 18px;

  small {
    font-size: 16px;
    font-weight: 500;
    color: #9AB2D4;
  }
}

#menu {
  background-color: #F7F9FF;
  position: fixed;
  top: 40px;
  left: 0;
  bottom: 0;
  width: 340px;
}

.metric-nav-toggle {
  cursor: pointer;
  margin-top: 30px;
  padding: 10px;

  i {
    margin-right: 10px;
    width: 15px;
    padding-left: 25px;
    color: $copy;
  }

  span {
    font-size: 14px;
    font-weight: bold;
    color: $heading;
  }

  &:hover {

    i {
      color: $heading;
    }
  }
}

.metric-nav {
  list-style: none;
  padding: 0 20px 0 45px;
  margin: 0;
}

.tracker-nav-item {
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background-color: #ECEFF9;
  }

  span.tracker-nav-item__label {
    font-size: 13px;
    font-weight: 400;
    color: $heading;
  }

  span.tracker-nav-item__records {
    font-size: 12px;
    font-weight: 400;
    color: #9AB2D4;
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

.collection-selector {
  padding: 7px 15px 7px 10px;
  margin: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 15px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #ECEFF9;

    .collection-selector__shortcut-indicator {
      display: block;
    }
  }

  .collection-selector__icon {
    width: 56px;
    aspect-ratio: 1;
    background-color: #59DEC3;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      color: $heading;
      font-size: 24px;
    }
  }

  .collection-selector__meta__name {
    font-size: 14px;
    font-weight: bold;
    color: $heading;
    margin-bottom: 4px;
  }

  .collection-selector__meta__count {
    font-size: 12px;
    font-weight: 400;
    color: $copy;
  }

  .collection-selector__shortcut-indicator {
    font-size: 12px;
    color: white;
    background: #9AB2D4;
    padding: 5px 9px;
    border-radius: 3px;
    margin-left: auto;
    display: none;
    font-weight: 500;
  }

}

.subtitle {
  padding: 0;
  margin: 0;
}

</style>
