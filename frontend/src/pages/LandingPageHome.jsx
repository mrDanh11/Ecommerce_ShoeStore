// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

const LandingPageHome = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero section */}
      <section className="bg-gray-100 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Chào mừng đến với ShoeStore 👟
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Khám phá bộ sưu tập giày thời trang mới nhất – phong cách và thoải mái cho mọi dịp.
        </p>
        <Link
          to="/collections"
          className="bg-black text-white px-6 py-3 rounded-xl text-lg hover:bg-gray-800 transition"
        >
          Bắt đầu mua sắm
        </Link>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Vì sao chọn chúng tôi?</h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div>
            <img src="https://img.icons8.com/color/96/000000/shoes.png" alt="Icon" className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">500+ mẫu giày</h3>
            <p>Được cập nhật liên tục – luôn hợp thời và đa dạng phong cách.</p>
          </div>
          <div>
            <img src="https://img.icons8.com/color/96/000000/delivery.png" alt="Icon" className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Giao hàng nhanh</h3>
            <p>2-3 ngày toàn quốc, hỗ trợ đổi trả trong vòng 7 ngày.</p>
          </div>
          <div>
            <img src="https://img.icons8.com/color/96/000000/customer-support.png" alt="Icon" className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Hỗ trợ tận tình</h3>
            <p>Luôn sẵn sàng tư vấn size, kiểu dáng phù hợp cho bạn.</p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-black text-white py-16 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Sẵn sàng chọn đôi giày phù hợp với bạn?
        </h2>
        <p className="mb-8 text-lg">
          Mua sắm dễ dàng – giá tốt – phong cách chất!
        </p>
        <Link
          to="/collections"
          className="bg-white text-black px-6 py-3 rounded-xl text-lg font-semibold hover:bg-gray-200 transition"
        >
          Khám phá sản phẩm
        </Link>
      </section>
    </div>
  );
};

export default LandingPageHome;