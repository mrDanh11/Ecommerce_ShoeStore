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
  };
  const { data, error } = await supabase
    .from('users')
    .insert([payload])
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
async function listUsers({ limit = 10, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role, oauth_provider, oauth_id')
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
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
    .single();
  if (error) throw error;
  return data;
}

// Delete user by ID (Admin)
async function deleteUser(id) {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Find or create OAuth2 user 
async function findOrCreateOAuthUser(oauthData) {
  const { oauth_provider, oauth_id, email, name } = oauthData;
  const { data: existingOAuthUser, error } = await supabase
    .from('users')
    .select('*')
    .eq('oauth_provider', oauth_provider)
    .eq('oauth_id', oauth_id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  if (existingOAuthUser) return existingOAuthUser;

  const { data: emailUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (emailUser) {
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        oauth_provider,
        oauth_id,
        email_verified: true 
      })
      .eq('id', emailUser.id)
      .single();
    if (updateError) throw updateError;
    return updatedUser;
  }
  return await createUser({
    email,
    name,
    role: 'user',
    oauth_provider,
    oauth_id
  });
}

module.exports = {
  createUser,
  getUserById,
  listUsers,
  getUserByEmail,
  comparePassword,
  updateUser,
  deleteUser,
  findOrCreateOAuthUser
};
