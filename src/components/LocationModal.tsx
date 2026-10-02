import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  Home, 
  Briefcase, 
  AlertCircle, 
  CheckCircle2, 
  Store, 
  ExternalLink,
  ShieldAlert,
  Search,
  PenTool,
  Loader2,
  Building,
  CornerDownRight,
  Compass
} from 'lucide-react';
import { UserAddress } from '../types';
import { SAVED_ADDRESSES } from '../data/mockData';
import { 
  useGeolocation, 
  STORE_LOCATION, 
  searchAddressGeocoding,
  calculateDistanceInMeters,
  GeocodedAddress 
} from '../hooks/useGeolocation';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: UserAddress;
  onSelectAddress: (address: UserAddress) => void;
  isServiceable?: boolean;
  onUpdateServiceability?: (isServiceable: boolean, distanceMeters: number) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
  onUpdateServiceability,
}) => {
  const [activeTab, setActiveTab] = useState<'detect' | 'manual'>('detect');
  
  // Geolocation Hook
  const {
    coords,
    distanceMeters,
    isServiceable,
    isLoading: isDetecting,
    error: geoError,
    locationName,
    detailedAddress,
    detectCurrentLocation,
    setManualAddressLocation,
    setSimulatedDistance,
    storeLocation,
  } = useGeolocation();

  // Manual Address Search State
  const [manualQuery, setManualQuery] = useState('');
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<GeocodedAddress[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<GeocodedAddress | null>(null);

  // Structured Manual Form Fields
  const [houseNo, setHouseNo] = useState(currentAddress.houseNo || '');
  const [apartmentRoad, setApartmentRoad] = useState(currentAddress.apartmentRoad || '');
  const [landmark, setLandmark] = useState(currentAddress.landmark || '');
  const [pincode, setPincode] = useState(storeLocation.pincode || '712513');
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

  const [addresses, setAddresses] = useState<UserAddress[]>(SAVED_ADDRESSES);

  // Debounced search for manual address query
  useEffect(() => {
    if (!manualQuery || manualQuery.trim().length < 3) {
      setAddressSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingAddress(true);
      const results = await searchAddressGeocoding(manualQuery);
      setAddressSuggestions(results);
      setIsSearchingAddress(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [manualQuery]);

  // Handle Selection of an Autocomplete Suggestion
  const handleSelectSuggestion = (sug: GeocodedAddress) => {
    setSelectedSuggestion(sug);
    setManualQuery(sug.displayName);
    setAddressSuggestions([]);

    if (sug.road) setApartmentRoad(sug.road);
    if (sug.postcode) setPincode(sug.postcode);

    // Calculate distance and update location
    setManualAddressLocation(
      sug.latitude,
      sug.longitude,
      sug.suburb || sug.city || 'Custom Address',
      sug.displayName
    );
  };

  // Submit Structured Manual Address
  const handleSaveManualAddress = () => {
    // If user didn't pick from geocoder, estimate based on Hooghly / Raghunathpur
    let lat = selectedSuggestion?.latitude ?? storeLocation.latitude;
    let lng = selectedSuggestion?.longitude ?? storeLocation.longitude;

    const enteredPin = pincode.trim();
    const isPinMatch = enteredPin === storeLocation.pincode;

    if (!selectedSuggestion && !isPinMatch) {
      // Simulate non-serviceable outside location
      lat = storeLocation.latitude + 0.005; // ~500m away
    }

    const dist = calculateDistanceInMeters(
      lat,
      lng,
      storeLocation.latitude,
      storeLocation.longitude
    );

    const isUnderRadius = dist <= storeLocation.maxDeliveryRadiusMeters;
    const serviceable = isPinMatch && isUnderRadius;

    const formattedArea = apartmentRoad
      ? `${apartmentRoad}, Raghunathpur`
      : 'Chandrahati Bazar, Raghunathpur';

    const fullAddrString = [
      houseNo,
      apartmentRoad,
      landmark ? `Near ${landmark}` : '',
      `Raghunathpur, WB - ${enteredPin}`,
    ]
      .filter(Boolean)
      .join(', ');

    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      label: addressLabel,
      address: fullAddrString,
      area: formattedArea,
      city: `Hooghly, West Bengal - ${enteredPin}`,
      eta: serviceable ? '8 mins' : 'Unavailable',
      houseNo,
      apartmentRoad,
      landmark,
    };

    setManualAddressLocation(lat, lng, formattedArea, fullAddrString, enteredPin);
    onSelectAddress(newAddr);
    if (onUpdateServiceability) {
      onUpdateServiceability(serviceable, dist);
    }
    onClose();
  };

  const handleApplyAddress = (addr: UserAddress, dist: number) => {
    const serviceable = dist <= STORE_LOCATION.maxDeliveryRadiusMeters;
    onSelectAddress(addr);
    if (onUpdateServiceability) {
      onUpdateServiceability(serviceable, dist);
    }
    onClose();
  };

  // Current Map Coordinates (either detected user location or store hub)
  const mapLat = coords?.latitude ?? STORE_LOCATION.latitude;
  const mapLng = coords?.longitude ?? STORE_LOCATION.longitude;
  const mapIframeSrc = `https://maps.google.com/maps?q=${mapLat},${mapLng}&t=&z=18&ie=UTF8&iwloc=&output=embed`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-xl bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 overflow-hidden z-10 max-h-[92vh] flex flex-col font-['Satoshi',sans-serif]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white/40 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#085E2B] text-white flex items-center justify-center shadow-xs shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-tight">
                    Delivery Location &amp; Geolocation
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold block">
                    25 km Delivery Radius · Raghunathpur Dark Store Hub
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs (GPS Auto-Detect vs Manual Address Entry) */}
            <div className="px-5 pt-3 border-b border-slate-100 bg-white/50 backdrop-blur-md shrink-0 flex gap-2">
              <button
                onClick={() => setActiveTab('detect')}
                className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer font-['Clash_Display',sans-serif] ${
                  activeTab === 'detect'
                    ? 'border-[#085E2B] text-[#085E2B]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>GPS Auto-Detect</span>
              </button>

              <button
                onClick={() => setActiveTab('manual')}
                className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer font-['Clash_Display',sans-serif] ${
                  activeTab === 'manual'
                    ? 'border-[#085E2B] text-[#085E2B]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Manual Address Entry</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs flex-1">
              {/* Dynamic Serviceability Badge */}
              {distanceMeters !== null && (
                <div>
                  {isServiceable ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-3 shadow-xs">
                      <CheckCircle2 className="w-5 h-5 text-[#085E2B] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs block text-[#085E2B] font-['Clash_Display',sans-serif]">
                          ⚡ Instant grocery delivery available from our dark store hub!
                        </span>
                        <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                          Calculated distance: <strong className="text-emerald-950">{distanceMeters >= 1000 ? `${(distanceMeters / 1000).toFixed(1)} km` : `${distanceMeters}m`}</strong> (comfortably within our 25 km delivery radius).
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 flex items-start gap-3 shadow-xs">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs block text-rose-700 font-['Clash_Display',sans-serif]">
                          We deliver within a 25 km radius of our store address (Kuntighat - Magra Rd, Naya Sarai). Delivery unavailable at this location.
                        </span>
                        <p className="text-[11px] text-rose-800 font-medium mt-0.5">
                          Current location is <strong className="text-rose-950">{distanceMeters >= 1000 ? `${(distanceMeters / 1000).toFixed(1)} km` : `${distanceMeters} m`}</strong> away from our store hub.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 1: GPS Auto-Detect Mode */}
              {activeTab === 'detect' && (
                <div className="space-y-4">
                  {/* One-Tap GPS Detection Button */}
                  <button
                    onClick={detectCurrentLocation}
                    disabled={isDetecting}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-300 text-[#085E2B] font-bold text-xs sm:text-sm transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#085E2B] text-white flex items-center justify-center shadow-xs shrink-0">
                        {isDetecting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Navigation className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-emerald-950 font-['Clash_Display',sans-serif]">
                          {isDetecting ? 'Querying GPS Sensor & Reverse Geocoding...' : 'Auto-Detect via GPS (Live Geolocation)'}
                        </span>
                        <span className="text-[11px] font-medium text-emerald-700">
                          Queries browser sensor and computes geodesic distance to store
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#085E2B] group-hover:translate-x-0.5 transition-transform shrink-0 font-['Clash_Display',sans-serif]">
                      Detect Now
                    </span>
                  </button>

                  {geoError && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-amber-950">GPS Notice:</span>
                        <span>{geoError}</span>
                      </div>
                    </div>
                  )}

                  {/* Geofence Testing Presets */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 font-['Clash_Display',sans-serif]">
                        Test 25 km Geofence Distance
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Haversine 25km Validation</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSimulatedDistance(1200, storeLocation.pincode, `Naya Sarai Hub (1.2 km)`)}
                        className="p-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-left cursor-pointer transition-colors"
                      >
                        <span className="block text-xs font-bold text-emerald-900 font-['Clash_Display',sans-serif]">1.2 km (Hub)</span>
                        <span className="text-[10px] text-[#085E2B] font-bold">✓ 8 mins</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSimulatedDistance(14000, '712123', `Bandel / Tribeni (14 km)`)}
                        className="p-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-left cursor-pointer transition-colors"
                      >
                        <span className="block text-xs font-bold text-emerald-900 font-['Clash_Display',sans-serif]">14 km Away</span>
                        <span className="text-[10px] text-[#085E2B] font-bold">✓ Under 25km</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSimulatedDistance(38000, '700001', 'Kolkata Central (38 km)')}
                        className="p-2 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-left cursor-pointer transition-colors"
                      >
                        <span className="block text-xs font-bold text-rose-900 font-['Clash_Display',sans-serif]">38 km Away</span>
                        <span className="text-[10px] text-rose-600 font-bold">✕ Outside 25km</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Manual Address Entry Mode */}
              {activeTab === 'manual' && (
                <div className="space-y-3.5">
                  {/* Search Autocomplete Input */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-['Clash_Display',sans-serif]">
                      Search Locality / Landmark / Street:
                    </label>
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Chandrahati Bazar, Naya Sarai, Magra..."
                        value={manualQuery}
                        onChange={(e) => setManualQuery(e.target.value)}
                        className="w-full h-11 pl-9 pr-9 rounded-xl border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-[#085E2B] focus:ring-2 focus:ring-emerald-500/10 font-medium"
                      />
                      {isSearchingAddress && (
                        <Loader2 className="w-4 h-4 text-[#085E2B] animate-spin absolute right-3" />
                      )}
                    </div>

                    {/* Address Autocomplete Suggestions Dropdown */}
                    {addressSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                        {addressSuggestions.map((sug, i) => (
                          <div
                            key={i}
                            onClick={() => handleSelectSuggestion(sug)}
                            className="p-2.5 hover:bg-emerald-50 border-b border-slate-100 last:border-b-0 cursor-pointer flex items-start gap-2 text-[11px]"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#085E2B] shrink-0 mt-0.5" />
                            <span className="text-[#121212] line-clamp-2 leading-snug">
                              {sug.displayName}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Structured Address Form */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <span className="block font-bold text-xs text-[#121212] font-['Clash_Display',sans-serif]">
                      Exact Address Details (House / Building / Landmark):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          House / Flat / Holding No:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Holding No. 42"
                          value={houseNo}
                          onChange={(e) => setHouseNo(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-[#085E2B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Road / Street / Society:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Kuntighat - Magra Rd"
                          value={apartmentRoad}
                          onChange={(e) => setApartmentRoad(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-[#085E2B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Nearby Landmark:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Opp Chandrahati Post Office"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-[#085E2B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Postal Pincode:
                        </label>
                        <input
                          type="text"
                          placeholder="712513"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-[#085E2B] font-mono"
                        />
                      </div>
                    </div>

                    {/* Address Type Tag (Home / Work / Other) */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Save Address As:
                      </label>
                      <div className="flex gap-2">
                        {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => setAddressLabel(lbl)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              addressLabel === lbl
                                ? 'bg-[#085E2B] text-white shadow-2xs'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Verify & Pin Address Button */}
                    <button
                      type="button"
                      onClick={handleSaveManualAddress}
                      className="w-full py-2.5 rounded-xl bg-[#121212] hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 mt-1 shadow-xs font-['Clash_Display',sans-serif]"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#F5ECD5]" />
                      <span>Verify &amp; Pin This Address to Dark Store</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Embedded Interactive Live Google Map View Centered on Detected/Store Coordinates */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-['Clash_Display',sans-serif]">
                    Live Geolocation Map View (PIN {storeLocation.pincode})
                  </span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Kuntighat+-+Magra+Rd,+Naya+Sarai,+Chandrahati+Bazar,+Raghunathpur,+West+Bengal+712513"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#085E2B] hover:underline flex items-center gap-1 font-['Clash_Display',sans-serif]"
                  >
                    <span>Full Google Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                  <iframe
                    title="Freshit Live Map Pin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapIframeSrc}
                  />

                  {/* Geofence Overlay Pill */}
                  <div className="absolute top-2 left-2 bg-[#121212]/95 text-white backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-700 shadow-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#085E2B] animate-ping" />
                    <span>Store: PIN {storeLocation.pincode} · 25 km Delivery Radius</span>
                  </div>
                </div>
              </div>

              {/* Saved Verified Raghunathpur Addresses */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block font-['Clash_Display',sans-serif]">
                  Saved Raghunathpur Local Addresses
                </span>

                <div className="space-y-2">
                  {addresses.map((addr) => {
                    const isSelected = currentAddress.id === addr.id;
                    const IconComp = addr.label === 'Home' ? Home : addr.label === 'Work' ? Briefcase : MapPin;

                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleApplyAddress(addr, 10)}
                        className={`flex items-start justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#085E2B] bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-500/20'
                            : 'border-slate-200/90 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-[#085E2B] text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#121212] font-['Clash_Display',sans-serif]">
                                {addr.label}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                8 mins · 25 km Zone
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 mt-0.5">
                              {addr.area}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {addr.address}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#085E2B] text-white flex items-center justify-center shrink-0 mt-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Bottom Action Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-800">
                  {locationName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {distanceMeters !== null
                    ? `Distance: ${distanceMeters >= 1000 ? `${(distanceMeters / 1000).toFixed(1)} km` : `${distanceMeters}m`} to Raghunathpur Hub`
                    : 'Awaiting geolocation...'}
                </span>
              </div>

              <button
                onClick={() => {
                  const updatedAddr: UserAddress = {
                    id: `addr-${Date.now()}`,
                    label: addressLabel,
                    address: detailedAddress || 'Holding No. 42, Kuntighat - Magra Rd, Naya Sarai',
                    area: isServiceable
                      ? locationName
                      : `Outside Zone (${distanceMeters}m away)`,
                    city: 'Hooghly, West Bengal - 712513',
                    eta: isServiceable ? '8 mins' : 'Unavailable',
                  };
                  handleApplyAddress(updatedAddr, distanceMeters ?? 0);
                }}
                disabled={!isServiceable}
                className={`px-5 py-2.5 rounded-xl font-bold font-['Clash_Display',sans-serif] text-xs shadow-xs transition-all cursor-pointer ${
                  isServiceable
                    ? 'bg-[#085E2B] hover:bg-[#064821] text-white active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isServiceable ? 'Deliver Here (8 Mins)' : 'Outside 25m Zone'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
