import {defineStore} from "pinia";
import {ref} from "vue";
import {useMediaQuery} from "@vueuse/core";

export const useInterfaceStore = defineStore('interface', () => {

    /**
     * A flag to determine if the left-hand navigation is supposed to be open or closed
     */
    const navigationOpen = ref(true);

    /**
     * A flag to determine if the left-hand navigation is supposed to be open or closed
     */
    const responsiveNavigationOpen = ref(false);

    /**
     * Determines if we're in "responsive" mode or not (less than 1481px)
     */
    const isResponsive = useMediaQuery('(max-width: 1480px)');

    return {navigationOpen, responsiveNavigationOpen, isResponsive}
});
