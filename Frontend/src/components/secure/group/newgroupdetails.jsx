import React, { useEffect, useState, useRef, useCallback, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTheme } from "../../../context/themeContext";
import { useSocket } from "../../../context/socketContext";
import { useOutletContext } from "react-router-dom";
import useStore from "../../../store/useStore";

// Import skeleton loader
import GroupDetailsSkeleton from "./grouploader";

// Import the GroupBanner component
import GroupBanner from "./GroupBanner";

// Import the GroupInfoSidebar component
import GroupInfoSidebar from "./GroupInfoSidebar";

// Import the AdminSidebar component
import AdminSidebar from "../admin/adminsidebar";

// Import new chat-view components
import TransactionChatView from "./TransactionChatView";
import BottomActionBar from "./BottomActionBar";
import ActionMenu from "./ActionMenu";
import FilterMenu from "./FilterMenu";

// Lazy load the form components
const AddExpenseForm = lazy(() => import("../admin/addexpense"));
const SettleUpForm = lazy(() => import("../admin/settleup"));
const EditExpenseForm = lazy(() => import("../admin/editexpense"));
const DeleteExpenseForm = lazy(() => import("../admin/deleteexpense"));
const AddMemberForm = lazy(() => import("../admin/addmember"));
const GroupEditForm = lazy(() => import("../admin/editgroup"));
const ChangeAdminForm = lazy(() => import("../admin/changeadmin"));

const NewGroupDetails = () => {
  const { isDark } = useTheme();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
  const { friends, requests, onRefreshFriends } = useOutletContext();

  // Chat view specific states
  const [filterType, setFilterType] = useState("expense"); // Default to expense only
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [isDeleteExpenseOpen, setIsDeleteExpenseOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isGroupEditOpen, setIsGroupEditOpen] = useState(false);
  const [isChangeAdminOpen, setIsChangeAdminOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [settleUpData, setSettleUpData] = useState(null);

  // Get socket instance
  const { joinGroup, leaveGroup: leaveSocketGroup, onGroupUpdate, isConnected: socketConnected } = useSocket();

  // Get group details from Zustand store
  const { 
    groupDetails: allGroupDetails, 
    isLoadingGroupDetails,
    fetchGroupDetails,
    leaveGroup,
    handleSocketGroupUpdate
  } = useStore();

  // Get this group's details from the store
  const groupDetails = allGroupDetails[groupId];
  const isLoading = isLoadingGroupDetails[groupId] || false;

  // Get current user ID
  const currentUserId = Cookies.get("authToken") 
    ? JSON.parse(atob(Cookies.get("authToken").split(".")[1])).userId 
    : null;

  // Get current user name from group members
  const currentUserName = groupDetails?.group?.members?.find(
    m => m.userId?._id === currentUserId || m.userId === currentUserId
  )?.name || "";

  // Fetch group details only if we don't have them cached
  useEffect(() => {
    if (!isDeleted && groupId && !groupDetails) {
      fetchGroupDetails(groupId);
    }
  }, [groupId, isDeleted, fetchGroupDetails, groupDetails]);

  // Store the current groupId in a ref so we can access it in the socket callback
  const currentGroupIdRef = useRef(groupId);
  
  useEffect(() => {
    currentGroupIdRef.current = groupId;
  }, [groupId]);

  // Stable callback for socket updates using useCallback
  const handleGroupUpdate = useCallback(({ groupId: updatedGroupId, action }) => {
    console.log(`📡 Real-time update: ${action} for group ${updatedGroupId}`);
    if (updatedGroupId === currentGroupIdRef.current) {
      console.log('🔄 Refreshing group data...');
      handleSocketGroupUpdate(updatedGroupId);
    }
  }, [handleSocketGroupUpdate]);

  // Join/leave socket room and listen for real-time updates
  useEffect(() => {
    if (!isDeleted && groupId && socketConnected) {
      console.log('🔌 Socket connected, joining group:', groupId);
      
      // Join the group room
      joinGroup(groupId);

      // Listen for real-time updates with stable callback
      const unsubscribe = onGroupUpdate(handleGroupUpdate);

      return () => {
        console.log('🔌 Leaving group:', groupId);
        leaveSocketGroup(groupId);
        if (unsubscribe) unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, isDeleted, socketConnected]);

  // Auto-refresh on window focus (when user returns to app)
  useEffect(() => {
    const handleFocus = () => {
      if (!isDeleted && groupId && groupDetails) {
        console.log('👁️ Window focused, refreshing group data...');
        fetchGroupDetails(groupId);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [groupId, isDeleted, groupDetails, fetchGroupDetails]);

  // Check if current user is admin
  useEffect(() => {
    if (groupDetails?.group?.admin) {
      const adminId = typeof groupDetails.group.admin === 'object' 
        ? groupDetails.group.admin._id 
        : groupDetails.group.admin;
      setIsAdmin(adminId === currentUserId);
    }
  }, [groupDetails, currentUserId]);

  // Handler functions
  const handleInfoClick = () => {
    setIsGroupInfoOpen(true);
  };

  const handleSearchClick = () => {
    alert("Search clicked! (Feature coming soon)");
  };

  const handleMenuClick = () => {
    if (isAdmin) {
      setIsAdminSidebarOpen(true);
    }
  };

  const handleAddClick = () => {
    setIsActionMenuOpen(true);
  };

  const handleFilterClick = () => {
    setIsFilterMenuOpen(true);
  };

  const handleLeave = async () => {
    try {
      await leaveGroup(groupId);
      navigate("/home");
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const toggleAddExpenseForm = () => {
    setIsAddExpenseOpen(!isAddExpenseOpen);
    setIsActionMenuOpen(false);
    setIsAdminSidebarOpen(false);
  };

  const toggleSettleUpForm = () => {
    setSettleUpData(null);
    setIsSettleUpOpen(!isSettleUpOpen);
    setIsActionMenuOpen(false);
    setIsAdminSidebarOpen(false);
  };

  const toggleAddMemberForm = () => {
    setIsAddMemberOpen(!isAddMemberOpen);
    setIsAdminSidebarOpen(false);
  };

  const toggleGroupEditForm = () => {
    setIsGroupEditOpen(!isGroupEditOpen);
    setIsAdminSidebarOpen(false);
  };

  const toggleChangeAdminForm = () => {
    setIsChangeAdminOpen(!isChangeAdminOpen);
    setIsAdminSidebarOpen(false);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setIsEditExpenseOpen(true);
  };

  const handleDeleteExpense = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteExpenseOpen(true);
  };

  const toggleEditExpenseForm = () => {
    setIsEditExpenseOpen(!isEditExpenseOpen);
    setSelectedExpense(null);
  };

  const toggleDeleteExpenseForm = () => {
    setIsDeleteExpenseOpen(!isDeleteExpenseOpen);
    setSelectedExpense(null);
  };

  const handleSettleUpFromSummary = (from, to, amount) => {
    setSettleUpData({ payer: from, receiver: to, amount });
    setIsSettleUpOpen(true);
  };

  // Show skeleton loader ONLY when loading and no cached data
  if (isLoading && !groupDetails) {
    return <GroupDetailsSkeleton isDark={isDark} />;
  }

  if (!groupDetails && !isLoading) {
    return (
      <div className={`h-full flex items-center justify-center ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}>
        <div className="text-center">
          <p className="text-xl">Group not found</p>
        </div>
      </div>
    );
  }

  // Don't render if data isn't ready yet
  if (!groupDetails) {
    return null;
  }

  if (isDeleted) return null;

  return (
    <div
      className={`h-full flex flex-col relative overflow-hidden ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Group Banner */}
      <GroupBanner
        groupName={groupDetails.group.name}
        isDark={isDark}
        isAdmin={isAdmin}
        onInfoClick={handleInfoClick}
        onSearchClick={handleSearchClick}
        onMenuClick={handleMenuClick}
        socketConnected={socketConnected}
      />

      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={isAdminSidebarOpen}
        onClose={() => setIsAdminSidebarOpen(false)}
        isDark={isDark}
        onSettleUp={toggleSettleUpForm}
        onAddExpense={toggleAddExpenseForm}
        onAddMember={toggleAddMemberForm}
        onEditGroup={toggleGroupEditForm}
        onChangeAdmin={toggleChangeAdminForm}
        onLeave={handleLeave}
      />

      {/* Transaction Chat View */}
      <TransactionChatView
        expenses={groupDetails.group.expenses || []}
        transactions={groupDetails.group.transactionHistory || []}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        isDark={isDark}
        isAdmin={isAdmin}
        filterType={filterType}
        onEditExpense={handleEditExpense}
        onDeleteExpense={handleDeleteExpense}
      />

      {/* Bottom Action Bar with Both Menus */}
      <div className="relative">
        <BottomActionBar
          isDark={isDark}
          isAdmin={isAdmin}
          onAddClick={handleAddClick}
          onFilterClick={handleFilterClick}
          filterType={filterType}
        />
        
        {/* Filter Menu */}
        <FilterMenu
          isOpen={isFilterMenuOpen}
          onClose={() => setIsFilterMenuOpen(false)}
          isDark={isDark}
          currentFilter={filterType}
          onFilterChange={setFilterType}
        />
        
        {/* Action Menu (Add Expense/Settle Up) */}
        <ActionMenu
          isOpen={isActionMenuOpen}
          onClose={() => setIsActionMenuOpen(false)}
          isDark={isDark}
          onAddExpense={toggleAddExpenseForm}
          onSettleUp={toggleSettleUpForm}
        />
      </div>

      {/* Group Info Sidebar */}
      <GroupInfoSidebar
        isOpen={isGroupInfoOpen}
        onClose={() => setIsGroupInfoOpen(false)}
        isDark={isDark}
        groupName={groupDetails.group.name}
        members={groupDetails.group.members}
        onLeave={handleLeave}
        currentUserId={currentUserId}
        admin={groupDetails.group.admin}
        isAdmin={isAdmin}
        groupId={groupId}
        friends={friends || []}
        requests={requests || []}
        onFriendRequestSent={onRefreshFriends}
        balances={groupDetails.group.balances || []}
        membersWithSpend={groupDetails.membersWithSpend || []}
        summary={groupDetails.summary || []}
        onSettleUp={handleSettleUpFromSummary}
      />

      {/* Add Expense Form */}
      {isAddExpenseOpen && (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <AddExpenseForm
            groupId={groupId}
            onClose={toggleAddExpenseForm}
            isDark={isDark}
          />
        </Suspense>
      )}

      {/* Settle Up Form */}
      {isSettleUpOpen && (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <SettleUpForm
            groupId={groupId}
            onClose={() => {
              setSettleUpData(null);
              setIsSettleUpOpen(false);
            }}
            isDark={isDark}
            initialData={settleUpData}
          />
        </Suspense>
      )}

      {/* Edit Expense Form */}
      {isEditExpenseOpen && selectedExpense && (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <EditExpenseForm
            groupId={groupId}
            expense={selectedExpense}
            onClose={toggleEditExpenseForm}
            isDark={isDark}
          />
        </Suspense>
      )}

      {/* Delete Expense Form */}
      {isDeleteExpenseOpen && selectedExpense && (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <DeleteExpenseForm
            groupId={groupId}
            expense={selectedExpense}
            onClose={toggleDeleteExpenseForm}
            isDark={isDark}
          />
        </Suspense>
      )}

      {/* Add Member Form */}
      {isAddMemberOpen && (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <AddMemberForm
            groupId={groupId}
            onClose={toggleAddMemberForm}
            isDark={isDark}
          />
        </Suspense>
      )}

      {/* Edit Group Form */}
      {isGroupEditOpen && (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <GroupEditForm
            groupId={groupId}
            onClose={toggleGroupEditForm}
            isDark={isDark}
          />
        </Suspense>
      )}

      {/* Change Admin Form */}
      {isChangeAdminOpen && (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ChangeAdminForm
            groupId={groupId}
            onClose={toggleChangeAdminForm}
            isDark={isDark}
          />
        </Suspense>
      )}
    </div>
  );
};

export default NewGroupDetails;
