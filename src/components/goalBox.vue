<template>
  <div class="goal-box">
    <span class="goal-box__label">Goal</span>
    <span class="goal-box__edit">Edit</span>
    <h1 class="goal-box__heading">0 <span>by Jan 1</span></h1>
    <div class="goal-box__chart"></div>
    <div class="goal-box__stats">
      <div class="goal-box__stats-item">
        <span class="goal-box__stats-item-label">Daily avg.</span>
        <span class="goal-box__stats-item-value value-tag value-tag--success"><i class="fa-sharp fa-solid fa-angle-up"></i> +0</span>
      </div>
      <div class="goal-box__stats-item">
        <span class="goal-box__stats-item-label">Deadline</span>
        <span class="goal-box__stats-item-value value-tag"><i class="fa-sharp fa-regular fa-calendar"></i> 0 days</span>
      </div>
    </div>
    <div class="divider"/>
    <div class="goal-box__prediction-item">
      <span class="goal-box__prediction-item-label">Predicted</span>
      <h1 class="goal-box__prediction-item-value">Jan 1, 2024</h1>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.goal-box {
  background-color: white;
  width: 290px;
  padding: 20px 30px 20px 20px;
  position: relative;
  border-bottom: 1px solid var(--light);

  .goal-box__label {
    font-weight: 600;
    font-size: 12px;
    display: block;
    margin-bottom: 5px;
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
      font-size: 18px;
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

    &:last-child {
      text-align: right;
    }

    .goal-box__stats-item-value {
      font-weight: 600;
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

    .goal-box__stats-item-value {
      font-weight: 600;
    }
  }
}
</style>