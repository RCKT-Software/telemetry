import {defineStore} from "pinia";
import {ref} from "vue";

export const useModalStore = defineStore('modals', () => {

    /**
     * The currently open modal
     */
    const activeModal = ref(null);

    /**
     * The props passed to the currently open modal
     */
    const activeModalProps = ref({});

    /**
     * Open a modal
     * @param modal - (Ex: 'progress-tracker')
     * @param props
     */
    const openModal = (modal, props) => {
        activeModal.value = modal;
        activeModalProps.value = props;
    }

    /**
     * Close the modal
     */
    const closeModal = () => {
        activeModal.value = null;
        activeModalProps.value = {};
    }

    return {activeModal, activeModalProps, openModal, closeModal}
});
