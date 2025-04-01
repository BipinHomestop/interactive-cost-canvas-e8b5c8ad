
import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial value
    checkIfMobile()
    
    // Add event listener
    window.addEventListener("resize", checkIfMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return isMobile
}

// Helper function to get user's approximate location based on IP
// This is a legal way to track location without requiring permissions
export function useUserLocation() {
  const [locationData, setLocationData] = useState({
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown',
    latitude: null,
    longitude: null,
    ip: 'Unknown'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setIsLoading(true);
        // Using ipapi.co which is privacy-friendly and doesn't require API keys for basic usage
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          setLocationData({
            city: data.city || 'Unknown',
            region: data.region || 'Unknown',
            country: data.country_name || 'Unknown',
            latitude: data.latitude,
            longitude: data.longitude,
            ip: data.ip
          });
        } else {
          throw new Error('Failed to fetch location data');
        }
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  return { locationData, isLoading, error };
}
