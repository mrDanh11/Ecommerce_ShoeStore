import { useState } from 'react';
import { Link } from 'react-router-dom';
import SummaryApi from '../../common';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';



const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate(); 

  const handleSubmit = async(e) => {
    e.preventDefault();


    console.log('Logging in with:', form);


    try {
      const response = await fetch("http://localhost:4004/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.username,    // Change 'username' to 'email'
          matkhau: form.password
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login success:", data);
      // Store token and redirect (e.g., localStorage.setItem("token", data.token))
      navigate("/");
      
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    console.log(" Bắt đầu đăng nhập bằng Google...");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/callback', // URL local bạn đang dùng
      },
    });
    if (error) {
      console.error(" Lỗi khi đăng nhập với Google:", error);
    } else {
      console.log(" Đã chuyển hướng tới Google Login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">ĐĂNG NHẬP</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              placeholder="Email"
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu *</label>
            <input
              type="password"
              placeholder="Mật khẩu"
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition cursor-pointer"
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <Link to="/forgot-password" className="text-gray-500 hover:text-black">
            Quên mật khẩu?
          </Link>
        </div>
        <div className="mt-4 text-center text-blue-500">
          <button onClick={handleGoogleLogin} className="font-medium hover:underline">
          Đăng nhập với Google
        </button>

        </div>

        <div className="mt-4 text-sm text-center text-gray-600">
          Bạn chưa có tài khoản?{' '}
          <Link to="/register" className="text-black font-medium hover:underline">
            Đăng ký tại đây
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
