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
            trackerId: trackerId,
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
    const deadline = ref(config.deadline || new Date.create('next Friday'));

    /**
     * Placeholder for the predicted completion of the goal
     */
    const predicted = computed(() => {
        if (parentTracker.value) {
            if (parentTracker.value.regressionData.calculation.predictX(parseFloat(targetValue.value))) {
                return new Date.create(parentTracker.value.regressionData.calculation.predictX(parseFloat(targetValue.value))[0] + parentTracker.value.xOffset);
            }
        }
        return false;
    });

    /**
     * The formatted version of the target value
     */
    const formattedTargetValue = computed(() => {
        return formatValue(targetValue.value, parentTracker.value.numberFormat);
    });

    /**
     * The formatted version of the deadline
     */
    const formattedDeadline = computed(() => {
        return new Date(deadline.value).medium();
    });

    /**
     * The formatted version of the deadline (relative)
     */
    const formattedRelativeDeadline = computed(() => {
        return new Date(deadline.value).relative();
    });

    /**
     * The formatted version of the predicted completion of the goal
     */
    const formattedPredicted = computed(() => {
        if (predicted.value && predicted.value.isAfter(createdAt)) {
            if (predicted.value.isFuture()) {
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
        formattedTargetValue,
        formattedDeadline,
        formattedRelativeDeadline,
        formattedPredicted,
        serializeState
    }
}
