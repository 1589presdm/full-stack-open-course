import { createContext, useContext, useState } from "react"

export const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, setNotification] = useState('')

    return (
        <NotificationContext.Provider value={{ notification, setNotification }}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotify = () => {
    const { setNotification } = useContext(NotificationContext)

    const notify = (message) => {
        setNotification(message)

        setTimeout(() => {
            setNotification('')
        }, 5000)
    }

    return notify
}