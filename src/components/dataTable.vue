<template>
  <table class="datapoints-table">
    <thead>
    <tr>
      <th style="width: 300px">Date / time</th>
      <th style="width: 150px">{{ appDataStore.activeTracker.label }}</th>
      <th style="width: 100px">Change</th>
      <th style="width: 30px"></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="dataPoint in sortedDataPoints">
      <td style="width: 300px">{{
          Date.create(dataPoint.createdAt).full()
        }}
      </td>
      <td style="width: 150px"><span class="value-tag"> {{ formatValue(dataPoint.value, appDataStore.activeTracker.numberFormat) }} </span></td>
      <td style="width: 100px"><span class="value-tag">
        <ChevronUp :size="14" v-if="dataPoint.difference > 0" style="padding-right: 5px" />
        <ChevronDown :size="14" v-if="dataPoint.difference < 0" style="padding-right: 5px" />
         {{ formatValue(dataPoint.difference, appDataStore.activeTracker.numberFormat) }}</span></td>
      <td>
        <X :size="16" class="datapoints-table__delete" @click.prevent="appDataStore.activeTracker.deleteDataPoint(dataPoint.id)" />
      </td>
    </tr>
    <tr v-if="sortedDataPoints.length < 1">
      <td style="padding: 20px; color:var(--dark)">
        No data points have been captured yet.
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script setup>

import {formatValue} from "../utility/helpers";
import {useAppDataStore} from "../stores/appData";
import {computed} from "vue";
import {ChevronUp, ChevronDown, Minus, X} from "lucide-vue-next";

const appDataStore = useAppDataStore();

/**
 * Sort the data points by date/time.
 */
const sortedDataPoints = computed(() => {
  let dataPoints = [...appDataStore.activeTracker.recentDataPoints];
  dataPoints.sort((a, b) => {
    return Date.create(b.createdAt).getTime() - Date.create(a.createdAt).getTime();
  });
  dataPoints = dataPoints.slice(0, 50);
  for (let i = 0; i < dataPoints.length; i++) {
    if(dataPoints[i + 1]) {
      dataPoints[i].difference = dataPoints[i].value - dataPoints[i + 1].value;
    }else{
      dataPoints[i].difference = 0;
    }
  }
  return dataPoints;
});

</script>

<style scoped lang="scss">

.datapoints-table {
  background-color: var(--lighter);
  border: 1px solid var(--light);
  border-radius: 5px;
  width: 775px;
  margin-bottom: 40px;
  padding: 0;

  thead{
    border-bottom: 1px solid var(--medium);
    display: block;
  }

  th{
    text-align: left;
    padding: 10px 0;
    font-weight: 600;
  }

  tr {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 3px 5px 3px 20px;
    color: var(--darker);
    border-bottom: 1px solid var(--medium);

    &:last-child {
      border-radius: 0 0 5px 5px;
      border-bottom: none;
    }

    &:hover {
      background-color: var(--light);

      .datapoints-table__delete {
        color: var(--darker);
      }
    }

    .datapoints-table__delete {
      color: var(--medium);
      padding: 10px;
      cursor: pointer;
    }
  }
}

.datapoints-table__title {
  margin-left: 25px;
  margin-bottom: 20px;
  color: var(--heading);
}

</style>
