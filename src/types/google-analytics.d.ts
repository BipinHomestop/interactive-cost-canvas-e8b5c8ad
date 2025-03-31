
interface Window {
  dataLayer?: any[];
  gtag?: (command: string, eventName: string, eventParams?: Record<string, any>) => void;
}
