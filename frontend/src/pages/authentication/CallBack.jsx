import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';


const CallBack = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error('Lỗi lấy thông tin user từ Supabase:', error);
        return;
      }

      const user = data.user;

      // Gửi thông tin user về backend
      try {
        const response = await fetch('http://localhost:4004/api/auth/oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.user_metadata?.full_name,
            google_id: user.id, // dòng này để gửi google_id
          }),
        });

        const result = await response.json();
        console.log('OAuth login response: ', result);
        if (result.token) {
          navigate('/'); // ✅ Chuyển về trang chủ
        } else {
          //alert("Đăng nhập thất bại từ backend");
        }
      } catch (err) {
        console.error('Gửi user lên backend thất bại:', err);
        alert("Có lỗi xảy ra khi đăng nhập!");
      }
    };

    getUser();
  }, [navigate]);
  return (
    <div className="text-center mt-10 text-xl text-gray-700">
      Đang xử lý đăng nhập bằng Google...
    </div>
  );
};

export default CallBack;
