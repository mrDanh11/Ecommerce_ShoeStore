const supabase = require("../config/supabaseClient");

exports.getCategories = async (limit, offset, search) => {
  let query = supabase.from('danhmucsanpham').select('*');

  if (search) {
    query = query.ilike('tendanhmuc', `%${search}%`);
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

exports.getCategoryCount = async (search) => {
  let query = supabase.from('danhmucsanpham').select('*', { count: 'exact', head: true });

  if (search) {
    query = query.ilike('tendanhmuc', `%${search}%`);
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
  if (!updates || Object.keys(updates).length === 0) {
    throw new Error("No fields to update");
  }

  const updateData = {
    name: updates.name || null,
    saleOffId: updates.saleOffId || null
  };

  const { data, error } = await supabase
    .from('danhmucsanpham')
    .update([
      {
        tendanhmuc: updateData.name,
        masaleoff: updateData.saleOffId
      }
    ])
    .eq('madanhmuc', id)
    .select();

  if (error) {
    throw error;
  }

  return data;
};
