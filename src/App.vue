<template>

  <!-- Collection Selector Popup -->
  <div class="collection-selector-popup" v-if="displayCollectionSelector">

  </div>

  <!-- Overlay -->
  <div class="overlay" @click.prevent="toggleDisplayCollectionSelector" v-if="displayCollectionSelector"/>

  <!-- OS Title Bar -->
  <osTitleBar/>

  <!-- Left Sidebar -->
  <aside id="menu">

    <!-- Collection Selector -->
    <div class="collection-selector" @click.prevent="toggleDisplayCollectionSelector">
      <div class="collection-selector__icon">
        <h1>CL</h1>
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
        <i class="fa-sharp fa-regular fa-angle-down"></i>
      </div>
    </div>

    <!-- Collection Control Bar -->
    <div class="collection-control">
      <i class="fa-sharp fa-regular fa-marker"></i>
      <i class="fa-sharp fa-regular fa-cog"></i>
      <i class="fa-sharp fa-regular fa-file-export"></i>
      <i class="fa-sharp fa-regular fa-trash"></i>
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
    <span class="tracker-add-button"><i class="fa-sharp fa-regular fa-plus"></i> New</span>

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

const systemInformation = ref({
  version: null,
  uuid: null
});

const displayMetrics = ref(true);

const toggleDisplayMetrics = () => {
  displayMetrics.value = !displayMetrics.value;
};

const displayCollectionSelector = ref(false);

const toggleDisplayCollectionSelector = () => {
  displayCollectionSelector.value = !displayCollectionSelector.value;
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
  padding-top: 10px;
  padding-left: 35px;
  cursor: pointer;
  transition: color 0.05s ease;

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
  transition: background-color 0.05s ease;

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

    h1 {
      margin: 0 !important;
      color: white;
    }

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
    background: #101828;
    padding: 6px 8px;
    border-radius: 3px;
    margin-left: auto;
    display: none;
    font-weight: 500;
  }

}

.collection-control{
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

  i{
    color: $copy;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.05s ease;

    &:hover{
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

.collection-selector-popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  position: absolute;
  top: 60px;
  left: 20px;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 3px, rgba(0, 0, 0, 0.01) 0 1px 4px 0;
  z-index: 9050;
  width: 430px;
  height: 200px;
}


</style>
