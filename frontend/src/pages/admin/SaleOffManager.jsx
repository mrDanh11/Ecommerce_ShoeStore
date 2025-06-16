
import { useState, useEffect } from "react"
import { FiSearch, FiFilter, FiRefreshCw, FiEdit, FiTrash2, FiPlus } from "react-icons/fi"
import dayjs from "dayjs"
import { saleOffService } from "../../services/saleOffService"
import SaleOffEditModal from "../../components/manager-components/SaleOffEditModal"
import SaleOffCreateModal from "../../components/manager-components/SaleOffCreateModal"
import ConfirmDialog from "../../components/manager-components/ConfirmDialog"

const SaleOffManager = () => {
  const [saleOffs, setSaleOffs] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Modal states
  const [editModal, setEditModal] = useState({ isOpen: false, saleOff: null })
  const [createModal, setCreateModal] = useState({ isOpen: false })
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, saleOff: null })

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  // Filter states
  const [filters, setFilters] = useState({
    saleOffId: "",
    minValue: "",
    maxValue: "",
    status: "",
    startDate: "",
    endDate: "",
  })

  const itemsPerPage = 10

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 5000)
  }

  // Load data
  const loadSaleOffs = async (page = 1) => {
    setLoading(true)
    try {
      const offset = (page - 1) * itemsPerPage
      const result = await saleOffService.getSaleOffs(itemsPerPage, offset, filters)
      const countResult = await saleOffService.getSaleOffCount(filters)

      setSaleOffs(result.data || [])
      setTotalRecords(countResult.count || 0)
      setTotalPages(Math.ceil((countResult.count || 0) / itemsPerPage) || 1)
    } catch (error) {
      console.error("Error loading sale offs:", error)
      setSaleOffs([])
      setTotalRecords(0)
      setTotalPages(1)
      showNotification("Lỗi khi tải dữ liệu: " + error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSaleOffs(currentPage)
  }, [currentPage])

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1)
    loadSaleOffs(1)
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      saleOffId: "",
      minValue: "",
      maxValue: "",
      status: "",
      startDate: "",
      endDate: "",
    })
    setCurrentPage(1)
    setTimeout(() => loadSaleOffs(1), 100)
  }

  // Handle create sale-off
  const handleCreateSaleOff = async (saleOffData) => {
    try {
      await saleOffService.createSaleOff(saleOffData)
      showNotification("Tạo mã giảm giá thành công!")
      loadSaleOffs(currentPage)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // Handle edit sale-off
  const handleEditSaleOff = (saleOff) => {
    setEditModal({ isOpen: true, saleOff })
  }

  // Handle update sale-off
  const handleUpdateSaleOff = async (id, saleOffData) => {
    try {
      await saleOffService.updateSaleOff(id, saleOffData)
      showNotification("Cập nhật mã giảm giá thành công!")
      loadSaleOffs(currentPage)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // Handle delete sale-off
  const handleDeleteSaleOff = (saleOff) => {
    setDeleteDialog({ isOpen: true, saleOff })
  }

  // Confirm delete sale-off
  const confirmDeleteSaleOff = async () => {
    try {
      await saleOffService.deleteSaleOff(deleteDialog.saleOff.masaleoff)
      showNotification("Xóa mã giảm giá thành công!")
      setDeleteDialog({ isOpen: false, saleOff: null })
      loadSaleOffs(currentPage)
    } catch (error) {
      showNotification("Lỗi khi xóa mã giảm giá: " + error.message, "error")
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY")
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    if (status === true) {
      return `${baseClasses} bg-green-100 text-green-800`
    } else {
      return `${baseClasses} bg-red-100 text-red-800`
    }
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
              <p className="text-gray-600 mt-1">Quản lý và theo dõi các mã giảm giá của cửa hàng</p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FiFilter className="w-4 h-4" />
                Bộ lọc
              </button>
              <button
                onClick={() => loadSaleOffs(currentPage)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                Làm mới
              </button>
              <button
                onClick={() => setCreateModal({ isOpen: true })}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Thêm mới
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
                <input
                  type="text"
                  value={filters.saleOffId}
                  onChange={(e) => handleFilterChange("saleOffId", e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá trị tối thiểu (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minValue}
                  onChange={(e) => handleFilterChange("minValue", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá trị tối đa (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.maxValue}
                  onChange={(e) => handleFilterChange("maxValue", e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả</option>
                  <option value={true}>Khả dụng</option>
                  <option value={false}>Không khả dụng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={applyFilters}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiSearch className="w-4 h-4" />
                Tìm kiếm
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đặt lại
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="text-sm text-gray-600">
            Tổng cộng: <span className="font-medium text-gray-900">{totalRecords}</span> mã giảm giá
            {Object.values(filters).some((v) => v !== "") && <span className="ml-2 text-blue-600">(đã lọc)</span>}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã giảm giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá trị (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày bắt đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày kết thúc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : saleOffs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      Không có dữ liệu phù hợp với bộ lọc
                    </td>
                  </tr>
                ) : (
                  saleOffs.map((saleOff, index) => (
                    <tr key={saleOff.masaleoff || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{saleOff.masaleoff}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{saleOff.giatri}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(saleOff.trangthai)}>
                          {saleOff.trangthai === true ? "Khả dụng" : "Không khả dụng"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(saleOff.ngaybatdau)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(saleOff.ngayketthuc)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditSaleOff(saleOff)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSaleOff(saleOff)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Xóa"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && saleOffs.length > 0 && totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến{" "}
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalRecords)}</span> của{" "}
                    <span className="font-medium">{totalRecords}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>

                    {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                      let page
                      if (totalPages <= 5) {
                        page = index + 1
                      } else if (currentPage <= 3) {
                        page = index + 1
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + index
                      } else {
                        page = currentPage - 2 + index
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <SaleOffEditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, saleOff: null })}
          saleOff={editModal.saleOff}
          onSave={handleUpdateSaleOff}
        />

        <SaleOffCreateModal
          isOpen={createModal.isOpen}
          onClose={() => setCreateModal({ isOpen: false })}
          onCreate={handleCreateSaleOff}
        />

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, saleOff: null })}
          onConfirm={confirmDeleteSaleOff}
          title="Xác nhận xóa mã giảm giá"
          message={`Bạn có chắc chắn muốn xóa mã giảm giá "${deleteDialog.saleOff?.masaleoff}"? Hành động này không thể hoàn tác.`}
          confirmText="Xóa"
          cancelText="Hủy"
          type="danger"
        />
      </div>
    </div>
  )
}

export default SaleOffManager
