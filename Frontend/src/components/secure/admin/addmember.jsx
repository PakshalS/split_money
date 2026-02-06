import React, { useState, useEffect } from 'react';
import { UserPlus, X, Mail, User, Trash2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import useStore from '../../../store/useStore';

const AddMemberForm = ({ groupId, onClose, isDark }) => {
    const [members, setMembers] = useState([{ name: '', email: '' }]);
    const [error, setError] = useState(null);
    const [isFriendsListOpen, setIsFriendsListOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get store actions and data
    const { 
        addMembers: addMembersToGroup,
        friends,
        fetchFriends
    } = useStore();

    useEffect(() => {
        // Fetch friends from store if not already loaded
        if (friends.length === 0) {
            fetchFriends();
        }
    }, [friends.length, fetchFriends]);

    const handleAddMember = async () => {
        const validMembers = members.filter(member => member.name.trim() !== '');
        if (validMembers.length === 0) {
            setError('Please add at least one member with a name.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await addMembersToGroup(groupId, validMembers);
            alert('Members added successfully!');
            onClose();
        } catch (error) {
            console.error('Error adding members:', error);
            setError(error.message || 'Failed to add members.');
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
        <div className={`absolute inset-0 z-50 flex flex-col ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            
            {/* Header */}
            <div className={`flex-shrink-0 border-b p-4 flex items-center justify-between ${
                isDark 
                    ? 'bg-[#1f2329] border-gray-700' 
                    : 'bg-white border-gray-200'
            }`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12" />
                    <div className="flex-1 min-w-0">
                        <h2 className={`text-xl font-bold truncate ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>Add Members</h2>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Add new members to group
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors ${
                        isDark 
                            ? 'hover:bg-[#1f2329] text-gray-400 hover:text-white' 
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Step Progress Indicator */}
            <div className={`flex-shrink-0 flex gap-2 px-4 py-3 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
                <div className={`h-1 flex-1 rounded-full ${
                    isDark ? 'bg-green-600' : 'bg-green-500'
                }`} />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6 max-w-md">
                    {/* Members Input Section */}
                    <div>
                        <h3 className={`font-semibold mb-3 text-base ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>Member Details</h3>
                        <div className={`space-y-3 ${members.length > 3 ? 'max-h-[300px] overflow-y-auto scrollbar-hide' : ''} rounded-lg p-3 ${
                            isDark ? 'bg-[#1f2329]' : 'bg-gray-100/50'
                        }`}>
                            {members.map((member, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg border space-y-3 ${
                                        isDark 
                                            ? 'bg-dark-bg border-gray-700' 
                                            : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <div className="relative">
                                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                            isDark ? 'text-gray-500' : 'text-gray-400'
                                        }`} />
                                        <input
                                            type="text"
                                            placeholder="Member Name"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 text-base focus:outline-none transition-all ${
                                                isDark 
                                                    ? 'border-gray-600 bg-[#1f2329] text-white placeholder-gray-500 focus:border-green-600' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500'
                                            }`}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                            isDark ? 'text-gray-500' : 'text-gray-400'
                                        }`} />
                                        <input
                                            type="email"
                                            placeholder="Email (Optional)"
                                            value={member.email}
                                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 text-base focus:outline-none transition-all ${
                                                isDark 
                                                    ? 'border-gray-600 bg-[#1f2329] text-white placeholder-gray-500 focus:border-green-600' 
                                                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500'
                                            }`}
                                        />
                                    </div>
                                    {members.length > 1 && (
                                        <button
                                            onClick={() => removeMemberField(index)}
                                            className={`w-full font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm ${
                                                isDark 
                                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                            }`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove Member
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add Another Member Button */}
                    <button
                        onClick={addNewMemberField}
                        className={`w-full font-semibold px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm ${
                            isDark 
                                ? 'bg-[#1f2329] hover:bg-gray-700 text-gray-300 border border-gray-700' 
                                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                        }`}
                    >
                        <UserPlus className="w-5 h-5" />
                        Add Another Member
                    </button>

                    {/* Friends List Section */}
                    <div className={`border-t pt-6 ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        <button
                            onClick={() => setIsFriendsListOpen(!isFriendsListOpen)}
                            className="w-full flex items-center justify-between mb-4"
                        >
                            <div className="flex items-center gap-2">
                                <Users className={`w-5 h-5 ${
                                    isDark ? 'text-green-600' : 'text-green-600'
                                }`} />
                                <h3 className={`font-semibold text-base ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    Select from Friends
                                </h3>
                            </div>
                            {isFriendsListOpen ? (
                                <ChevronUp className={`w-5 h-5 ${
                                    isDark ? 'text-green-600' : 'text-green-600'
                                }`} />
                            ) : (
                                <ChevronDown className={`w-5 h-5 ${
                                    isDark ? 'text-green-600' : 'text-green-600'
                                }`} />
                            )}
                        </button>

                        {isFriendsListOpen && (
                            <>
                                {friends.length === 0 ? (
                                    <div className={`text-center py-8 ${
                                        isDark ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                        <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p className="text-base">No friends available</p>
                                        <p className="text-sm mt-2">Add friends first to quickly select them</p>
                                    </div>
                                ) : (
                                    <div className={`space-y-2 ${friends.length > 3 ? 'max-h-[200px] overflow-y-auto scrollbar-hide' : ''} rounded-lg p-3 ${
                                        isDark ? 'bg-[#1f2329]' : 'bg-gray-100/50'
                                    }`}>
                                        {friends.map((friend) => {
                                            const isSelected = isFriendSelected(friend);
                                            return (
                                                <div
                                                    key={friend._id}
                                                    onClick={() => handleFriendSelect(friend)}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                                        isSelected
                                                            ? (isDark 
                                                                ? 'bg-green-600/10 border-green-600' 
                                                                : 'bg-green-50 border-green-500')
                                                            : (isDark 
                                                                ? 'bg-dark-bg border-gray-700 hover:border-gray-600' 
                                                                : 'bg-white border-gray-200 hover:border-gray-300')
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => { }}
                                                        className="w-5 h-5 rounded text-green-600 focus:ring-green-600 pointer-events-none flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-medium text-base truncate ${
                                                            isDark ? 'text-white' : 'text-gray-900'
                                                        }`}>{friend.name}</p>
                                                        {friend.email && (
                                                            <p className={`text-sm truncate ${
                                                                isDark ? 'text-gray-500' : 'text-gray-600'
                                                            }`}>{friend.email}</p>
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
                        <div className={`p-4 border rounded-xl ${
                            isDark 
                                ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                                : 'bg-red-50 border-red-300 text-red-600'
                        }`}>
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className={`flex-shrink-0 p-4 border-t flex items-center justify-between ${
                isDark ? 'bg-[#1f2329] border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="w-12" />
                <button
                    onClick={handleAddMember}
                    disabled={loading}
                    className={`px-6 py-3 rounded-full transition-colors shadow-lg disabled:opacity-50 font-semibold ${
                        isDark 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                >
                    {loading ? 'Adding...' : 'Add Members'}
                </button>
            </div>
        </div>
    );
};

export default AddMemberForm;