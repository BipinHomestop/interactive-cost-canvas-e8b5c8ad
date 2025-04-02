
import * as React from "react"

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  open?: boolean
  className?: string
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  open?: boolean
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Dismiss all toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        }
      }

      // Dismiss a specific toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST": {
      const { toastId } = action

      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }
    }
  }
}

const ToastContext = React.createContext<{
  toasts: ToasterToast[]
  addToast: (props: Omit<ToasterToast, "id">) => void
  updateToast: (
    id: string,
    props: Partial<Omit<ToasterToast, "id">>
  ) => void
  dismissToast: (toastId?: string) => void
  removeToast: (toastId?: string) => void
}>({
  toasts: [],
  addToast: () => {},
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, {
    toasts: [],
  })

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open === false && !toastTimeouts.has(toast.id)) {
        const timeout = setTimeout(() => {
          dispatch({
            type: "REMOVE_TOAST",
            toastId: toast.id,
          })
        }, TOAST_REMOVE_DELAY)

        toastTimeouts.set(toast.id, timeout)
      }
    })

    return () => {
      toastTimeouts.forEach((timeout) => {
        clearTimeout(timeout)
      })
      toastTimeouts.clear()
    }
  }, [state.toasts])

  const addToast = React.useCallback(
    (props: Omit<ToasterToast, "id">) => {
      const id = genId()

      dispatch({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
          open: true,
        },
      })

      return id
    },
    [dispatch]
  )

  const updateToast = React.useCallback(
    (
      id: string,
      props: Partial<Omit<ToasterToast, "id">>
    ) => {
      dispatch({
        type: "UPDATE_TOAST",
        toast: {
          ...props,
          id,
        },
      })
    },
    [dispatch]
  )

  const dismissToast = React.useCallback(
    (toastId?: string) => {
      dispatch({
        type: "DISMISS_TOAST",
        toastId,
      })
    },
    [dispatch]
  )

  const removeToast = React.useCallback(
    (toastId?: string) => {
      dispatch({
        type: "REMOVE_TOAST",
        toastId,
      })
    },
    [dispatch]
  )

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        addToast,
        updateToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

// Global toast context hook
export function useToast() {
  const { toasts, addToast, updateToast, dismissToast, removeToast } =
    React.useContext(ToastContext)

  return {
    toasts,
    toast: (props: Omit<ToasterToast, "id">) => {
      return addToast(props)
    },
    update: (id: string, props: Partial<ToasterToast>) => {
      return updateToast(id, props)
    },
    dismiss: (toastId?: string) => dismissToast(toastId),
    remove: (toastId?: string) => removeToast(toastId),
  }
}

// Simple toast utility that doesn't use require
let toastInstance: ReturnType<typeof useToast> | null = null;

// Helper to set the toast instance (will be called by the Toaster component)
export function setToastInstance(instance: ReturnType<typeof useToast>) {
  toastInstance = instance;
}

// Export a simple toast function for easier use
export const toast = {
  success: (opts: { title?: string; description?: string }) => {
    if (toastInstance) {
      toastInstance.toast({
        title: opts.title,
        description: opts.description,
        variant: "default",
      });
    } else {
      console.warn("Toast instance not initialized. Make sure the Toaster component is mounted.");
    }
  },
  error: (opts: { title?: string; description?: string }) => {
    if (toastInstance) {
      toastInstance.toast({
        title: opts.title,
        description: opts.description,
        variant: "destructive",
      });
    } else {
      console.warn("Toast instance not initialized. Make sure the Toaster component is mounted.");
    }
  }
};
