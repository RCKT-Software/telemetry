<template>

  <!-- OS Title Bar -->
  <osTitleBar/>

  <!-- Left Sidebar -->
  <aside id="menu">

    <collectionSelector/>

    <!-- Collection Control Bar -->
    <div class="collection-control">
      <i class="fa-sharp fa-regular fa-plus" title="New progress tracker"></i>
      <i class="fa-sharp fa-regular fa-cog" title="Collection settings"></i>
      <i class="fa-sharp fa-regular fa-file-export" title="Export to CSV"></i>
      <i class="fa-sharp fa-regular fa-trash" title="Delete collection"></i>
    </div>

    <!-- Metrics -->
    <div class="metric-nav-toggle" @click.prevent="toggleDisplayMetrics">
      <i class="fa-regular fa-chevron-down" v-if="displayMetrics"></i>
      <i class="fa-regular fa-chevron-up" v-if="!displayMetrics"></i>
      <span>All progress trackers</span>
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
    <span class="tracker-add-button" title="Add a new progress tracker"><i class="fa-sharp fa-regular fa-plus"></i> New</span>

    <!-- Middle Divider -->
    <div class="divider divider__middle"/>

    <!-- Secondary Navigation Items -->
    <ul class="secondary-nav">
      <li class="secondary-nav__item">
        Trash
      </li>
      <li class="secondary-nav__item">
        Support
      </li>
      <li class="secondary-nav__item">
        Feedback
      </li>
      <li class="secondary-nav__item">
        Notifications
      </li>
    </ul>

    <!-- Bottom Divider -->
    <div class="divider divider__bottom"/>

    <!-- Version Number -->
    <span class="version-number">{{ systemInformation.uuid }} / v{{ systemInformation.version }}</span>

  </aside>

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
import OsTitleBar from "./components/osTitleBar.vue";
import CollectionSelector from "./components/collectionSelector.vue";

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

$heading: #060a10;
$copy: #43556b;
$medium: #E1E6F5;
$light: #EEF2FD;

body, html {
  background-color: white;
  position: relative;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: $copy;
  cursor: default;

  * {
    user-select: none;
  }
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
  font-size: 20px;
  font-weight: 600;

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

  .version-number {
    font-size: 11px;
    position: absolute;
    bottom: 30px;
    right: 35px;
    color: #9AB2D4;
  }

  .divider {
    height: 1px;
    width: calc(100% - 65px);
    background-color: #E1E6F5;
    margin-left: 30px;
    margin-top: 35px;
    margin-bottom: 35px;

    &.divider__middle {
      position: absolute;
      bottom: 190px;
    }

    &.divider__bottom {
      position: absolute;
      bottom: 35px;
    }
  }
}

.metric-nav-toggle {
  cursor: pointer;
  margin-top: 10px;
  padding: 10px;

  i {
    margin-right: 10px;
    width: 15px;
    padding-left: 25px;
    color: $copy;
  }

  span {
    font-size: 14px;
    font-weight: 500;
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
  max-height: calc(100vh - 530px);
  overflow-y: scroll;
  scroll-snap-type: y proximity;
  scrollbar-color: $medium;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-clip: content-box;
    background-color: $medium;
    border: 1px solid transparent;
    border-radius: 8px;
  }
}

.tracker-add-button {
  color: #9AB2D4;
  font-size: 14px;
  display: block;
  padding-top: 12px;
  padding-left: 35px;
  cursor: pointer;
  transition: color 0.05s ease;
  font-weight: 500;

  i {
    padding-right: 8px;
  }

  &:hover {
    color: $heading;
  }
}

.tracker-nav-item {
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.05s ease;
  scroll-snap-align: start;

  &:hover {
    background-color: #ECEFF9;
  }

  span.tracker-nav-item__label {
    font-size: 14px;
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

.collection-control {
  background-color: $light;
  padding: 12px 12px 12px 20px;
  margin-left: 25px;
  border-radius: 8px 0 0 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  flex-direction: row;
  flex-wrap: nowrap;

  i {
    color: $copy;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.05s ease;

    &:hover {
      color: $heading;
    }
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
      color: #475467;
    }
  }
}

.value-tag {
  color: #475467;
  background-color: #EEF1FD;
  border-radius: 3px;
  font-size: 12px;
  padding: 2px 7px;
  vertical-align: baseline;
}

h1 {

  .value-tag {
    padding: 3px 8px;
    font-size: 14px;
  }
}

#menu {
  border-right: 1px solid #EEF2FD;
}

.secondary-nav {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 90px;
  left: 30px;

  .secondary-nav__item {
    font-size: 14px;
    font-weight: 400;
    padding: 6px 0;
    transition: color 0.1s ease;
    cursor: pointer;

    &:hover {
      color: $heading;
    }
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
  background-color: rgba(190, 195, 205, 0.6);
  z-index: 9000;
  backdrop-filter: blur(2px);
}


</style>
