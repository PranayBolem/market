import {create} from 'zustand';

interface HostModelStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useHostModel = create <HostModelStore> ((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useHostModel;