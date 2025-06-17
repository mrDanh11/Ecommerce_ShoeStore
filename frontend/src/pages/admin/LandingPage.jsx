// import { Link } from "react-router-dom";

// const LandingPage = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-4xl font-bold mb-6">Chào mừng Admin</h1>

//       <p className="text-lg mb-4">Đây là bảng điều khiển của bạn. Bạn có thể quản lý mọi thứ từ đây.</p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Quản lý nhân viên</h2>
//           <p className="mb-4">Xem và quản lý danh sách nhân viên của công ty.</p>
//           <Link to="/admin/employees" className="text-blue-500 hover:underline">
//             Xem chi tiết
//           </Link>
//         </div>

//         <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Quản lý sản phẩm</h2>
//           <p className="mb-4">Quản lý danh sách sản phẩm của cửa hàng.</p>
//           <Link to="/admin/products" className="text-blue-500 hover:underline">
//             Xem chi tiết
//           </Link>
//         </div>

//         <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Thống kê</h2>
//           <p className="mb-4">Xem thống kê tổng quan về cửa hàng và sản phẩm.</p>
//           <Link to="/admin/statistics" className="text-blue-500 hover:underline">
//             Xem chi tiết
//           </Link>
//         </div>

//         <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Quản lý Sale Off</h2>
//           <p className="mb-4">Xem và quản lý các chương trình giảm giá của cửa hàng.</p>
//           <Link to="/admin/sale-offs" className="text-blue-500 hover:underline">
//             Xem chi tiết
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;

import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Chào mừng Admin</h1>

      <p className="text-lg mb-4">Đây là bảng điều khiển của bạn. Bạn có thể quản lý mọi thứ từ đây.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Quản lý tài khoản</h2>
          <p className="mb-4">Xem và quản lý danh sách tài khoản.</p>
          <Link to="/admin/employees" className="text-blue-500 hover:underline">
            Xem chi tiết
          </Link>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Quản lý sản phẩm</h2>
          <p className="mb-4">Quản lý danh sách sản phẩm của cửa hàng.</p>
          <Link to="/admin/products" className="text-blue-500 hover:underline">
            Xem chi tiết
          </Link>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Thống kê</h2>
          <p className="mb-4">Xem thống kê tổng quan về cửa hàng và sản phẩm.</p>
          <Link to="/admin/statistics" className="text-blue-500 hover:underline">
            Xem chi tiết
          </Link>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Quản lý Sale Off</h2>
          <p className="mb-4">Xem và quản lý các chương trình giảm giá của cửa hàng.</p>
          <Link to="/admin/sale-offs" className="text-blue-500 hover:underline">
            Xem chi tiết
          </Link>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Quản lý khuyến mãi</h2>
          <p className="mb-4">Tạo và chỉnh sửa các voucher khuyến mãi.</p>
          <Link to="/admin/promotions" className="text-blue-500 hover:underline">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

