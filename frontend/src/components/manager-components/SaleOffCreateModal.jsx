import { useState } from "react"
import { FiX, FiSave, FiLoader } from "react-icons/fi"
import dayjs from "dayjs"

const SaleOffCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    value: "",
    status: true,
    startDate: "",
    endDate: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Validate value
    if (!formData.value || formData.value === "") {
      newErrors.value = "Giá trị giảm giá là bắt buộc"
    } else if (isNaN(formData.value) || formData.value < 0 || formData.value > 100) {
      newErrors.value = "Giá trị phải là số từ 0 đến 100"
    }

    // Validate dates
    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu là bắt buộc"
    }

    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc"
    }

    if (formData.startDate && formData.endDate) {
      const startDate = dayjs(formData.startDate)
      const endDate = dayjs(formData.endDate)

      if (endDate.isBefore(startDate)) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onCreate({
        value: Number.parseFloat(formData.value),
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
      })
      handleClose()
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setFormData({
        value: "",
        status: true,
        startDate: "",
        endDate: "",
      })
      setErrors({})
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tạo mã giảm giá mới</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá trị giảm giá (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.value ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nhập giá trị từ 0 đến 100"
            />
            {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value === "true")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={true}>Khả dụng</option>
              <option value={false}>Không khả dụng</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.startDate ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày kết thúc <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.endDate ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Tạo mã giảm giá
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SaleOffCreateModal
