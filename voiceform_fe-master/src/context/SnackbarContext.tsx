import React, { useContext, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

export interface Props {
    [key: string]: unknown
}

interface SnackbarMessage {
    message: string
    type: 'error' | 'success' | 'warning' | 'info'
}

interface ContextProps {
    notify: (type: SnackbarMessage['type'], message: string) => void
    tryCatch: <T = unknown> (f: () => T | Promise<T>, message?: string, errorMessage?: string) => Promise<T | void>
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert (props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const SnackbarContext = React.createContext<ContextProps>({
    notify: () => {},
    tryCatch: async () => {},
})
export const SnackbarProvider = ({ children }: { children: unknown }) => {
    const [data, setData] = useState<SnackbarMessage | null>(null)

    const notify = (type: SnackbarMessage['type'], message: string) => {
        if (message !== "") setData({ type, message })
    }

    const tryCatch  = async <T = unknown, > (f: () => T, message?: string, errorMessage?: string) => {
        try {
            const data = await f();
            if (message) notify("success", message);
            if (data) return data;
        } catch (e: unknown) {
            //console.log(typeof(e.message))
            //console.log(e.message);
            if (errorMessage && e.message == "Bad Request") notify("error", errorMessage);
            else {
                if (typeof(e) === "string") notify("error", e);
                else notify("error", (e as Error).message);
            }
        }
    }

    const closeSnackbar = () => {
        setData(null)
    }

    return (
        <SnackbarContext.Provider value={{ notify, tryCatch }}>
            <>
                {data != null && (
                    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open autoHideDuration={6000} onClose={closeSnackbar}>
                        <Alert onClose={closeSnackbar} severity={data.type}>
                            {data.message}
                        </Alert>
                    </Snackbar>
                )}
                {children}
            </>
        </SnackbarContext.Provider>
    )
}

export const useSnackbarContext = () => useContext(SnackbarContext);