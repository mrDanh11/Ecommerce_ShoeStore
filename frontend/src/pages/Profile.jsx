import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:4004/api/auth/getme', {
          withCredentials: true, // 🔥 Cần thiết để gửi cookie
        });

        console.log("✅ Nhận user:", response.data.user);
        setUser(response.data.user);
        setError(null);
      } catch (err) {
        console.error("❌ Không lấy được user:", err);
        setError(err?.response?.data?.message || "Không thể xác thực người dùng");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4004/api/auth/logout', {}, {
        withCredentials: true,
      });
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error("❌ Đăng xuất lỗi:", err);
      alert("Đăng xuất thất bại.");
    }
  };

  if (loading) {
    return <p>🔄 Đang tải thông tin...</p>;
  }

  if (!user) {
    return (
      <div>
        <h3>⚠️ Bạn chưa đăng nhập</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={() => navigate('/login')}>🔐 Chuyển đến trang đăng nhập</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>👤 Thông tin người dùng</h2>
      <p><strong>Tên đăng nhập:</strong> {user.tendangnhap}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Vai trò:</strong> {user.vaitro ?? user.marole}</p>

      <button onClick={handleLogout} style={{ marginTop: 20 }}>
        🚪 Đăng xuất
      </button>
    </div>
  );
};

export default Profile;
