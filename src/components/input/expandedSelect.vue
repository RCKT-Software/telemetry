<template>

  <ul class="expanded-select">

    <li class="expanded-select__item expanded-select__item--selected">
      <i class="fa-sharp fa-regular fa-chart-line expanded-select__icon"></i>
      <div class="expanded-select__content">
        <h1 class="expanded-select__title">Single Number</h1>
        <span class="expanded-select__description">Track a value over time.</span>
      </div>
    </li>

    <li class="expanded-select__item">
      <i class="fa-sharp fa-regular fa-tally expanded-select__icon"></i>
      <div class="expanded-select__content">
        <h1 class="expanded-select__title">Running Total</h1>
        <span class="expanded-select__description">Add values together to get a total.</span>
      </div>
    </li>

  </ul>

</template>

<script setup>

</script>

<style scoped lang="scss">

.expanded-select {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 5px;

  &:hover {
    .expanded-select__item {
      opacity: 0.7;
    }
  }

  .expanded-select__item {
    background-color: var(--white);
    border-radius: 8px;
    border: 1px solid var(--medium);
    margin: 0;
    padding: 18px 20px;
    cursor: pointer;
    position: relative;
    transition: opacity 0.05s ease;

    * {
      cursor: pointer;
    }

    .expanded-select__icon {
      position: absolute;
      font-size: 24px;
      color: var(--black);
      top: 22px;
    }

    .expanded-select__content {
      padding-left: 45px;
    }

    .expanded-select__title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .expanded-select__description {
      font-size: 12px;
      font-weight: 400;
      color: var(--darker);
    }

    &:hover {
      border-color: var(--dark);
      opacity: 1;
    }

    &.expanded-select__item--selected {
      border: 2px solid var(--black);
    }
  }
}

</style>
