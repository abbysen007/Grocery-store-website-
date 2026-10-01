import { useState, useEffect, useCallback } from 'react';

export interface StoreLocationConfig {
  name: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  maxDeliveryRadiusMeters: number;
}

// Single Flagship Store Coordinates: Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar, Raghunathpur, WB 712513
export const DEFAULT_STORE_LOCATION: StoreLocationConfig = {
  name: 'Freshit Dark Store Hub',
  address: 'Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar, Raghunathpur, West Bengal - 712513',
  city: 'Raghunathpur',
  district: 'Hooghly',
  state: 'West Bengal',
  pincode: '712513',
  latitude: 22.993125,
  longitude: 88.385500,
  maxDeliveryRadiusMeters: 25, // Strict under 25-meter perimeter of store address
};

export function getStoredStoreLocation(): StoreLocationConfig {
  try {
    const saved = localStorage.getItem('freshit_store_location');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure no plusCode is retained
      delete (parsed as any).plusCode;
      return { ...DEFAULT_STORE_LOCATION, ...parsed };
    }
  } catch {
    // fallback
  }
  return DEFAULT_STORE_LOCATION;
}

export let STORE_LOCATION: StoreLocationConfig = getStoredStoreLocation();

/**
 * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
 * @returns Distance in meters
 */
export function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface GeocodedAddress {
  displayName: string;
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  latitude: number;
  longitude: number;
}

export interface GeolocationState {
  coords: { latitude: number; longitude: number } | null;
  distanceMeters: number | null;
  userPincode: string;
  isServiceable: boolean;
  isLoading: boolean;
  error: string | null;
  mode: 'real_gps' | 'manual_entry' | 'simulated' | 'default';
  locationName: string;
  detailedAddress?: string;
  unserviceableReason?: string;
}

/**
 * Reverse geocodes latitude & longitude into human-readable Indian address components
 */
export async function reverseGeocodeCoords(
  lat: number,
  lng: number
): Promise<{ displayName: string; area: string; city: string; pincode: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en-IN,en;q=0.9',
        },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const area =
        addr.suburb ||
        addr.neighbourhood ||
        addr.village ||
        addr.commercial ||
        addr.road ||
        'Chandrahati';
      const city = addr.city || addr.town || addr.county || 'Hooghly';
      const pincode = addr.postcode || STORE_LOCATION.pincode;
      const displayName =
        data.display_name || `${area}, ${city}, West Bengal ${pincode}`;

      return { displayName, area, city, pincode };
    }
  } catch {
    // network or abort fallback
  }

  // Graceful fallback for local Raghunathpur
  return {
    displayName: `Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar, Raghunathpur, WB ${STORE_LOCATION.pincode}`,
    area: 'Chandrahati Bazar, Raghunathpur',
    city: 'Hooghly, West Bengal',
    pincode: STORE_LOCATION.pincode,
  };
}

/**
 * Forward geocodes an address string using Nominatim
 */
export async function searchAddressGeocoding(
  query: string
): Promise<GeocodedAddress[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=in&limit=5&addressdetails=1`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en-IN,en;q=0.9',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return data.map((item: any) => ({
        displayName: item.display_name,
        road: item.address?.road,
        suburb: item.address?.suburb || item.address?.neighbourhood || item.address?.village,
        city: item.address?.city || item.address?.town || item.address?.county,
        state: item.address?.state,
        postcode: item.address?.postcode,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));
    }
  } catch {
    // fallback
  }

  return [];
}

export function useGeolocation() {
  const [storeConfig, setStoreConfig] = useState<StoreLocationConfig>(() => getStoredStoreLocation());

  const [geoState, setGeoState] = useState<GeolocationState>(() => {
    try {
      const saved = localStorage.getItem('freshit_geolocation');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    const currentStore = getStoredStoreLocation();
    // Default: Set to store location (0m away, matching PIN, fully serviceable)
    return {
      coords: { latitude: currentStore.latitude, longitude: currentStore.longitude },
      distanceMeters: 0,
      userPincode: currentStore.pincode,
      isServiceable: true,
      isLoading: false,
      error: null,
      mode: 'default',
      locationName: 'Chandrahati Bazar, Raghunathpur',
      detailedAddress: currentStore.address,
    };
  });

  // Save to localStorage whenever verified
  useEffect(() => {
    try {
      localStorage.setItem('freshit_geolocation', JSON.stringify(geoState));
    } catch {
      // ignore
    }
  }, [geoState]);

  // Update Store Pincode Method
  const updateStorePincode = useCallback((newPincode: string) => {
    const trimmed = newPincode.trim();
    if (!trimmed) return;

    setStoreConfig((prev) => {
      const updated: StoreLocationConfig = {
        ...prev,
        pincode: trimmed,
        address: `Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar, Raghunathpur, West Bengal - ${trimmed}`,
      };
      STORE_LOCATION = updated;
      try {
        localStorage.setItem('freshit_store_location', JSON.stringify(updated));
        window.dispatchEvent(new Event('freshit_store_updated'));
      } catch {}
      return updated;
    });
  }, []);

  // Request Browser Real GPS with Automatic Reverse Geocoding & PIN verification
  const detectCurrentLocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setGeoState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        isLoading: false,
      }));
      return;
    }

    setGeoState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const dist = calculateDistanceInMeters(
          userLat,
          userLng,
          storeConfig.latitude,
          storeConfig.longitude
        );

        // Perform reverse geocoding to retrieve actual address name and pincode
        const reverseAddr = await reverseGeocodeCoords(userLat, userLng);
        const detectedPin = reverseAddr.pincode ? reverseAddr.pincode.trim() : storeConfig.pincode;

        // VERIFY WITH PIN CODE (Must match store pin code 712513) AND UNDER 25 METERS OF STORE ADDRESS
        const isPinMatch = detectedPin === storeConfig.pincode;
        const isUnderRadius = dist <= storeConfig.maxDeliveryRadiusMeters;
        const serviceable = isPinMatch && isUnderRadius;

        let reason = '';
        if (!isPinMatch) {
          reason = `PIN code ${detectedPin} does not match store delivery PIN (${storeConfig.pincode}).`;
        } else if (!isUnderRadius) {
          reason = `Location is ${dist}m away, which exceeds our 25-meter store address perimeter.`;
        }

        setGeoState({
          coords: { latitude: userLat, longitude: userLng },
          distanceMeters: dist,
          userPincode: detectedPin,
          isServiceable: serviceable,
          isLoading: false,
          error: null,
          mode: 'real_gps',
          locationName: serviceable
            ? `${reverseAddr.area || 'Chandrahati Bazar'}, Raghunathpur (PIN ${detectedPin})`
            : `${reverseAddr.area || 'Detected Location'} (${dist >= 1000 ? `${(dist / 1000).toFixed(1)} km` : `${dist}m`} away)`,
          detailedAddress: reverseAddr.displayName,
          unserviceableReason: reason,
        });
      },
      (err) => {
        let msg = 'Unable to retrieve device GPS.';
        if (err.code === 1) msg = 'Location permission was denied. Please enter your PIN code & address below.';
        else if (err.code === 2) msg = 'GPS signal unavailable. Please use manual PIN code address entry.';
        else if (err.code === 3) msg = 'Location request timed out. Please enter your address manually.';

        setGeoState((prev) => ({
          ...prev,
          isLoading: false,
          error: msg,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [storeConfig]);

  // Set Manual Address from User Geocoding or Form with PIN Code verification
  const setManualAddressLocation = useCallback(
    (lat: number, lng: number, addressTitle: string, fullAddress?: string, userPin?: string) => {
      const dist = calculateDistanceInMeters(
        lat,
        lng,
        storeConfig.latitude,
        storeConfig.longitude
      );

      const effectivePin = (userPin || storeConfig.pincode).trim();
      const isPinMatch = effectivePin === storeConfig.pincode;
      const isUnderRadius = dist <= storeConfig.maxDeliveryRadiusMeters;
      const serviceable = isPinMatch && isUnderRadius;

      let reason = '';
      if (!isPinMatch) {
        reason = `PIN code ${effectivePin} is outside our delivery zone. Orders are only accepted for PIN ${storeConfig.pincode}.`;
      } else if (!isUnderRadius) {
        reason = `Location is ${dist}m away (exceeds our 25-meter store address limit).`;
      }

      setGeoState({
        coords: { latitude: lat, longitude: lng },
        distanceMeters: dist,
        userPincode: effectivePin,
        isServiceable: serviceable,
        isLoading: false,
        error: null,
        mode: 'manual_entry',
        locationName: serviceable
          ? `${addressTitle} (PIN ${effectivePin})`
          : `${addressTitle} (${dist >= 1000 ? `${(dist / 1000).toFixed(1)} km` : `${dist}m`} away)`,
        detailedAddress: fullAddress || addressTitle,
        unserviceableReason: reason,
      });

      return { serviceable, distance: dist, pinMatch: isPinMatch };
    },
    [storeConfig]
  );

  // Quick Simulation Helper for testing hyper-local 25m & PIN rules
  const setSimulatedDistance = useCallback((meters: number, pin?: string, label?: string) => {
    const deltaLat = meters / 111000;
    const newLat = storeConfig.latitude + deltaLat;
    const newLng = storeConfig.longitude;
    const computedDist = calculateDistanceInMeters(
      newLat,
      newLng,
      storeConfig.latitude,
      storeConfig.longitude
    );

    const targetPin = (pin || storeConfig.pincode).trim();
    const isPinMatch = targetPin === storeConfig.pincode;
    const isUnderRadius = computedDist <= storeConfig.maxDeliveryRadiusMeters;
    const serviceable = isPinMatch && isUnderRadius;

    setGeoState({
      coords: { latitude: newLat, longitude: newLng },
      distanceMeters: computedDist,
      userPincode: targetPin,
      isServiceable: serviceable,
      isLoading: false,
      error: null,
      mode: 'simulated',
      locationName: label || (serviceable
        ? `Naya Sarai, Chandrahati (PIN ${targetPin} · ${computedDist}m from Hub)`
        : `Outside Zone (${computedDist}m · PIN ${targetPin})`),
      detailedAddress: serviceable
        ? `Holding No. 42, Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar, Raghunathpur, WB ${targetPin}`
        : `Location Beyond 25-Meter Perimeter, PIN ${targetPin}, Raghunathpur, WB`,
      unserviceableReason: !serviceable
        ? (!isPinMatch ? `Non-matching PIN (${targetPin})` : `Distance (${computedDist}m) exceeds 25 meters`)
        : undefined,
    });
  }, [storeConfig]);

  return {
    ...geoState,
    storeLocation: storeConfig,
    detectCurrentLocation,
    setManualAddressLocation,
    setSimulatedDistance,
    updateStorePincode,
  };
}
