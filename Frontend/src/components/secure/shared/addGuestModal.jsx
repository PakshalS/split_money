    import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const AddGuestModal = ({ isOpen, onClose, onAddGuests, isDark }) => {
  const [guests, setGuests] = useState([{ name: '', email: '' }]);

  const addGuestField = () => {
    setGuests([...guests, { name: '', email: '' }]);
  };

  const removeGuestField = (index) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const updateGuest = (index, field, value) => {
    const updatedGuests = guests.map((guest, i) => 
      i === index ? { ...guest, [field]: value } : guest
    );
    setGuests(updatedGuests);
  };

  const handleSubmit = () => {
    // Filter out guests with empty names (name is compulsory)
    const validGuests = guests.filter(guest => guest.name.trim() !== '');
    
    if (validGuests.length === 0) {
      alert('Please add at least one guest with a name');
      return;
    }

    // Generate unique IDs for guests
    const guestsWithIds = validGuests.map((guest, index) => ({
      _id: `guest_${Date.now()}_${index}`,
      name: guest.name.trim(),
      email: guest.email.trim() || '',
      isGuest: true
    }));

    onAddGuests(guestsWithIds);
    setGuests([{ name: '', email: '' }]);
    onClose();
  };

  const handleCancel = () => {
    setGuests([{ name: '', email: '' }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md mx-4 rounded-lg shadow-xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Add Guests
            </h3>
            <button
              onClick={handleCancel}
              className={`p-1 rounded-full transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {guests.map((guest, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-start space-x-2">
                <div className="flex-1">
                  {/* Name field (compulsory) */}
                  <input
                    type="text"
                    placeholder="Name *"
                    value={guest.name}
                    onChange={(e) => updateGuest(index, 'name', e.target.value)}
                    className={`guest-name-input-${index} w-full px-3 py-2 mb-2 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                    } focus:outline-none focus:ring-1 focus:ring-green-500`}
                  />
                  
                  {/* Email field (optional) */}
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={guest.email}
                    onChange={(e) => updateGuest(index, 'email', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                    } focus:outline-none focus:ring-1 focus:ring-green-500`}
                  />
                </div>

                {/* Remove guest button */}
                {guests.length > 1 && (
                  <button
                    onClick={() => removeGuestField(index)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'hover:bg-gray-700 text-red-400' 
                        : 'hover:bg-gray-100 text-red-500'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add more guest button */}
          <button
            onClick={addGuestField}
            className={`add-another-guest-button w-full p-3 border-2 border-dashed rounded-lg transition-colors ${
              isDark
                ? 'border-gray-600 hover:border-green-500 text-gray-400 hover:text-green-400'
                : 'border-gray-300 hover:border-green-500 text-gray-600 hover:text-green-500'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Another Guest</span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                isDark
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="guest-modal-done-button flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Add Guests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGuestModal;