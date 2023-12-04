import {computed, ref} from "vue";
import {v4 as uuidv4} from 'uuid';
import Sugar from 'sugar';
import {formatValue} from "../utility/helpers";
import {useAppDataStore} from "../stores/appData";

Sugar.extend();

export function useGoal(config = {
    id: null,
    createdAt: null,
    trackerId: null,
    targetValue: 0,
    deadline: new Date()
}) {

    /**
     * The state to persist between application restarts
     */
    const serializeState = () => {
        return {
            id: id,
            targetValue: targetValue.value,
            deadline: deadline.value,
            trackerId: trackerId.value,
            createdAt: createdAt.valueOf()
        };
    };

    /**
     * The assigned ID of the goal
     */
    const id = config.id || uuidv4();

    /**
     * When was this goal created?
     * @type {Date}
     */
    const createdAt = Date.create(config.createdAt) || Date.create();

    /**
     * The tracker ID
     * @type {null}
     */
    const trackerId = ref(config.trackerId || null);

    /**
     * A reference to the tracker that this goal belongs to, hydrated by the tracker
     * @type {null}
     */
    const parentTracker = computed(() => {
        return useAppDataStore().getTrackerById(trackerId.value);
    });

    /**
     * The goal's target value
     */
    const targetValue = ref(config.targetValue || 0);

    /**
     * The goal's deadline, represented as a Date object
     */
    const deadline = ref(config.deadline || false);

    /**
     * Predicted completion date of the goal
     */
    const predicted = computed(() => {
        if (parentTracker?.value) {
            if (parentTracker.value.regressionData.calculation.predictX(parseFloat(targetValue.value))) {
                return new Date.create(parentTracker.value.regressionData.calculation.predictX(parseFloat(targetValue.value))[0] + parentTracker.value.xOffset);
            }
        }
        return false;
    });

    /**
     * The remaining value needed to reach the goal
     */
    const remaining = computed(() => {
        if (parentTracker?.value) {
            return targetValue.value - parentTracker.value.currentValue;
        }
    })

    /**
     * The estimated accuracy of the prediction
     * Decays the confidence based on the proximity to the goal
     * Decays 20% per duration of the total dataset past the last point, up to 50% of the r2
     * For example: 30 days of history would mean a prediction 30 days in the future is 20% less accurate
     */
    const accuracy = computed(() => {
        if (parentTracker?.value?.regressionData?.calculation?.points.length) {
            const baseConfidence = parentTracker.value.regressionData.calculation.r2 * 100;
            const daysInDataset = parentTracker.value.regressionData.calculation.points[parentTracker.value.regressionData.calculation.points.length - 1][0] / 86400000;
            const dailyDecayRate = 20 / daysInDataset;
            const daysUntilPrediction = predicted.value ? predicted.value.daysFromNow() : 0;
            const timePenalty = daysUntilPrediction * dailyDecayRate;
            let confidenceScore = baseConfidence - Math.min(timePenalty, baseConfidence / 2);
            confidenceScore = Math.floor(Math.min(confidenceScore, 99));
            return Math.max(0, confidenceScore);
        }
        return false;
    });

    /**
     * The formatted version of the target value
     */
    const formattedTargetValue = computed(() => {
        return formatValue(targetValue.value, parentTracker.value.numberFormat);
    });

    const formattedRemaining = computed(() => {
        return formatValue(remaining.value, parentTracker.value.numberFormat);
    });

    /**
     * The formatted version of the deadline
     */
    const formattedDeadline = computed(() => {
        if (deadline.value) {
            return new Date(deadline.value).medium();
        } else {
            return 'No deadline set';
        }
    });

    /**
     * The formatted version of the deadline (relative)
     */
    const formattedRelativeDeadline = computed(() => {
        if (deadline.value) {
            return new Date(deadline.value).relative();
        } else {
            return 'No deadline set';
        }
    });

    /**
     * Determines whether a valid prediction is available for the goal
     */
    const isPredictionValid = computed(() => {
        return !!(predicted?.value && predicted.value.isAfter(createdAt));

    })

    /**
     * Determines whether the goal is completed or not
     */
    const isCompleted = computed(() => {
        return !!(predicted.value && (!predicted.value.isFuture()));
    });

    /**
     * The formatted version of the predicted completion of the goal
     */
    const formattedPredicted = computed(() => {
        if (isPredictionValid.value) {
            if (!isCompleted.value) {
                return predicted.value.medium();
            } else {
                return 'Completed ' + predicted.value.short()
            }
        } else {
            return 'No prediction available';
        }
    })

    return {
        id,
        createdAt,
        trackerId,
        targetValue,
        deadline,
        predicted,
        accuracy,
        formattedTargetValue,
        formattedRemaining,
        formattedDeadline,
        formattedRelativeDeadline,
        formattedPredicted,
        isPredictionValid,
        isCompleted,
        serializeState
    }
}
