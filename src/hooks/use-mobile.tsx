
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add multiple event listeners for better responsiveness
    window.addEventListener("resize", checkMobile)
    window.addEventListener("orientationchange", checkMobile)
    
    // Set initial value
    checkMobile()
    
    // Clean up
    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("orientationchange", checkMobile)
    }
  }, [])

  return isMobile !== undefined ? isMobile : (typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false)
}
