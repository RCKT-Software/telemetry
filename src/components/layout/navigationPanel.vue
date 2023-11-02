<template>
  <!-- Navigation Panel -->
  <aside id="menu">

    <collectionSelector/>

    <!-- Collection Control Bar -->
    <div class="collection-control">
      <i class="fa-sharp fa-regular fa-plus" title="New progress tracker"></i>
      <i class="fa-sharp fa-regular fa-cog" title="Collection settings"></i>
      <i class="fa-sharp fa-regular fa-file-export" title="Export to CSV"></i>
      <i class="fa-sharp fa-regular fa-trash" title="Delete collection"></i>
    </div>

    <!-- Progress Trackers -->
    <div class="metric-nav-toggle" @click.prevent="toggleTrackers">
      <i class="fa-regular fa-chevron-down" v-if="showTrackers"></i>
      <i class="fa-regular fa-chevron-up" v-if="!showTrackers"></i>
      <span>All progress trackers</span>
    </div>
    <ul class="metric-nav" v-if="showTrackers">
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
</template>

<script setup>

import CollectionSelector from "../collectionSelector.vue";
import {onMounted, ref} from "vue";

const systemInformation = ref({
  version: null,
  uuid: null
});

const showTrackers = ref(true);

const toggleTrackers = () => {
  showTrackers.value = !showTrackers.value;
};

onMounted(async () => {
  systemInformation.value = await window["electronAPI"].getSystemInformation();
});

</script>

<style scoped lang="scss">

#menu {
  background-color:  var(--lighter);
  position: fixed;
  top: 40px;
  left: 0;
  bottom: 0;
  width: 340px;
  border-right: 1px solid var(--light);

  .version-number {
    font-size: 11px;
    position: absolute;
    bottom: 30px;
    right: 35px;
    color: var(--dark);
  }

  .divider {
    height: 1px;
    width: calc(100% - 65px);
    background-color: var(--medium);
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
    color: var(--dark);
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: var(--heading);
  }

  &:hover {

    i {
      color: var(--black);
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
  scrollbar-color: var(--medium);
  scrollbar-width: thin;

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
}

.tracker-add-button {
  color: var(--dark);
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
    color: var(--heading);
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
    background-color: var(--light);
  }

  span.tracker-nav-item__label {
    font-size: 14px;
    font-weight: 400;
    color: var(--heading);
  }

  span.tracker-nav-item__records {
    font-size: 12px;
    font-weight: 400;
    color: var(--dark);
  }
}

.collection-control {
  background-color: var(--light);
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
    color: var(--darker);
    font-size: 16px;
    cursor: pointer;
    transition: color 0.05s ease;

    &:hover {
      color: var(--black);
    }
  }
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
    color: var(--darker);

    &:hover {
      color: var(--black);
    }
  }
}

</style>
