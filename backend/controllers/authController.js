const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    
    //const { email, google_id, tendangnhap, matkhau, marole = 3 } = req.body;
    const { tendangnhap, email, matkhau,} = req.body;
    
    if (!email || !matkhau || !tendangnhap) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const existingUser = await userModel.getUserByEmail(email);
    console.log("user",existingUser)
    if (existingUser) {
      res.status(409).json({ message: 'Email đã được sử dụng' });
      //throw new Error("Already user exits.")
    }

    const hashedmatkhau = await bcrypt.hash(matkhau, 10);



    const newUser = await userModel.createUser({
      email,
      //google_id: google_id || null,
      tendangnhap,
      matkhau: hashedmatkhau,
      marole: 3,
      trangthai: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
  } catch (error) {
    console.error('Lỗi đăng ký:', error.message);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Đăng nhập
exports.login = async (req,res) => {
    try{
        const { email , matkhau} = req.body  
        const user = await userModel.getUserByEmail(email)

        console.log("User from DB:", user); // ✅ Log toàn bộ user
        console.log("matkhau from DB:", user?.matkhau); // ✅ Log matkhau

       if(!user){
          //res.status(404).json({ message: 'Không tìm thấy người dùng' });
          throw new Error("User not found")
       }

       const checkmatkhau = await bcrypt.compare(matkhau,user.matkhau)

       console.log("checkPassoword",checkmatkhau)

       if(checkmatkhau){
        const tokenData = {
            mataikhoan : user.mataikhoan,
            email : user.email,
            vaitro: user.vaitro
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' });
        //console.log("jwt: ",token)

        const tokenOption = {
            httpOnly : true,
            secure : false,
            sameSite: 'lax'
        }

        res.cookie("token",token,tokenOption).status(200).json({
            message : "Login successfully",
            //data : token,
            success : true,
            //error : false
        })

       }else{
          //res.status(401).json({ message: 'Mật khẩu không đúng' })
          throw new Error("Please check matkhau")
       }
    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }

}



// Đăng nhập bằng Google

exports.oauthLogin = async (req, res) => {
  const { email, name, google_id } = req.body;

  if (!email || !google_id) {
    return res.status(400).json({ message: 'Thiếu thông tin email hoặc google_id' });
  }

  try {
    // Kiểm tra user tồn tại chưa
    let user = await userModel.getUserByEmail(email);

    if (!user) {
      // Tạo mới
      user = await userModel.createUser({
        email,
        tendangnhap: name || email.split('@')[0],
        google_id,
        matkhau: null,
        marole: 3,
        trangthai: true,
      });
    } else {
      if (!user.google_id) {
        await userModel.updateUser(
          user.mataikhoan,
          { google_id },
          { where: { email } }
        );
      }
    }

  
    const token = jwt.sign({ mataikhoan: user.mataikhoan, email: user.email, vaitro: user.vaitro },
       process.env.TOKEN_SECRET_KEY, 
       {
      expiresIn: '1d',
    });
    // Gửi cookie về frontend
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,       // ⚠️ Không dùng true nếu không phải HTTPS
      sameSite: "lax",     // ✅ Đảm bảo cookie hoạt động với fetch/axios cross-origin
      path: "/",           // Đảm bảo cookie dùng được trên toàn site
    });

    res.status(200).json({
      success: true,
      message: "OAuth login thành công",
      user: {
        email: user.email,
        tendangnhap: user.tendangnhap,
        vaitro: user.vaitro
      }
    });

    res.json({ success: true, message: 'OAuth login thành công', token, user });
  } catch (error) {
    console.error('OAuth login error:', error);
    res.status(500).json({ message: 'Lỗi server 111 11' });
  }
};



// Đổi mật khẩu
exports.changematkhau = async (req, res) => {
  try {
    const { currentmatkhau, newmatkhau } = req.body;
    const userId = req.user.userId;
    
    // Lấy thông tin user
    const user = await userModel.getUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Người dùng không tồn tại' 
      });
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await userModel.comparematkhau(currentmatkhau, user.matkhau);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Mật khẩu hiện tại không đúng' 
      });
    }
    
    // Cập nhật mật khẩu mới
    await userModel.updatematkhau(userId, newmatkhau);
    
    res.json({
      success: true,
      message: 'Mật khẩu đã được cập nhật'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
  try {
    console.log("Decoded user:", req.user);

    const user = await userModel.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Người dùng không tồn tại' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Lỗi getMe:', error); 
    res.status(500).json({ success: false, error: error.message });
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  res.status(200).json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};
