import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserPlus, X, Mail, User, Trash2, Users, ChevronDown, ChevronUp } from 'lucide-react';

const AddMemberForm = ({ groupId, onClose }) => {
    const [members, setMembers] = useState([{ name: '', email: '' }]);
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);
    const [isFriendsListOpen, setIsFriendsListOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = Cookies.get('authToken');
                if (!token) {
                    console.error('No auth token found');
                    return;
                }

                const response = await axios.get('https://split-money-api.vercel.app/friends/get-friends', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, []);

    const handleAddMember = async () => {
        const token = Cookies.get('authToken');
        if (!token) {
            console.error('No auth token found');
            return;
        }

        const validMembers = members.filter(member => member.name.trim() !== '');
        if (validMembers.length === 0) {
            setError('Please add at least one member with a name.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post(
                `https://split-money-api.vercel.app/groups/${groupId}/add-member`,
                { members: validMembers },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert('Members added successfully!');
            onClose();
        } catch (error) {
            console.error('Error adding members:', error);
            setError(error.response?.data?.error || 'Failed to add members.');
        } finally {
            setLoading(false);
        }
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
        setError(null);
    };

    const addNewMemberField = () => {
        setMembers([...members, { name: '', email: '' }]);
    };

    const removeMemberField = (index) => {
        const newMembers = members.filter((_, i) => i !== index);
        setMembers(newMembers);
        setError(null);
    };

    const handleFriendSelect = (friend) => {
        const existingIndex = members.findIndex(
            (member) => member.email === friend.email && member.email !== ''
        );

        if (existingIndex !== -1) {
            const newMembers = members.filter((_, i) => i !== existingIndex);
            setMembers(newMembers.length === 0 ? [{ name: '', email: '' }] : newMembers);
            return;
        }

        const nameExists = members.findIndex(
            (member) => member.name === friend.name
        );

        if (nameExists !== -1) {
            return;
        }

        setMembers([...members, { name: friend.name, email: friend.email || '' }]);
    };

    const isFriendSelected = (friend) => {
        return members.some(
            (member) => (member.email === friend.email && friend.email !== '') || member.name === friend.name
        );
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-800 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-gray-950 border-b border-gray-800 p-4 sm:p-5 md:p-6 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl z-10">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
                            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Add Members</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300 flex-shrink-0"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
                    </button>
                </div>

                <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                    {/* Members Input Section */}
                    <div>
                        <h3 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-base sm:text-lg">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                            Member Details
                        </h3>
                        <div className={`space-y-2 sm:space-y-3 ${members.length > 3 ? 'max-h-[250px] sm:max-h-[300px] overflow-y-auto scrollbar-hide' : ''} bg-gray-900/30 rounded-lg sm:rounded-xl p-2 sm:p-3`}>
                            {members.map((member, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-700 space-y-2 sm:space-y-3"
                                >
                                    <div className="relative">
                                        <User className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Member Name"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-600 bg-gray-900 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            placeholder="Email (Optional)"
                                            value={member.email}
                                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-600 bg-gray-900 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300"
                                        />
                                    </div>
                                    {members.length > 1 && (
                                        <button
                                            onClick={() => removeMemberField(index)}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50 text-sm sm:text-base active:scale-[0.98]"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            Remove Member
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>{/* Add Another Member Button */}
                    <button
                        onClick={addNewMemberField}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-green-700 font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
                    >
                        <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                        Add Another Member
                    </button>

                    {/* Friends List Section */}
                    <div className="border-t border-gray-800 pt-4 sm:pt-6">
                        <button
                            onClick={() => setIsFriendsListOpen(!isFriendsListOpen)}
                            className="w-full flex items-center justify-between mb-3 sm:mb-4"
                        >
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                                <h3 className="text-white font-semibold text-base sm:text-lg">
                                    Select from Friends
                                </h3>
                            </div>
                            {isFriendsListOpen ? (
                                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                            ) : (
                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                            )}
                        </button>

                        {isFriendsListOpen && (
                            <>
                                {friends.length === 0 ? (
                                    <div className="text-center py-6 sm:py-8 text-gray-500">
                                        <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                                        <p className="text-base sm:text-lg">No friends available</p>
                                        <p className="text-xs sm:text-sm mt-2">Add friends first to quickly select them</p>
                                    </div>
                                ) : (
                                    <div className={`space-y-2 ${friends.length > 3 ? 'max-h-[180px] sm:max-h-[200px] overflow-y-auto scrollbar-hide' : ''} bg-gray-900/30 rounded-lg sm:rounded-xl p-2 sm:p-3`}>
                                        {friends.map((friend) => {
                                            const isSelected = isFriendSelected(friend);
                                            return (
                                                <div
                                                    key={friend._id}
                                                    onClick={() => handleFriendSelect(friend)}
                                                    className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${isSelected
                                                            ? 'bg-green-700/10 border-green-700 shadow-lg shadow-green-700/20'
                                                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => { }}
                                                        className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 text-green-700 focus:ring-green-700 focus:ring-offset-gray-800 pointer-events-none flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white font-medium text-sm sm:text-base truncate">{friend.name}</p>
                                                        {friend.email && (
                                                            <p className="text-xs sm:text-sm text-gray-500 truncate">{friend.email}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl text-red-500 text-center text-sm sm:text-base">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddMember}
                            disabled={loading}
                            className="w-full sm:flex-1 bg-gradient-to-r from-green-700 to-green-600 hover:text-black  text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg  flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
                        >
                            {loading ? 'Adding...' : 'Add Members'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
        </div>
    );
};
export default AddMemberForm;