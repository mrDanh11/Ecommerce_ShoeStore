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
          withCredentials: true,
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

  const getRoleName = (vaitro) => {
    switch (vaitro) {
      case 1:
        return "Quản lý (Admin)";
      case 2:
        return "Khách hàng";
      case 3:
        return "Nhân viên bán hàng";
      default:
        return "Không xác định";
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

  const role = user.vaitro ?? user.marole;

  return (
    <div style={{ padding: 20 }}>
      <h2>👤 Thông tin người dùng</h2>
      <p><strong>Tên đăng nhập:</strong> {user.tendangnhap}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Vai trò:</strong> {getRoleName(role)}</p>

      {role === 1 && (
        <button
          onClick={() => navigate('/admin')}
          style={{ marginTop: 10, marginRight: 10 }}
        >
          🛠️ Đi đến trang quản trị
        </button>
      )}

      <button onClick={handleLogout} style={{ marginTop: 10 }}>
        🚪 Đăng xuất
      </button>
    </div>
  );
};

export default Profile;
