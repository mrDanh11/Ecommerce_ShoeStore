const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');

async function createUser(userData) {
  const { data, error } = await supabase
    .from('account')
    .insert([userData])
    .select();

  if (error) {
    console.error("❌ Lỗi tạo tài khoản:", error);
    throw error;
  }

  const user = data[0];

  try {
    if (user.marole === 2) {
      const { error: khError } = await supabase
        .from('khachhang')
        .insert([{ 
          mataikhoan: user.mataikhoan, 
          hoten: user.tendangnhap,
          sdt: user.sdt,
          diachi: user.diachi

         }]);

      if (khError) throw new Error("Lỗi khi thêm khachhang: " + khError.message);
    } else if (user.marole === 3) {
      const { error: nvError } = await supabase
        .from('nhanvien')
        .insert([{ 
          mataikhoan: user.mataikhoan,
          hoten: user.tendangnhap,
          sdt: user.sdt,
          diachi: user.diachi 
          }]);

      if (nvError) throw new Error("Lỗi khi thêm nhanvien: " + nvError.message);
    }
  } catch (insertErr) {
    console.error("❌ Lỗi thêm bản ghi phụ:", insertErr.message);
  }

  return user;
}





//Get single user by ID (Admin)
async function getUserById(id) {
  const { data, error } = await supabase
    .from('account')
    .select('*')
    .eq('mataikhoan', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

//List users with pagination (Admin)
async function listUsers({ 
  limit = 10,
  offset = 0,
  search = '',
  role = ''
} = {}) {
  let query = supabase
    .from('account')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`email.ilike.%${search}%,tendangnhap.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq('marole', role);
  }

  query = query.range(offset, offset + limit - 1); // luôn đặt .range() sau cùng

  const { data, error, count } = await query;

  if (error) throw error;

  return { data, count };
}

// Get user by email (for authentication)
async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('account')
    .select('*')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

//Compare raw password with stored hash
async function comparePassword(rawPassword, hash) {
  if (!hash || !rawPassword) return false;
  return bcrypt.compare(rawPassword, hash);
}

// Update user by ID (Admin or Self)
async function updateUser(id, updates) {
  if (updates.matkhau) {
    updates.matkhau = await bcrypt.hash(updates.matkhau, 10);
  }

  const currentUser = await getUserById(id);

  const { data, error } = await supabase
    .from('account')
    .update(updates)
    .eq('mataikhoan', id)
    .select()
    .single();

  if (error) throw error;

  // Nếu vai trò thay đổi: xóa bản ghi cũ và chèn bản ghi mới
  if (updates.marole && updates.marole !== currentUser.marole) {
    if (currentUser.marole === 2) {
      await supabase.from('khachhang').delete().eq('mataikhoan', id);
    } else if (currentUser.marole === 3) {
      await supabase.from('nhanvien').delete().eq('mataikhoan', id);
    }

    const hoten = updates.tendangnhap || currentUser.tendangnhap || "Chưa có tên";
    const sdt = updates.sdt || currentUser.sdt || null;
    const diachi = updates.diachi || currentUser.diachi || null;

    if (updates.marole === 2) {
      await supabase.from('khachhang').insert([{ mataikhoan: id, hoten, sdt, diachi }]);
    } else if (updates.marole === 3) {
      await supabase.from('nhanvien').insert([{ mataikhoan: id, hoten, sdt, diachi }]);
    }
  } else {
    // Nếu vai trò KHÔNG thay đổi, thì cập nhật bảng phụ tương ứng
    const hoten = updates.tendangnhap;
    const sdt = updates.sdt;
    const diachi = updates.diachi;

    if (currentUser.marole === 2) {
      await supabase
        .from('khachhang')
        .update({ hoten, sdt, diachi })
        .eq('mataikhoan', id);
    } else if (currentUser.marole === 3) {
      await supabase
        .from('nhanvien')
        .update({ hoten, sdt, diachi })
        .eq('mataikhoan', id);
    }
  }

  return data;
}


// Delete user by ID (Admin)
async function deleteUser(id) {
  const currentUser = await getUserById(id);

  if (currentUser.marole === 2) {
    await supabase.from('khachhang').delete().eq('mataikhoan', id);
  } else if (currentUser.marole === 3) {
    await supabase.from('nhanvien').delete().eq('mataikhoan', id);
  }

  const { error } = await supabase
    .from('account')
    .delete()
    .eq('mataikhoan', id);

  if (error) throw error;
  return true;
}

// Update Password
async function updatePassword(userId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const { error } = await supabase
    .from('account')
    .update({ matkhau: hashedPassword })
    .eq('mataikhoan', userId);

  
  if (error) throw error;
  return true;
}

async function getUserByRole(role) {
  const { data, error } = await supabase
    .from('account')
    .select('*')
    .eq('marole', role);

  if (error) throw error;
  return data;
}

module.exports = {
  createUser,
  getUserById,
  listUsers,
  getUserByEmail,
  comparePassword,
  updateUser,
  deleteUser,
  updatePassword,
  getUserByRole,
};
