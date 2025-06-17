import { FiAlertTriangle } from "react-icons/fi"

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "danger",
}) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-600",
          button: "bg-red-600 hover:bg-red-700",
        }
      case "warning":
        return {
          icon: "text-yellow-600",
          button: "bg-yellow-600 hover:bg-yellow-700",
        }
      default:
        return {
          icon: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className={`flex-shrink-0 ${styles.icon}`}>
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${styles.button}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
