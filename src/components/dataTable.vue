<template>
  <label class="datapoints-table__title">Captured Data</label>
  <table class="datapoints-table">
    <tbody>
    <tr v-for="dataPoint in sortedDataPoints">
      <td style="width: 300px">{{
          Date.create(dataPoint.createdAt).full()
        }}
      </td>
      <td style="width: 100px">{{ formatValue(dataPoint.value, appDataStore.activeTracker.numberFormat) }}</td>
      <td><i class="fa-sharp fa-regular fa-times datapoints-table__delete" @click.prevent="appDataStore.activeTracker.deleteDataPoint(dataPoint.id)"></i></td>
    </tr>
    </tbody>
  </table>
</template>

<script setup>

import {formatValue} from "../utility/helpers";
import {useAppDataStore} from "../stores/appData";
import {computed} from "vue";

const appDataStore = useAppDataStore();

/**
 * Sort the data points by date/time.
 */
const sortedDataPoints = computed(() => {
  return [...appDataStore.activeTracker.recentDataPoints].sort((a, b) => {
    return Date.create(b.createdAt).getTime() - Date.create(a.createdAt).getTime();
  });
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

  tr {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 20px;
    color: var(--darker);

    &:first-child {
      border-radius: 5px 5px 0 0;
      color: var(--heading);
      font-weight: 600;

      td:nth-child(2){
        font-size: 14px;
      }
    }

    &:last-child {
      border-radius: 0 0 5px 5px;
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
  color: var(--darker);
}

</style>
