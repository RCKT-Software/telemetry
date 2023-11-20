<template>
  <div class="titlebar-controls">
    <div class="titlebar-controls__left">
      <div class="titlebar-controls-menu" id="menu-toggle" @click.prevent="toggleNavigation">
        <i class="fa-light fa-bars"></i>
      </div>
      <h1>Telemetry</h1>
    </div>
    <div class="titlebar-controls__right">
      <div class="titlebar-controls-minimize" id="minimize-app" @click.prevent="minimizeApp">
        <i class="fa-light fa-window-minimize"></i>
      </div>
      <div class="titlebar-controls-maximize" id="maximize-app" @click.prevent="maximizeApp">
        <i class="fa-light fa-square"></i>
      </div>
      <div class="titlebar-controls-close" id="close-app" @click.prevent="closeApp">
        <i class="fa-light fa-xmark"></i>
      </div>
    </div>
  </div>
</template>

<script setup>

import {useInterfaceStore} from "../../stores/interface";

const minimizeApp = () => {
  window["electronAPI"].minimizeApp();
}

const maximizeApp = () => {
  window["electronAPI"].maximizeApp();
}

const closeApp = () => {
  window["electronAPI"].closeApp();
}

const interfaceStore = useInterfaceStore();

/**
 * Toggles the left-side navigation menu
 */
const toggleNavigation = () => {
  if (interfaceStore.isResponsive) {
    interfaceStore.responsiveNavigationOpen = !interfaceStore.responsiveNavigationOpen;
    if(interfaceStore.responsiveNavigationOpen) {
      interfaceStore.navigationOpen = true;
    }
  } else {
    interfaceStore.navigationOpen = !interfaceStore.navigationOpen;
    if(!interfaceStore.navigationOpen) {
      interfaceStore.responsiveNavigationOpen = false;
    }
  }
}

</script>

<style scoped lang="scss">
.titlebar-controls {
  width: 100%;
  z-index: 999;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 40px;
  background-color: var(--light);
  -webkit-user-select: none;
  -webkit-app-region: drag;

  h1 {
    padding-left: 6px;
    padding-top: 13px;
    font-size: 12px;
    font-weight: 500;
  }

  * {
    -webkit-app-region: no-drag;
  }

  .titlebar-controls__left, .titlebar-controls__right {
    display: flex;
    flex-wrap: nowrap;
  }
}

.titlebar-controls-close, .titlebar-controls-minimize, .titlebar-controls-maximize, .titlebar-controls-menu {
  color: var(--dark);
  font-size: 16px;
  padding: 12px 12px;
  width: 20px;
  display: flex;
  justify-content: center;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: var(--black);
    color: var(--white);
  }
}

.titlebar-controls-maximize {
  font-size: 14px;
  padding-top: 14px;
}
</style>
