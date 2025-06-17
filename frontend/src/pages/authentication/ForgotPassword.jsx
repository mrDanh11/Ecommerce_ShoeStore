import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4004/api/auth/forgot-password", { email });
      setMessage(" Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.");
      setError("");
    } catch (err) {
      setError(" Gửi email thất bại. Vui lòng thử lại.");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center text-indigo-700">🔑 Quên mật khẩu</h2>
        <p className="text-gray-600 text-sm text-center">
          Nhập email đã đăng ký để nhận liên kết khôi phục mật khẩu.
        </p>

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            placeholder="Nhập email của bạn"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition"
          >
            📧 Gửi liên kết khôi phục
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
