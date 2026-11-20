import { createContext, useState } from "react"

export const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, setNotification] = useState('')

    return (
        <NotificationContext.Provider value={{notification, setNotification}}>
            {props.children}
        </NotificationContext.Provider>
    )
}

