import React from "react";
import {
  Settings,
  IndianRupee,
  Receipt,
  UserPlus,
  ShieldCheck,
  X,
  LogOut,
} from "lucide-react";

const AdminSidebar = ({
  isOpen,
  onClose,
  isDark,
  onSettleUp,
  onAddExpense,
  onAddMember,
  onEditGroup,
  onChangeAdmin,
  onLeave,
}) => {
  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] ${
          isDark
            ? "bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800"
            : "bg-gradient-to-b from-white to-gray-50 border-gray-300"
        } border-l shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div
          className={`p-4 border-b ${
            isDark ? "border-gray-800" : "border-gray-200"
          } flex-shrink-0`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  isDark ? "bg-green-600/10" : "bg-green-100"
                }`}
              >
                <Settings
                  className={`w-5 h-5 ${
                    isDark ? "text-green-500" : "text-green-600"
                  }`}
                />
              </div>
              <h2
                className={`text-lg font-bold truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Admin Actions
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Manage your group settings
          </p>
        </div>

        {/* Sidebar Content - Scrollable */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          <button
            onClick={onSettleUp}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-300 border ${
              isDark
                ? "bg-gray-800/50 hover:bg-gray-800 border-gray-700 hover:border-green-500/50 text-white"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-green-500/50 text-gray-900"
            }`}
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                isDark ? "bg-green-600/10" : "bg-green-100"
              }`}
            >
              <IndianRupee
                className={`w-4 h-4 ${
                  isDark ? "text-green-500" : "text-green-600"
                }`}
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">Settle Up</p>
              <p
                className={`text-xs truncate ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Record payment
              </p>
            </div>
          </button>

          <button
            onClick={onAddExpense}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-300 border ${
              isDark
                ? "bg-gray-800/50 hover:bg-gray-800 border-gray-700 hover:border-green-500/50 text-white"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-green-500/50 text-gray-900"
            }`}
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                isDark ? "bg-green-600/10" : "bg-green-100"
              }`}
            >
              <Receipt
                className={`w-4 h-4 ${
                  isDark ? "text-green-500" : "text-green-600"
                }`}
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">Add Expense</p>
              <p
                className={`text-xs truncate ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Create new expense
              </p>
            </div>
          </button>

          <button
            onClick={onAddMember}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-300 border ${
              isDark
                ? "bg-gray-800/50 hover:bg-gray-800 border-gray-700 hover:border-green-500/50 text-white"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-green-500/50 text-gray-900"
            }`}
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                isDark ? "bg-green-600/10" : "bg-green-100"
              }`}
            >
              <UserPlus
                className={`w-4 h-4 ${
                  isDark ? "text-green-500" : "text-green-600"
                }`}
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">Add Member</p>
              <p
                className={`text-xs truncate ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Invite people
              </p>
            </div>
          </button>

          <div
            className={`border-t my-3 pt-3 ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <p
              className={`text-xs uppercase tracking-wider mb-2 px-2 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Settings
            </p>
          </div>

          <button
            onClick={onEditGroup}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-300 border ${
              isDark
                ? "bg-gray-800/50 hover:bg-gray-800 border-gray-700 hover:border-yellow-500/50 text-white"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-yellow-500/50 text-gray-900"
            }`}
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                isDark ? "bg-yellow-500/10" : "bg-yellow-100"
              }`}
            >
              <Settings
                className={`w-4 h-4 ${
                  isDark ? "text-yellow-500" : "text-yellow-600"
                }`}
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">Edit Group</p>
              <p
                className={`text-xs truncate ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Modify or delete
              </p>
            </div>
          </button>

          <button
            onClick={onChangeAdmin}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-300 border ${
              isDark
                ? "bg-gray-800/50 hover:bg-gray-800 border-gray-700 hover:border-blue-500/50 text-white"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-blue-500/50 text-gray-900"
            }`}
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                isDark ? "bg-blue-500/10" : "bg-blue-100"
              }`}
            >
              <ShieldCheck
                className={`w-4 h-4 ${
                  isDark ? "text-blue-500" : "text-blue-600"
                }`}
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">Change Admin</p>
              <p
                className={`text-xs truncate ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Transfer rights
              </p>
            </div>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div
          className={`flex-shrink-0 p-4 border-t ${
            isDark
              ? "border-gray-800 bg-gray-950"
              : "border-gray-200 bg-gray-100"
          }`}
        >
          <button
            onClick={onLeave}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 shadow-lg text-sm"
          >
            <LogOut className="w-4 h-4" />
            Leave Group
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;