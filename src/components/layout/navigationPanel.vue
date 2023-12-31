<template>
  <!-- Navigation Panel -->
  <aside id="menu"
         :class="{'menu--active': interfaceStore.isResponsive ? interfaceStore.responsiveNavigationOpen : interfaceStore.navigationOpen}">

    <collectionSelector/>

    <!-- Collection Control Bar -->
    <div class="collection-control">
      <Plus :size="16" @click.prevent="modalStore.openModal('progress-tracker')" />
      <FolderCog :size="16" @click.prevent="modalStore.openModal('collection', {collection: appDataStore.activeCollection})" />
      <FolderX :size="16" @click.prevent="modalStore.openModal('delete-collection')" v-if="appDataStore.collections.length > 1" />
    </div>

    <!-- Progress Trackers -->
    <div class="metric-nav-toggle" v-if="appDataStore.activeTracker">
      <span>All progress trackers</span>
    </div>
    <ul class="metric-nav" v-if="appDataStore.activeTracker">
      <li class="tracker-nav-item"
          :class="{'tracker-nav-item--active': tracker.id === appDataStore.activeTracker.id}"
          v-for="tracker in appDataStore.activeCollection.trackers"
          @click.prevent="appDataStore.activeCollection.setActiveTracker(tracker)">
        <span class="tracker-nav-item__label">{{ tracker.label }}</span>
        <span class="tracker-nav-item__records">{{ tracker.formattedCurrentValue }}</span>
      </li>
    </ul>
    <span class="tracker-add-button" title="Add a new progress tracker"
          @click.prevent="modalStore.openModal('progress-tracker')"><Plus :size="16" @click.prevent="modalStore.openModal('progress-tracker')" /> New tracker</span>

    <!-- Middle Divider -->
    <div class="divider divider__middle"/>

    <!-- Secondary Navigation Items -->
    <ul class="secondary-nav">
      <li class="secondary-nav__item">
        <a href="#"
           @click.prevent="interfaceStore.openLink('https://docs.telemetry.software')"
           target="_blank">Documentation</a>
      </li>
      <li class="secondary-nav__item">
        <a href="#"
           @click.prevent="interfaceStore.openLink('https://github.com/RCKT-Software/telemetry/issues')"
           target="_blank">Feedback</a>
      </li>
      <li class="secondary-nav__item">
        <a href="#"
           @click.prevent="interfaceStore.openLink('https://github.com/RCKT-Software/telemetry')"
           target="_blank">GitHub</a>
      </li>
      <!--      <li class="secondary-nav__item">
              Notifications
            </li>-->
    </ul>

    <!-- Bottom Divider -->
    <div class="divider divider__bottom"/>

    <!-- Dark Mode Toggle -->
    <div class="dark-mode-toggle" @click.prevent="toggleDarkMode">
      <Sun :size="16" v-if="!appDataStore.darkMode" />
      <Moon :size="16" v-if="appDataStore.darkMode" />
    </div>

    <!-- Version Number -->
    <span class="version-number">v{{ systemInformation.version }}</span>

  </aside>
</template>

<script setup>

import CollectionSelector from "../collectionSelector.vue";
import {onMounted, ref} from "vue";
import {useAppDataStore} from "../../stores/appData";
import {useModalStore} from "../../stores/modal";
import {useInterfaceStore} from "../../stores/interface";
import {Plus, FolderCog, FolderX, Sun, Moon} from "lucide-vue-next";

const systemInformation = ref({
  version: null,
  uuid: null
});

onMounted(async () => {
  systemInformation.value = await window["electronAPI"].getSystemInformation();
});

const appDataStore = useAppDataStore();
const modalStore = useModalStore();
const interfaceStore = useInterfaceStore();

/**
 * Allows the UI to toggle dark mode
 * @returns {Promise<void>}
 */
const toggleDarkMode = async () => {
  appDataStore.darkMode = !appDataStore.darkMode;
}

</script>

<style scoped lang="scss">

#menu {
  background-color: var(--lighter);
  position: fixed;
  top: 40px;
  left: 0;
  bottom: 0;
  width: 340px;
  border-right: 1px solid var(--light);
  z-index: 8000;
  transition: transform 0.1s ease-in-out;
  transform: translateX(-100%) translateZ(0);

  &.menu--active {
    transition: transform 0.2s ease-in-out;
    transform: none;
  }

  @media (max-width: 1481px) {
    transition: none;
    transform: translateX(-100%) translateZ(0);
  }

  .version-number {
    font-size: 11px;
    position: absolute;
    bottom: 30px;
    right: 35px;
    color: var(--dark);
  }

  .divider {
    width: calc(100% - 65px);
    background-color: var(--medium);
    margin-left: 30px;
    margin-top: 35px;
    margin-bottom: 35px;

    &.divider__middle {
      position: absolute;
      bottom: 160px;
    }

    &.divider__bottom {
      position: absolute;
      bottom: 35px;
    }
  }
}

.metric-nav-toggle {
  margin-top: 20px;
  padding: 10px;
  margin-left: 35px;

  span {
    font-size: 14px;
    font-weight: 600;
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
  color: var(--darker);
  font-size: 14px;
  display: flex;
  padding-top: 30px;
  padding-left: 35px;
  cursor: pointer;
  font-weight: 600;

  svg {
    padding-right: 8px;
  }

  &:hover {
    color: var(--heading);
  }
}

.tracker-nav-item {
  margin-left: -10px;
  padding: 10px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  scroll-snap-align: start;

  &:hover, &.tracker-nav-item--active {
    background-color: var(--light);

    span.tracker-nav-item__label {
      color: var(--heading);
    }
  }

  span.tracker-nav-item__label {
    font-size: 14px;
    font-weight: 400;
    color: var(--darker);
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

  svg {
    color: var(--darker);
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

.dark-mode-toggle {
  display: flex;
  width: 40px;
  height: 35px;
  border-radius: 5px;
  background-color: var(--light);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  left: 25px;

  svg {
    font-size: 16px;
    color: var(--dark);
    cursor: pointer;
  }

  &:hover {

    svg {
      color: var(--darker);
    }
  }
}



</style>
