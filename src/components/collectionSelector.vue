<template>

  <!-- Collection Selector Popup -->
  <Teleport to="body">

    <div class="collection-selector-popup" v-if="displayCollectionSelector">

      <!-- Example Item -->
      <div class="collection-item" @click.prevent="toggleDisplayCollectionSelector">
        <span class="value-tag" style="margin-left: 6px">Selected</span>
        <div class="collection-item__icon">
          <h1>CL</h1>
        </div>
        <div class="collection-item__meta">
          <div class="collection-item__meta__name">
            <span>Collection Label</span>
          </div>
          <div class="collection-item__meta__count">
            <span>0 upcoming goals</span>
          </div>
        </div>
        <div class="collection-item__shortcut-indicator">
          <i class="fa-sharp fa-regular fa-angle-down"></i>
        </div>
      </div>

      <!-- Example Item -->
      <div class="collection-item" @click.prevent="toggleDisplayCollectionSelector">
        <div class="collection-item__icon">
          <h1>CL</h1>
        </div>
        <div class="collection-item__meta">
          <div class="collection-item__meta__name">
            <span>Collection Label</span>
          </div>
          <div class="collection-item__meta__count">
            <span>0 upcoming goals</span>
          </div>
        </div>
        <div class="collection-item__shortcut-indicator">
          <i class="fa-sharp fa-regular fa-angle-down"></i>
        </div>
      </div>

      <!-- Example Item -->
      <div class="collection-item" @click.prevent="toggleDisplayCollectionSelector">
        <div class="collection-item__icon">
          <h1>CL</h1>
        </div>
        <div class="collection-item__meta">
          <div class="collection-item__meta__name">
            <span>Collection Label</span>
          </div>
          <div class="collection-item__meta__count">
            <span>0 upcoming goals</span>
          </div>
        </div>
        <div class="collection-item__shortcut-indicator">
          <i class="fa-sharp fa-regular fa-angle-down"></i>
        </div>
      </div>

      <!-- Example Item -->
      <div class="collection-item" @click.prevent="toggleDisplayCollectionSelector">
        <div class="collection-item__icon">
          <h1>CL</h1>
        </div>
        <div class="collection-item__meta">
          <div class="collection-item__meta__name">
            <span>Collection Label</span>
          </div>
          <div class="collection-item__meta__count">
            <span>0 upcoming goals</span>
          </div>
        </div>
        <div class="collection-item__shortcut-indicator">
          <i class="fa-sharp fa-regular fa-angle-down"></i>
        </div>
      </div>

      <!-- Example Item -->
      <div class="collection-item" @click.prevent="toggleDisplayCollectionSelector">
        <div class="collection-item__icon">
          <h1>CL</h1>
        </div>
        <div class="collection-item__meta">
          <div class="collection-item__meta__name">
            <span>Collection Label</span>
          </div>
          <div class="collection-item__meta__count">
            <span>0 upcoming goals</span>
          </div>
        </div>
        <div class="collection-item__shortcut-indicator">
          <i class="fa-sharp fa-regular fa-angle-down"></i>
        </div>
      </div>

      <div class="collection-selector-popup__footer">
        <button class="btn">+ New collection</button>
      </div>

    </div>

    <!-- Overlay -->
    <div class="overlay" @click.prevent="toggleDisplayCollectionSelector" v-if="displayCollectionSelector"/>

  </Teleport>

  <!-- Collection Selector -->
  <div class="collection-selector" @click.prevent="toggleDisplayCollectionSelector">
    <div class="collection-item">
      <div class="collection-item__icon">
        <h1>CL</h1>
      </div>
      <div class="collection-item__meta">
        <div class="collection-item__meta__name">
          <span>Collection Label</span>
        </div>
        <div class="collection-item__meta__count">
          <span>0 upcoming goals</span>
        </div>
      </div>
      <div class="collection-item__shortcut-indicator">
        <i class="fa-sharp fa-regular fa-angle-down"></i>
      </div>
    </div>
  </div>

</template>

<script setup>

import {ref} from "vue";

const displayCollectionSelector = ref(false);

const toggleDisplayCollectionSelector = () => {
  displayCollectionSelector.value = !displayCollectionSelector.value;
};

</script>

<style scoped lang="scss">

.collection-selector {
  padding: 7px 15px 7px 10px;
  margin: 20px;
  border-radius: 8px;
  transition: background-color 0.05s ease;

  &:hover {
    background-color: var(--light);

    .collection-item__shortcut-indicator {
      display: block;
    }
  }


}

.collection-item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 15px;
  align-items: center;
  cursor: pointer;

  .collection-item__icon {
    width: 56px;
    aspect-ratio: 1;
    background-color: var(--primary);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

    h1 {
      margin: 0 !important;
      color: var(--white);
      cursor: pointer;
    }

    i {
      color: var(--black);
      font-size: 24px;
    }
  }

  .collection-item__meta__name {
    font-size: 14px;
    font-weight: bold;
    color: var(--heading);
    margin-bottom: 4px;
  }

  .collection-item__meta__count {
    font-size: 12px;
    font-weight: 400;
    color: var(--darker);
  }

  .collection-item__shortcut-indicator {
    font-size: 12px;
    color: var(--dark);
    border-radius: 3px;
    margin-left: auto;
    display: none;
    font-weight: 500;
  }

}

.collection-selector-popup {
  background-color: var(--white);
  padding: 0;
  border-radius: 8px;
  position: absolute;
  top: 60px;
  left: 20px;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 3px, rgba(0, 0, 0, 0.01) 0 1px 4px 0;
  z-index: 9050;
  width: 390px;

  .collection-item {
    transition: transform 0.1s ease;
    position: relative;
    margin: 20px;

    .value-tag {
      position: absolute;
      top: 8px;
      right: 0;
      font-weight: 500;
    }

    &:hover {
      transform-origin: center left;
      transform: translateX(2px);
    }
  }

  .collection-item:not(:last-child) {
    margin-bottom: 20px;
  }
}


</style>
