const supabase = require("../config/supabaseClient");

exports.getCategories = async (limit, offset, filters) => {
  let query = supabase.from('danhmucsanpham').select('*');

  if (filters.categoryId) {
    query = query.eq('madanhmuc', filters.categoryId);
  }
  if (filters.search) {
    query = query.ilike('tendanhmuc', `%${filters.search}%`);
  }

  if (filters.saleOffId) {
    query = query.eq('masaleoff', filters.saleOffId);
  }

  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data;
};

exports.getCategoryCount = async (filters) => {
  let query = supabase.from('danhmucsanpham').select('*', { count: 'exact', head: true });

  if (filters.categoryId) {
    query = query.eq('madanhmuc', filters.categoryId);
  }

  if (filters.search) {
    query = query.ilike('tendanhmuc', `%${filters.search}%`);
  }

  if (filters.saleOffId) {
    query = query.eq('masaleoff', filters.saleOffId);
  }

  const { count, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return count;
};

exports.insertCategory = async (name, saleOffId = null) => {
  if (!name || name.trim() === "") {
    throw new Error("Category name is required");
  }
  const { data, error } = await supabase
    .from('danhmucsanpham')
    .insert([
      {
        tendanhmuc: name,
        masaleoff: saleOffId
      }
    ])
    .select();

  if (error) {
    throw error;
  }

  return data;
};

exports.deleteCategory = async (id) => {
  const { data, error } = await supabase
    .from('danhmucsanpham')
    .delete()
    .eq('madanhmuc', id)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

exports.updateCategory = async (id, updates) => {
  const allowedUpdates = ['name', 'saleOffId'];
  const updateData = {};
  console.log("Updates received:", updates);
  for (const key of allowedUpdates) {
    if (key in updates) {
      updateData[key] = updates[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields to update");
  }

  console.log("Update data prepared:", updateData);

  const categoryData = {};

  if (updateData.name !== undefined) {
    categoryData.tendanhmuc = updateData.name;
  }

  if (updateData.saleOffId !== undefined) {
    categoryData.masaleoff = updateData.saleOffId;
  }

  console.log("Category data to update:", categoryData);

  const { data, error } = await supabase
    .from('danhmucsanpham')
    .update(categoryData)
    .eq('madanhmuc', id)
    .select();

  if (error) {
    throw error;
  }

  return data;
};
