const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

exports.getProducts = async (limit, offset, filters) => {
  let query = supabase
    .from('sanpham')
    .select(`
      *,
      danhmucsanpham (
        madanhmuc,
        tendanhmuc,
        masaleoff
      ),
      chitietsanpham (
        machitietsanpham,
        color,
        size,
        soluong,
        gia
      )
    `);

  if (filters.categoryId) {
    query = query.eq('madanhmuc', filters.categoryId);
  }

  if (filters.search) {
    query = query.ilike('tensanpham', `%${filters.search}%`);
  }

  if (filters.minPrice) {
    query = query.gte('gia', filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte('gia', filters.maxPrice);
  }

  if (filters.isAvailable !== undefined) {
    if (filters.isAvailable === true) {
      // Only include products where the sum of 'soluong' in chitietsanpham > 0
      query = query.in('masanpham',
        supabase
          .from('chitietsanpham')
          .select('masanpham')
          .gt('soluong', 0)
      );
    } else if (filters.isAvailable === false) {
      // Only include products where all 'soluong' in chitietsanpham <= 0
      // This is more complex; you may need a view or RPC for full accuracy.
      // Here, we exclude products that have any chitietsanpham with soluong > 0
      query = query.not('masanpham', 'in',
        supabase
          .from('chitietsanpham')
          .select('masanpham')
          .gt('soluong', 0)
      );
    }
  }

  if (filters.CnS !== undefined) {
    // Filter by both color AND size in the same chitietsanpham record
    if (filters.CnS.color && filters.CnS.size) {
      const { data: matchingDetails } = await supabase
        .from('chitietsanpham')
        .select('masanpham')
        .eq('color', filters.CnS.color)
        .eq('size', filters.CnS.size);

      const productIds = matchingDetails.map(detail => detail.masanpham);
      query = query.in('masanpham', productIds);

      // Thêm filter cho chitietsanpham để chỉ lấy chi tiết matching
      query = query.select(`
        *,
        danhmucsanpham (
          madanhmuc,
          tendanhmuc,
          masaleoff
        ),
        chitietsanpham!inner (
          machitietsanpham,
          color,
          size,
          soluong,
          gia
        )
      `).eq('chitietsanpham.color', filters.CnS.color)
        .eq('chitietsanpham.size', filters.CnS.size);

    } else {
      // Individual filters
      if (filters.CnS.color) {
        query = query.in('masanpham',
          supabase
            .from('chitietsanpham')
            .select('masanpham')
            .eq('color', filters.CnS.color)
        );

        // Filter chi tiết theo color
        query = query.select(`
          *,
          danhmucsanpham (
            madanhmuc,
            tendanhmuc,
            masaleoff
          ),
          chitietsanpham!inner (
            machitietsanpham,
            color,
            size,
            soluong,
            gia
          )
        `).eq('chitietsanpham.color', filters.CnS.color);
      }

      if (filters.CnS.size) {
        query = query.in('masanpham',
          supabase
            .from('chitietsanpham')
            .select('masanpham')
            .eq('size', filters.CnS.size)
        );

        // Filter chi tiết theo size
        query = query.select(`
          *,
          danhmucsanpham (
            madanhmuc,
            tendanhmuc,
            masaleoff
          ),
          chitietsanpham!inner (
            machitietsanpham,
            color,
            size,
            soluong,
            gia
          )
        `).eq('chitietsanpham.size', filters.CnS.size);
      }
    }
  }

  if (limit && offset !== null) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

exports.getProductCount = async (filters) => {
  let query = supabase
    .from('sanpham')
    .select('*', { count: 'exact', head: true });

  if (filters.categoryId) {
    query = query.eq('madanhmuc', filters.categoryId);
  }

  if (filters.search) {
    query = query.ilike('tensanpham', `%${filters.search}%`);
  }

  if (filters.minPrice) {
    query = query.gte('gia', filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte('gia', filters.maxPrice);
  }

  if (filters.isAvailable !== undefined) {
    if (filters.isAvailable === true) {
      // Only count products where at least one chitietsanpham has soluong > 0
      query = query.in('masanpham',
        (
          await supabase
            .from('chitietsanpham')
            .select('masanpham', { distinct: true })
            .gt('soluong', 0)
        ).data.map(row => row.masanpham)
      );
    } else if (filters.isAvailable === false) {
      // Only count products where all chitietsanpham have soluong <= 0
      // Exclude products that have any chitietsanpham with soluong > 0
      query = query.not('masanpham', 'in',
        (
          await supabase
            .from('chitietsanpham')
            .select('masanpham', { distinct: true })
            .gt('soluong', 0)
        ).data.map(row => row.masanpham)
      );
    }
  }

  const { count, error } = await query;
  if (error) throw error;
  return count;
};

exports.insertProduct = async (productData, detailsData) => {
  const { name, desc, img, price, categoryId, status } = productData;
  let product = null;
  let details = null;

  if (name) {
    const id = uuidv4();
    const { data: productResult, error: productError } = await supabase
      .from('sanpham')
      .insert([
        {
          masanpham: id,
          tensanpham: name,
          description: desc,
          anhsanpham: img,
          gia: price,
          madanhmuc: categoryId,
          tinhtrang: status,
        },
      ])
      .select()
      .single();

    if (productError) throw productError;
    product = productResult;
  }

  const { color, size, quantity, dPrice, productId } = detailsData;
  if (color || size || quantity) {
    const detailsId = uuidv4();
    const { data: detailsResult, error: detailsError } = await supabase
      .from('chitietsanpham')
      .insert([
        {
          machitietsanpham: detailsId,
          masanpham: productId || product?.masanpham,
          color: color,
          size: size,
          soluong: quantity,
          gia: dPrice || product?.gia,
        },
      ])
      .select()
      .single();

    if (detailsError) throw detailsError;
    details = detailsResult;
  }

  return { product, details };
};

exports.deleteProduct = async (productId) => {
  // Sử dụng transaction để đảm bảo xóa dữ liệu ở cả 2 bảng
  try {
    // Xóa chi tiết sản phẩm trước
    const { error: detailsError } = await supabase
      .from('chitietsanpham')
      .delete()
      .eq('masanpham', productId);

    if (detailsError) throw detailsError;

    // Sau đó xóa sản phẩm
    const { data, error } = await supabase
      .from('sanpham')
      .delete()
      .eq('masanpham', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

exports.updateProduct = async (productId, updates, detailsData) => {
  const allowedFields = [
    'name',
    'desc',
    'img',
    'price',
    'productId',
    'status',
  ];
  const updateData = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      updateData[key] = updates[key];
    }
  }

  // Update sanpham if there are fields to update
  let productData = null;
  if (Object.keys(updateData).length > 0) {
    const mappedUpdateData = {};
    if (updateData.name !== undefined) mappedUpdateData.tensanpham = updateData.name;
    if (updateData.desc !== undefined) mappedUpdateData.description = updateData.desc;
    if (updateData.img !== undefined) mappedUpdateData.anhsanpham = updateData.img;
    if (updateData.price !== undefined) mappedUpdateData.gia = updateData.price;
    if (updateData.status !== undefined) mappedUpdateData.tinhtrang = updateData.status;

    const { data, error } = await supabase
      .from('sanpham')
      .update(mappedUpdateData)
      .eq('masanpham', productId)
      .select()
      .single();

    if (error) throw error;
    productData = data;
  }

  // Update chitietsanpham if detailsData is provided
  let detailsResult = null;
  if (detailsData && detailsData.detailsId) {
    const detailId = detailsData.detailsId;
    const detailsUpdateData = {};
    if (detailsData.color !== undefined) detailsUpdateData.color = detailsData.color;
    if (detailsData.size !== undefined) detailsUpdateData.size = detailsData.size;
    if (detailsData.quantity !== undefined) detailsUpdateData.soluong = detailsData.quantity;
    if (updateData.price !== undefined) detailsUpdateData.gia = updateData.price;

    if (Object.keys(detailsUpdateData).length > 0) {
      const { data: details, error: detailsError } = await supabase
        .from('chitietsanpham')
        .update(detailsUpdateData)
        .eq('machitietsanpham', detailId)
        .select();

      if (detailsError) throw detailsError;
      detailsResult = details;
    }
  }

  if (!productData && !detailsResult) {
    throw new Error("No fields to update");
  }

  return { product: productData, details: detailsResult };
};

exports.getRelatedProducts = async (productId, limit, offset) => {
  // First get the category of the current product
  const { data: currentProduct, error: currentProductError } = await supabase
    .from('sanpham')
    .select('madanhmuc')
    .eq('masanpham', productId)
    .single();

  if (currentProductError) throw currentProductError;

  let query = supabase
    .from('sanpham')
    .select(`
      *,
      danhMuc:danhmucsanpham (
        madanhmuc,
        tendanhmuc,
        masaleoff
      )
    `)
    .eq('madanhmuc', currentProduct.madanhmuc)
    .neq('masanpham', productId)
    .order('tensanpham', { ascending: true });

  if (limit && offset !== null) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

exports.getRelatedProductCount = async (productId) => {
  // First get the category of the current product
  const { data: currentProduct, error: currentProductError } = await supabase
    .from('sanpham')
    .select('madanhmuc')
    .eq('masanpham', productId)
    .single();

  if (currentProductError) throw currentProductError;

  // Count products in the same category, excluding the current product
  const { count, error } = await supabase
    .from('sanpham')
    .select('*', { count: 'exact', head: true })
    .eq('madanhmuc', currentProduct.madanhmuc)
    .neq('masanpham', productId);

  if (error) throw error;
  return count;
};

exports.getProductItemById = async (productItemId) => {
  const { data, error } = await supabase
    .from('chitietsanpham')
    .select('*, sanpham(*, danhmucsanpham(*,saleoff(*)))')
    .eq('machitietsanpham', productItemId)

  console.log('check data getProductById Model: ', data);

  if (error) {
    console.log('error: ', error)
  }

  return { data, error }
}

exports.getProductById = async (productId) => {
  const { data, error } = await supabase
    .from('sanpham')
    .select(`
      *,
      danhmucsanpham (*, saleoff(*)),
      chitietsanpham (*)
    `)
    .eq('masanpham', productId)

  console.log('check data getProductById Model: ', data);

  if (error) {
    console.log('error: ', error)
  }

  return { data, error }
}


