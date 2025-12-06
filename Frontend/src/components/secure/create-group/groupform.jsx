import React, { useState } from 'react';
import { Users, X, Plus, Check } from 'lucide-react';

const GroupForm = ({ members, setMembers, onSubmit, message, error }) => {
  const [groupName, setGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const addMember = () => {
    setMembers([...members, { name: '', email: '' }]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(groupName);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 shadow-2xl border border-gray-800 transition-all duration-300 ">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-700/10 rounded-lg">
          <Users className="w-6 h-6 text-green-700" />
        </div>
        <h2 className="text-2xl font-bold text-white">Create New Group</h2>
      </div>

      <div className="space-y-4">
        {/* Group Name Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20"
          />
        </div>

        {/* Members Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-300">Members</h3>
            <span className="text-sm text-gray-500">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Members List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {members.map((member, index) => (
              <div
                key={index}
                className="group bg-gray-900/70 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all duration-300 animate-fadeIn"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Member name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    disabled={member.isFriend}
                    className="flex-1 p-3 rounded-lg border border-gray-700 bg-gray-950 text-white placeholder-gray-600 focus:outline-none focus:border-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={member.email}
                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                    disabled={member.isFriend}
                    className="flex-1 p-3 rounded-lg border border-gray-700 bg-gray-950 text-white placeholder-gray-600 focus:outline-none focus:border-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={() => removeMember(index)}
                    className="sm:w-12 h-12 flex items-center justify-center bg-red-600/10 hover:bg-red-600/20 border border-red-600/50 hover:border-red-600 text-red-500 rounded-lg transition-all duration-300 group-hover:scale-105"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {member.isFriend && (
                  <div className="mt-2 flex items-center gap-2 text-green-700 text-sm">
                    <Check className="w-4 h-4" />
                    <span>From friends list</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Member Button */}
          <button
            onClick={addMember}
            className="w-full p-4 bg-gray-900 hover:bg-gray-800 border-2 border-dashed border-gray-700 hover:border-green-700 text-gray-400 hover:text-green-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Add Member</span>
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !groupName.trim()}
          className="w-full p-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transform active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating...
            </span>
          ) : (
            'Create Group'
          )}
        </button>

        {/* Messages */}
        {message && (
          <div className="p-4 bg-green-700/10 border border-green-700/50 rounded-xl text-green-700 text-center animate-fadeIn">
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-center animate-fadeIn">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupForm;