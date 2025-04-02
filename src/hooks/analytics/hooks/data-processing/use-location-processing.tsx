
import { useCallback } from 'react';
import { processLocationData } from '../../utils/location/processor';

type UseLocationProcessingProps = {
  setLocationData: React.Dispatch<React.SetStateAction<any[]>>;
  setZipCodeData: React.Dispatch<React.SetStateAction<any[]>>;
  setDetailedLocationData: React.Dispatch<React.SetStateAction<any[]>>;
  setDetailedZipCodeData: React.Dispatch<React.SetStateAction<any[]>>;
};

export const useLocationProcessing = ({
  setLocationData,
  setZipCodeData,
  setDetailedLocationData,
  setDetailedZipCodeData
}: UseLocationProcessingProps) => {
  const processLocationDataHook = useCallback((visits: any[], submissions: any[]) => {
    const hasVisits = visits && visits.length > 0;
    
    if (!hasVisits) {
      setLocationData([]);
      setZipCodeData([]);
      setDetailedLocationData([]);
      setDetailedZipCodeData([]);
      return;
    }

    processLocationData(
      visits, 
      submissions, 
      setLocationData, 
      setZipCodeData, 
      setDetailedLocationData, 
      setDetailedZipCodeData
    );
  }, [setLocationData, setZipCodeData, setDetailedLocationData, setDetailedZipCodeData]);

  return { processLocationDataHook };
};
