import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import axios from 'axios';

const CallBack = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error(' Lỗi lấy user từ Supabase:', error);
        alert('Không thể lấy thông tin người dùng từ Supabase');
        return;
      }

      const user = data.user;

      const userInfo = {
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        google_id: user.id,
      };

      try {
        const res = await axios.post(
          'http://localhost:4004/api/auth/oauth',
          userInfo,
          {
            withCredentials: true, // cần để cookie JWT từ backend hoạt động
          }
        );

        console.log(' OAuth login response:', res.data);

        if (res.data.success) {
          const { user } = res.data;

          //  Lưu vào localStorage
          if (user.customerId) {
            localStorage.setItem("customerId", user.customerId);
          }

          localStorage.setItem("email", user.email);
          localStorage.setItem("role", user.vaitro);

          //  Điều hướng
          navigate('/profile'); // hoặc '/'
        } else {
          alert(res.data.message || 'Đăng nhập thất bại từ backend');
        }
      } catch (err) {
        console.error(' Gửi dữ liệu user về backend thất bại:', err);
        alert('Có lỗi xảy ra khi đăng nhập bằng Google!');
      }
    };

    getUser();
  }, [navigate]);

  return (
    <div className="text-center mt-10 text-xl text-gray-700">
      🔄 Đang xử lý đăng nhập bằng Google...
    </div>
  );
};

export default CallBack;
