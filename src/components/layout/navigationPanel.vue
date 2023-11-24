<template>
  <!-- Navigation Panel -->
  <aside id="menu"
         :class="{'menu--active': interfaceStore.isResponsive ? interfaceStore.responsiveNavigationOpen : interfaceStore.navigationOpen}">

    <collectionSelector/>

    <!-- Collection Control Bar -->
    <div class="collection-control">
      <i class="fa-sharp fa-regular fa-plus" title="New collection"
         @click.prevent="modalStore.openModal('collection')"></i>
      <i class="fa-sharp fa-regular fa-cog" title="Edit collection"
         @click.prevent="modalStore.openModal('collection', {collection: appDataStore.activeCollection})"></i>
      <!--      <i class="fa-sharp fa-regular fa-file-export" title="Export to CSV"></i>-->
      <i class="fa-sharp fa-regular fa-trash" title="Delete collection"
         @click.prevent="modalStore.openModal('delete-collection')"></i>
      <!--      <i class="fa-sharp fa-regular fa-trash" title="Delete tracker"
               @click.prevent="modalStore.openModal('delete-tracker')"></i>-->
    </div>

    <!-- Progress Trackers -->
    <div class="metric-nav-toggle" @click.prevent="toggleTrackers">
      <i class="fa-regular fa-chevron-down" v-if="showTrackers"></i>
      <i class="fa-regular fa-chevron-up" v-if="!showTrackers"></i>
      <span>All progress trackers</span>
    </div>
    <ul class="metric-nav" v-if="showTrackers && appDataStore.activeTracker">
      <li class="tracker-nav-item"
          :class="{'tracker-nav-item--active': tracker.id === appDataStore.activeTracker.id}"
          v-for="tracker in appDataStore.activeCollection.trackers"
          @click.prevent="appDataStore.activeCollection.setActiveTracker(tracker)">
        <span class="tracker-nav-item__label">{{ tracker.label }}</span>
        <span class="tracker-nav-item__records">{{ tracker.formattedCurrentValue }}</span>
      </li>
    </ul>
    <span class="tracker-add-button" title="Add a new progress tracker"
          @click.prevent="modalStore.openModal('progress-tracker')"><i
        class="fa-sharp fa-regular fa-plus"></i> New</span>

    <!-- Middle Divider -->
    <div class="divider divider__middle"/>

    <!-- Secondary Navigation Items -->
    <ul class="secondary-nav">
      <!--      <li class="secondary-nav__item">
              Trash
            </li>-->
      <!--      <li class="secondary-nav__item">
              Support
            </li>-->
      <li class="secondary-nav__item">
        <a href="#"
           @click.prevent="openLink('https://github.com/RCKT-Software/telemetry/issues')"
           target="_blank">Feedback</a>
      </li>
      <li class="secondary-nav__item">
        <a href="#"
           @click.prevent="openLink('https://github.com/RCKT-Software/telemetry')"
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
      <i class="fa-sharp fa-solid fa-moon" title="Toggle dark mode"
         v-if="appDataStore.darkMode"></i>
      <i class="fa-sharp fa-regular fa-sun-bright" title="Toggle dark mode"
         v-if="!appDataStore.darkMode"></i>
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

const appDataStore = useAppDataStore();
const modalStore = useModalStore();
const interfaceStore = useInterfaceStore();

/**
 * Open an external link in the default browser
 * @param url
 */
const openLink = (url) => {
  window.electronAPI.openLink(url);
}

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
      bottom: 135px;
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
  scroll-snap-align: start;

  &:hover, &.tracker-nav-item--active {
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

  i {
    font-size: 16px;
    color: var(--dark);
    cursor: pointer;
  }

  &:hover {

    i {
      color: var(--darker);
    }
  }
}

</style>
