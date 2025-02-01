declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
        };
        LatLng: new (lat: number, lng: number) => google.maps.LatLng;
        LatLngBounds: new (
          sw: google.maps.LatLng,
          ne: google.maps.LatLng
        ) => google.maps.LatLngBounds;
      };
    };
  }
}

export {};