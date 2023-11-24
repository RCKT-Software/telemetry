<template>
  <div class="goal-box" v-if="appDataStore.activeGoal">
    <span class="goal-box__label">Goal</span>
    <span class="goal-box__edit"
          @click.prevent="modalStore.openModal('goal', {goal: appDataStore.activeGoal})">Edit</span>
    <h1 class="goal-box__heading">
      {{ appDataStore.activeGoal.formattedTargetValue }}<br><span
        v-if="appDataStore.activeGoal.deadline">Deadline: {{ appDataStore.activeGoal.formattedDeadline }}</span>
    </h1>
    <div class="goal-box__chart"></div>
    <div class="goal-box__stats">
      <div class="goal-box__stats-item">
        <span class="goal-box__stats-item-label">Best Fit</span>
        <span class="goal-box__stats-item-value value-tag"><i
            class="fa-sharp fa-regular fa-function"></i> {{ appDataStore.activeTracker.regressionData.name }}</span>
      </div>
      <div class="goal-box__stats-item" v-if="appDataStore.activeGoal.deadline">
        <span class="goal-box__stats-item-label">R2</span>
        <span class="goal-box__stats-item-value value-tag"><i
            class="fa-sharp fa-regular fa-square-root-variable"></i> {{
            Math.floor(appDataStore.activeTracker.regressionData.calculation.r2 * 100)
          }}% </span>
      </div>
    </div>
    <div class="divider"/>
    <div class="goal-box__prediction-item">
      <span class="goal-box__prediction-item-label value-tag value-tag--success">Prediction</span>
      <h1 class="goal-box__prediction-item-value">{{ appDataStore.activeGoal.formattedPredicted }}</h1>
    </div>
  </div>
  <div class="goal-box" v-if="!appDataStore.activeGoal">
    <span class="goal-box__edit" @click.prevent="modalStore.openModal('goal')">New Goal</span>
    <h1 class="goal-box__heading">No goal set</h1>
  </div>
</template>

<script setup>

import {useAppDataStore} from "../stores/appData";
import {useModalStore} from "../stores/modal";

const appDataStore = useAppDataStore();
const modalStore = useModalStore();

</script>

<style scoped lang="scss">
.goal-box {
  background-color: var(--white);
  width: 290px;
  padding: 20px 30px 20px 20px;
  position: relative;
  height: 370px;
  overflow-y: hidden;

  .goal-box__label {
    font-weight: 600;
    font-size: 14px;
    display: block;
    margin-bottom: 5px;
    color: var(--darker);
  }

  .goal-box__edit {
    font-weight: 400;
    font-size: 12px;
    display: block;
    position: absolute;
    top: 30px;
    right: 30px;
    color: var(--darker);
    transition: color 0.05s ease;
    cursor: pointer;

    &:hover {
      color: var(--black);
      text-decoration: underline;
    }
  }

  .goal-box__heading {
    font-size: 22px;
    margin-bottom: 20px;

    span {
      color: var(--dark);
      font-size: 14px;
    }
  }

  .goal-box__chart {
    width: 100%;
    aspect-ratio: 2.3;
    background-color: var(--light);
    margin-bottom: 20px;
    display: block;
    border-radius: 5px;
  }

  .goal-box__stats {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .goal-box__stats-item {
    font-size: 12px;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 4px;
    max-width: calc(50% - 4px);

    .goal-box__stats-item-label {
      color: var(--darker);
      display: block;
      margin-bottom: 2px;
      font-weight: 500;
    }

    &:nth-child(2) {
      text-align: right;
    }

    .goal-box__stats-item-value {
      font-weight: 600;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
  }

  .goal-box__prediction-item {
    margin-top: 20px;
    font-size: 12px;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 4px;

    .goal-box__prediction-item-label {
      font-weight: 600;
      display: block;
      margin-bottom: 2px;
    }

    .goal-box__prediction-item-value {
      font-weight: 600;
      color: var(--heading);
    }
  }
}
</style>
