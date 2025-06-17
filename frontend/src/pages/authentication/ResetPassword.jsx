import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("❌ Mật khẩu nhập lại không khớp");
      setMessage("");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4004/api/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage("✅ Mật khẩu đã được cập nhật thành công!");
      setError("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Có lỗi xảy ra");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">🔐 Đặt lại mật khẩu</h2>

        {message && <p className="text-green-600 mb-2 text-sm">{message}</p>}
        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="w-full border p-3 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="w-full border p-3 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Cập nhật mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
