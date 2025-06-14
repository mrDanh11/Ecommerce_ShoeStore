const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');

async function createUser(userData) {
  const { data, error } = await supabase
    .from('account')
    .insert([userData])
    .select();

  if (error) throw error;
  return data[0];
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
    .select('mataikhoan, email, tendangnhap,matkhau, marole, google_id, trangthai, update_at, created_at', { count: 'exact' })
    .range(offset, offset + limit - 1);
  
  if (search) {
    query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
  }
  
  if (role) {
    query = query.eq('role', role);
  }
  
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
  if (!hash) return false;
  return bcrypt.compare(rawPassword, hash);
}

// Update user by ID (Admin)
async function updateUser(id, updates) {
  if (updates.matkhau) {
    updates.matkhau = await bcrypt.hash(updates.matkhau, 10);
  }

  const { data, error } = await supabase
    .from('account')
    .update(updates)
    .eq('mataikhoan', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Delete user by ID (Admin)
async function deleteUser(id) {
  const { data, error } = await supabase
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

module.exports = {
  createUser,
  getUserById,
  listUsers,
  getUserByEmail,
  comparePassword,
  updateUser,
  deleteUser,
  updatePassword
};
