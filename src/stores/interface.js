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

    /**
     * A reference to the current time, used to update date/time relative values occasionally
     * Updates every 5 minutes
     */
    const currentTime = ref(new Date());
    setInterval(() => {
        currentTime.value = new Date();
    }, 1000 * 60 * 5);

    /**
     * Open an external link in the default browser
     * @param url
     */
    const openLink = (url) => {
        window.electronAPI.openLink(url);
    }

    return {navigationOpen, responsiveNavigationOpen, isResponsive, currentTime, openLink}
});
