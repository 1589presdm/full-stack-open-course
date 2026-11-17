import { create } from "zustand"


const useNotificationStore = create((set) => ({
    notification: null,

    actions: {
        setNotification: message => set(() => ({ notification: message })),

        clear: () => set(() => ({ notification: null }))
    }
}))

export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationAction = () => useNotificationStore((state) => state.actions) 