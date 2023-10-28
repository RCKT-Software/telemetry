<template>
  <div class="titlebar-controls">
    <div class="titlebar-controls__left">
      <div class="titlebar-controls-menu" id="menu-toggle">
        <i class="fa-light fa-bars"></i>
      </div>
      <h1>Telemetry</h1>
    </div>
    <div class="titlebar-controls__right">
      <div class="titlebar-controls-minimize" id="minimize-app">
        <i class="fa-light fa-window-minimize"></i>
      </div>
      <div class="titlebar-controls-maximize" id="maximize-app">
        <i class="fa-light fa-square"></i>
      </div>
      <div class="titlebar-controls-close" id="close-app">
        <i class="fa-light fa-xmark"></i>
      </div>
    </div>
  </div>
</template>

<script setup>

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
  background-color: #EEF2FD;
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
  color: #787F95;
  font-size: 16px;
  padding: 12px 12px;
  width: 20px;
  display: flex;
  justify-content: center;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #101828;
    color: white;
  }
}

.titlebar-controls-maximize {
  font-size: 14px;
  padding-top: 14px;
}
</style>
