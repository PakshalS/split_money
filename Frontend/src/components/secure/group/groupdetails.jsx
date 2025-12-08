import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import { useTheme } from "../../../context/themeContext";
import {
  ChevronLeft,
  Settings,
  IndianRupee,
  Receipt,
  UserPlus,
  ShieldCheck,
  X,
  LogOut,
  Menu,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

// Import skeleton loader
import GroupDetailsSkeleton from "./grouploader";

// Lazy load the components
import AddExpenseForm from "../admin/addexpense";
import SettleUpForm from "../admin/settleup";
import GroupEditForm from "../admin/editgroup";
import AddMemberForm  from "../admin/addmember";
import ChangeAdminForm from "../admin/changeadmin";

// Import the new components
import SummaryComponent from "./summary";
import ExpensesComponent from "./expenses";
import BalancesComponent from "./balances";
import SettleUpsComponent from "./settleups";
import MembersComponent from "./members";

const GroupDetails = () => {
  const { isDark } = useTheme();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [message1, setMessage1] = useState("");
  const [error1, setError1] = useState("");
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupDetails, setGroupDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);
  const [isGroupEditOpen, setIsGroupEditOpen] = useState(false);
  const [isOpenAddMember, setIsOpenAddMember] = useState(false);
  const [isChangeAdminOpen, setIsChangeAdminOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { onRefreshGroups } = useOutletContext();

  const fetchGroupDetails = async () => {
    if (isDeleted) return;
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await axios.get(
        `https://split-money-api.vercel.app/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setError("");
      setGroupDetails(response.data);
      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      setIsAdmin(response.data.group.admin._id === userId);
      setIsLoading(false);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.error || "Error fetching group details");
      console.error("Error fetching group details:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDeleted) {
      fetchGroupDetails();
    }
  }, [groupId, isDeleted]);

  const debouncedFetchGroupDetails = debounce(() => {
    if (!isDeleted) {
      fetchGroupDetails();
    }
  }, 300);

  const toggleAddExpenseForm = () => {
    setIsAddExpenseOpen(!isAddExpenseOpen);
    setIsSidebarOpen(false);
  };
  const toggleSettleUpForm = () => {
    setIsSettleUpOpen(!isSettleUpOpen);
    setIsSidebarOpen(false);
  };
  const toggleGroupEditForm = () => {
    setIsGroupEditOpen(!isGroupEditOpen);
    setIsSidebarOpen(false);
  };
  const toggleChangeAdminForm = () => {
    setIsChangeAdminOpen(!isChangeAdminOpen);
    setIsSidebarOpen(false);
  };
  const toggleAddMemberForm = () => {
    setIsOpenAddMember(!isOpenAddMember);
    setIsSidebarOpen(false);
  };
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLeave = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      if (window.confirm("Are you sure you want to leave?")) {
        await axios.delete(
          `https://split-money-api.vercel.app/groups/${groupId}/leave`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Left Group successfully!");
        if (onRefreshGroups) onRefreshGroups();
        navigate("/home");
      }
    } catch (error) {
      console.error("Error leaving:", error);
      setError1(error.response?.data?.error || "Error leaving");
    }
  };

  const handleback = () => {
    navigate("/home");
  };

  // Show skeleton loader while loading
  if (isLoading) {
    return <GroupDetailsSkeleton isDark={isDark} />;
  }

  if (!groupDetails) {
    return (
      <div
        className={`h-full flex items-center justify-center ${
          isDark ? "bg-gray-800" : "bg-gray-50"
        } ${isDark ? "text-white" : "text-gray-900"}`}
      >
        <div className="text-xl">Error loading group details.</div>
      </div>
    );
  }

  if (isDeleted) return null;

  return (
    <div
      className={`h-full flex flex-col relative ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`flex-shrink-0 ${
          isDark
            ? "bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        } border-b shadow-lg`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Back Button (Mobile only) */}
            <button
              onClick={handleback}
              className={`md:hidden flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                  : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Center: Group Info */}
            <div className="flex-1 min-w-0">
              <h1
                className={`text-base sm:text-lg font-bold truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {groupDetails.group.name}
              </h1>
              <p
                className={`text-xs truncate ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <span className="text-green-600">Admin:</span>{" "}
                {groupDetails.group.admin.name}
              </p>
            </div>

            {/* Right: Admin Actions or Leave Button */}
            {isAdmin ? (
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300 shadow-lg"
              >
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Admin</span>
              </button>
            ) : (
              <button
                onClick={handleLeave}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Leave</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay - Scoped to this component */}
      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar - Scoped to this component */}
      <div
        className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] ${
          isDark
            ? "bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800"
            : "bg-gradient-to-b from-white to-gray-50 border-gray-300"
        } border-l shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
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
              onClick={toggleSidebar}
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
            onClick={toggleSettleUpForm}
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
            onClick={toggleAddExpenseForm}
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
            onClick={toggleAddMemberForm}
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
            onClick={toggleGroupEditForm}
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
            onClick={toggleChangeAdminForm}
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
            onClick={handleLeave}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 shadow-lg text-sm"
          >
            <LogOut className="w-4 h-4" />
            Leave Group
          </button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-hide ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Summary Component */}
          <SummaryComponent summary={groupDetails.summary} isDark={isDark} />

          {/* Expenses Component */}
          <ExpensesComponent
            expenses={groupDetails.group.expenses}
            isAdmin={isAdmin}
            groupId={groupId}
            onExpenseUpdated={debouncedFetchGroupDetails}
            isDark={isDark}
          />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Balances Component */}
            <BalancesComponent
              balances={groupDetails.group.balances}
              isDark={isDark}
            />

            {/* Settle Ups Component */}
            <SettleUpsComponent
              transactions={groupDetails.group.transactionHistory}
              isDark={isDark}
            />
          </div>

          {/* Members Component */}
          <MembersComponent
            members={groupDetails.group.members}
            isAdmin={isAdmin}
            groupId={groupId}
            onMemberRemoved={debouncedFetchGroupDetails}
            isDark={isDark}
          />

          {/* Messages */}
          {message && (
            <div className="p-3 bg-green-600/10 border border-green-500/50 rounded-lg text-green-500 text-center text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center text-sm">
              {error}
            </div>
          )}
          {message1 && (
            <div className="p-3 bg-green-600/10 border border-green-500/50 rounded-lg text-green-500 text-center text-sm">
              {message1}
            </div>
          )}
          {error1 && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center text-sm">
              {error1}
            </div>
          )}
        </div>
      </div>

      {/* Admin Forms - Each wrapped in its own Suspense with ModalSkeleton */}
      {isAddExpenseOpen && (
          <AddExpenseForm
            groupId={groupId}
            onClose={() => {
              toggleAddExpenseForm();
              debouncedFetchGroupDetails();
            }}
            isDark={isDark}
          />
      )}
      
      {isOpenAddMember && (
          <AddMemberForm
            groupId={groupId}
            onClose={() => {
              toggleAddMemberForm();
              debouncedFetchGroupDetails();
            }}
            isDark={isDark}
          />
      )}
      
      {isSettleUpOpen && (
          <SettleUpForm
            groupId={groupId}
            onClose={() => {
              toggleSettleUpForm();
              debouncedFetchGroupDetails();
            }}
            isDark={isDark}
          />
      )}
      
      {isGroupEditOpen && (
          <GroupEditForm
            groupId={groupId}
            setIsDeleted={setIsDeleted}
            onClose={() => {
              toggleGroupEditForm();
              debouncedFetchGroupDetails();
            }}
            isDark={isDark}
          />
      )}
      
      {isChangeAdminOpen && (
          <ChangeAdminForm
            groupId={groupId}
            onClose={() => {
              toggleChangeAdminForm();
              debouncedFetchGroupDetails();
            }}
            isDark={isDark}
          />
      )}

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

export default GroupDetails;