import React from "react";
import PropTypes from "prop-types";
import { AlertTriangle, Trash2 } from "lucide-react";

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      iconBg: "bg-red-600/20",
      iconColor: "text-red-500",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      iconBg: "bg-orange-600/20",
      iconColor: "text-orange-500",
      button: "bg-orange-600 hover:bg-orange-700",
    },
    info: {
      iconBg: "bg-blue-600/20",
      iconColor: "text-blue-500",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    success: {
      iconBg: "bg-green-600/20",
      iconColor: "text-green-500",
      button: "bg-green-600 hover:bg-green-700",
    },
  };

  const styles = typeStyles[type] || typeStyles.danger;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#2a2d35] rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-700/50">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-14 h-14 ${styles.iconBg} rounded-2xl flex items-center justify-center`}>
            <AlertTriangle className={`w-7 h-7 ${styles.iconColor}`} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 text-center">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-400 text-sm mb-6 text-center leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#3a3d45] hover:bg-[#45484f] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 text-sm font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-6 py-3 ${styles.button} disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              </>
            ) : (
              <>
                {type === 'danger' && <Trash2 className="w-4 h-4" />}
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(["danger", "warning", "info", "success"]),
  loading: PropTypes.bool,
};

export default ConfirmationDialog;
