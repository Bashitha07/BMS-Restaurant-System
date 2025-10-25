import React, { useState, useEffect } from 'react';
import { MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const DeliveryDistanceValidator = ({ 
  distance, 
  onDistanceChange, 
  preparationTime = 30, 
  className = '' 
}) => {
  const [distanceInput, setDistanceInput] = useState(distance || '');
  const [isValid, setIsValid] = useState(true);
  const [deliveryTime, setDeliveryTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const MAX_DISTANCE = 7.0; // 7km maximum

  useEffect(() => {
    if (distanceInput) {
      const dist = parseFloat(distanceInput);
      if (!isNaN(dist)) {
        calculateDeliveryTime(dist);
      }
    }
  }, [distanceInput, preparationTime]);

  const calculateDeliveryTime = (dist) => {
    if (dist > MAX_DISTANCE) {
      setIsValid(false);
      setDeliveryTime(0);
      setTotalTime(0);
      return;
    }

    setIsValid(true);
    
    // Delivery time formula: 10 minutes base + (distance × 5 minutes per km)
    const deliveryMinutes = 10 + Math.round(dist * 5);
    setDeliveryTime(deliveryMinutes);
    
    // Total time = preparation + delivery
    const total = (preparationTime || 30) + deliveryMinutes;
    setTotalTime(total);
  };

  const handleDistanceChange = (e) => {
    const value = e.target.value;
    setDistanceInput(value);
    
    const dist = parseFloat(value);
    if (!isNaN(dist)) {
      onDistanceChange && onDistanceChange(dist);
    }
  };

  const getDeliveryFee = (dist) => {
    if (!dist || dist <= 0) return 0;
    // Example: Rs. 100 base + Rs. 50 per km
    return 100 + Math.round(dist * 50);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          Delivery Distance (km)
        </label>
        <input
          type="number"
          value={distanceInput}
          onChange={handleDistanceChange}
          min="0"
          max={MAX_DISTANCE}
          step="0.1"
          placeholder="Enter distance in km"
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${
            !isValid 
              ? 'border-red-500 focus:ring-red-200' 
              : distanceInput 
                ? 'border-green-500 focus:ring-green-200'
                : 'border-gray-300 focus:ring-blue-200'
          }`}
        />
      </div>

      {distanceInput && (
        <div className={`p-4 rounded-lg border-2 ${
          isValid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          {isValid ? (
            <div className="space-y-2">
              <div className="flex items-center text-green-700 font-medium">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Delivery Available</span>
              </div>
              
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">🍳 Preparation Time:</span>
                  <span className="font-medium">{preparationTime} minutes</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">🚗 Delivery Time:</span>
                  <span className="font-medium">{deliveryTime} minutes</span>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-green-200">
                  <span className="text-gray-700 font-medium">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Total Estimated Time:
                  </span>
                  <span className="font-bold text-green-700">
                    {totalTime} minutes
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-green-200">
                  <span className="text-gray-700 font-medium">💵 Delivery Fee:</span>
                  <span className="font-bold text-green-700">
                    Rs. {getDeliveryFee(parseFloat(distanceInput)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-600 bg-white p-2 rounded">
                <strong>Note:</strong> Estimated delivery at{' '}
                <span className="font-medium text-blue-600">
                  {new Date(Date.now() + totalTime * 60000).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start text-red-700">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Delivery Not Available</div>
                <div className="text-sm mt-1">
                  Sorry, we only deliver within {MAX_DISTANCE}km radius. 
                  Your location is {parseFloat(distanceInput).toFixed(1)}km away.
                </div>
                <div className="text-sm mt-2">
                  Please choose a pickup option instead or provide a delivery address within our service area.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!distanceInput && (
        <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <strong>ℹ️ Delivery Information:</strong>
          <ul className="mt-2 ml-4 space-y-1">
            <li>• Maximum delivery distance: {MAX_DISTANCE}km</li>
            <li>• Delivery fee calculated based on distance</li>
            <li>• Estimated time includes cooking + delivery</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DeliveryDistanceValidator;
