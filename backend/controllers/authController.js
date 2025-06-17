const userModel = require('../models/userModel');
const supabase = require('../config/supabaseClient');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    const { tendangnhap, email, matkhau, sdt, diachi } = req.body;

    if (!email || !matkhau || !tendangnhap) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email đã được sử dụng' });
    }

    const hashedmatkhau = await bcrypt.hash(matkhau, 10);

    const newUser = await userModel.createUser({
      email,
      tendangnhap,
      matkhau: hashedmatkhau,
      marole: 2,
      trangthai: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sdt,
      diachi
    });

    res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
  } catch (error) {
    console.error('Lỗi đăng ký:', error.message);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, matkhau } = req.body;
    const user = await userModel.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(matkhau, user.matkhau);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu hoặc tài khoản" });
    }

    let customerId = null;

    // Truy vấn bảng phụ lấy makhachhang hoặc manhanvien
    if (user.marole === 2) {
      const { data, error } = await supabase
        .from('khachhang')
        .select('makhachhang')
        .eq('mataikhoan', user.mataikhoan)
        .single();
      if (error) throw error;
      customerId = data.makhachhang;
    } else if (user.marole === 3) {
      const { data, error } = await supabase
        .from('nhanvien')
        .select('manhanvien')
        .eq('mataikhoan', user.mataikhoan)
        .single();
      if (error) throw error;
      customerId = data.manhanvien;
    }

    // Tạo token chỉ chứa thông tin cơ bản
    const token = jwt.sign({
      mataikhoan: user.mataikhoan,
      email: user.email,
      vaitro: user.marole
    }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' });

    // Lưu token vào cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });

    // Gửi response chứa customerId trực tiếp
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        mataikhoan: user.mataikhoan,
        email: user.email,
        vaitro: user.marole,
        customerId //  Gửi trực tiếp về frontend
      }
    });
  } catch (err) {
    console.error(" Lỗi đăng nhập:", err.message);
    res.status(401).json({ success: false, message: err.message });
  }
};

// Đăng nhập bằng Google
exports.oauthLogin = async (req, res) => {
  const { email, name, google_id } = req.body;

  if (!email || !google_id) {
    return res.status(400).json({ message: 'Thiếu thông tin email hoặc google_id' });
  }

  try {
    let user = await userModel.getUserByEmail(email);

    if (!user) {
      user = await userModel.createUser({
        email,
        tendangnhap: name || email.split('@')[0],
        google_id,
        matkhau: null,
        marole: 2, // Khách hàng
        trangthai: true,
      });
    } else if (!user.google_id) {
      await userModel.updateUser(user.mataikhoan, { google_id });
    }

    //  Lấy makhachhang từ bảng phụ
    let customerId = null;
    if (user.marole === 2) {
      const { data, error } = await supabase
        .from('khachhang')
        .select('makhachhang')
        .eq('mataikhoan', user.mataikhoan)
        .single();
      if (error) throw error;
      customerId = data.makhachhang;
    }

    //  Tạo token
    const token = jwt.sign({
      mataikhoan: user.mataikhoan,
      email: user.email,
      vaitro: user.marole
    }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' });

    //  Lưu vào cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    //  Gửi về frontend
    res.status(200).json({
      success: true,
      message: "OAuth login thành công",
      user: {
        email: user.email,
        tendangnhap: user.tendangnhap,
        vaitro: user.marole,
        customerId: customerId || null
      }
    });
  } catch (error) {
    console.error('OAuth login error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { currentmatkhau, newmatkhau } = req.body;
    const user = await userModel.getUserById(req.user.userId);

    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
    if (!newmatkhau) return res.status(400).json({ message: 'Mật khẩu mới không được bỏ trống' });

    if (user.matkhau) {
      // Đã có mật khẩu → cần xác thực mật khẩu hiện tại
      const isMatch = await userModel.comparePassword(currentmatkhau, user.matkhau);
      if (!isMatch) {
        return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
      }
    } else {
      // Người dùng chưa từng có mật khẩu (đăng nhập Google)
      console.log(" Người dùng chưa có mật khẩu, cho phép đặt mật khẩu mới");
    }

    await userModel.updatePassword(req.user.userId, newmatkhau);
    res.json({
      success: true,
      message: user.matkhau
        ? ' Mật khẩu đã được cập nhật'
        : ' Mật khẩu đã được thiết lập'
    });
  } catch (error) {
    console.error(" Lỗi đổi mật khẩu:", error);
    res.status(500).json({ success: false, message: error.message || 'Lỗi máy chủ' });
  }
};

// Cập nhật thông tin người dùng hiện tại
exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await userModel.updateUser(req.user.userId, req.body);
    res.json(updatedUser);
  } catch (error) {
    console.error('Lỗi updateProfile:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
    res.json({ success: true, user });
  } catch (error) {
    console.error('Lỗi getMe:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
};
