<template>
  <div class="goal-box" v-if="appDataStore.activeGoal">
    <span class="goal-box__label"><Flag :size="18" /> Goal</span>
    <span class="goal-box__edit"
          @click.prevent="modalStore.openModal('goal', {goal: appDataStore.activeGoal})">Edit</span>
    <h1 class="goal-box__heading">
      {{ appDataStore.activeGoal.formattedTargetValue }}<br><span
        v-if="appDataStore.activeGoal.deadline">Deadline: {{ appDataStore.activeGoal.formattedDeadline }}</span>
    </h1>
    <div class="divider" style="margin-bottom: 20px"/>
    <div class="goal-box__prediction-item">
      <span class="goal-box__prediction-item-label value-tag value-tag--success">Predicted Completion</span>
      <h1 class="goal-box__prediction-item-value">{{ appDataStore.activeGoal.formattedPredicted }}</h1>
    </div>
    <div class="divider" style="margin-bottom: 30px"/>
    <div class="goal-box__stats">
      <div class="goal-box__stats-item">
        <span class="goal-box__stats-item-label">Regression Mode</span>
        <span class="goal-box__stats-item-value value-tag"><FunctionSquare :size="14" /> Auto ({{ appDataStore.activeTracker.regressionData.name }})</span>
      </div>
      <div class="goal-box__stats-item">
        <span class="goal-box__stats-item-label">Accuracy</span>
        <span class="goal-box__stats-item-value value-tag"><Calculator :size="14" /> {{
            appDataStore.activeGoal.accuracy
          }}% </span>
      </div>
    </div>
    <div class="goal-box__stats">
      <div class="goal-box__stats-item">
        <span class="goal-box__stats-item-label">Expected</span>
        <span class="goal-box__stats-item-value value-tag"><CalendarClock :size="14" /> {{appDataStore.activeGoal.predicted.relative()}}</span>
      </div>
      <div class="goal-box__stats-item">
        <span class="goal-box__stats-item-label">Remaining</span>
        <span class="goal-box__stats-item-value value-tag"><Diff :size="14" /> {{ appDataStore.activeGoal.formattedRemaining }} </span>
      </div>
    </div>
  </div>
  <div class="goal-box goal-box--empty"
       :class="{'goal-box--has-data': appDataStore.activeTracker.recentDataPoints.length > 0}"
       v-if="!appDataStore.activeGoal">
    <h1 class="goal-box__heading">No goal set</h1>
    <button class="btn" @click.prevent="modalStore.openModal('goal')">
      <span>Set a goal</span>
    </button>
  </div>
</template>

<script setup>

import {useAppDataStore} from "../stores/appData";
import {useModalStore} from "../stores/modal";
import {FunctionSquare, Calculator, Flag, Diff, CalendarClock} from "lucide-vue-next";

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

  &.goal-box--has-data {
    background-color: var(--lighter) !important;
  }

  &.goal-box--empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border-radius: 5px;

    .goal-box__heading {
      font-size: 14px;
      color: var(--darker);
      margin-bottom: 30px;
    }
  }

  .goal-box__label {
    font-weight: 600;
    font-size: 14px;
    display: block;
    margin-bottom: 5px;
    color: var(--darker);
    display: flex;
    align-items: center;
    gap: 5px;
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

    .goal-box__stats-item-label {
      color: var(--darker);
      display: block;
      margin-bottom: 2px;
      font-weight: 500;
    }

    &:nth-child(2) {
      text-align: right;
      align-items: flex-end;
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
    margin-bottom: 20px;

    .goal-box__prediction-item-label {
      font-weight: 600;
      display: block;
      margin-bottom: 5px;
      margin-left: -5px;
    }

    .goal-box__prediction-item-value {
      font-weight: 600;
      font-size: 22px;
      color: var(--heading);
    }
  }
}
</style>
