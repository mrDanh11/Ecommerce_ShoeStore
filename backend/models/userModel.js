const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');

//Create a new user with hashed password
async function createUser(userData) {
  const hashedPassword = userData.password
    ? await bcrypt.hash(userData.password, 10)
    : null;
  
  const payload = {
    email: userData.email,
    password_hash: hashedPassword,
    name: userData.name || null,
    role: userData.role || 'user',
    oauth_provider: userData.oauth_provider || null,
    oauth_id: userData.oauth_id || null
    avatar: userData.avatar || null, 
    phone: userData.phone || null,    
    address: userData.address || null 
  };
  const { data, error } = await supabase
    .from('users')
    .insert([payload])
    .select('id, email, name, role, avatar, phone, address, created_at')
    .single();

  if (error) throw error;
  return data;
}

//Get single user by ID (Admin)
async function getUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role, oauth_provider, oauth_id')
    .eq('id', id)
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
    .from('users')
    .select('id, email, name, role, avatar, phone, address, created_at', { count: 'exact' })
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
    .from('users')
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
  if (updates.password) {
    updates.password_hash = await bcrypt.hash(updates.password, 10);
    delete updates.password;
  }
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select('id, email, name, role, avatar, phone, address, created_at')
    .single();
  
  if (error) throw error;
  return data;
}

// Delete user by ID (Admin)
async function deleteUser(id) {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

// Find or create OAuth2 user 
async function findOrCreateOAuthUser(profile, provider) {
  const { id, displayName, emails, photos } = profile;
  const email = emails?.[0]?.value;
  const avatar = photos?.[0]?.value;
  
  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('oauth_provider', provider)
    .eq('oauth_id', id)
    .single();
  
  if (user) return user;
  
  if (email) {
    ({ data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single());
    
    if (user) {
      const { data: updatedUser } = await supabase
        .from('users')
        .update({
          oauth_provider: provider,
          oauth_id: id,
          avatar: avatar || user.avatar
        })
        .eq('id', user.id)
        .select()
        .single();
      
      return updatedUser;
    }
  }
  
  return await createUser({
    email,
    name: displayName,
    avatar,
    oauth_provider: provider,
    oauth_id: id
  });
}

// Update Password
async function updatePassword(userId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const { error } = await supabase
    .from('users')
    .update({ password_hash: hashedPassword })
    .eq('id', userId);
  
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
  findOrCreateOAuthUser,
  updatePassword
};
