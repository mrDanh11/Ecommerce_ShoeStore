const db = require("../config/database");

exports.getProducts = async (limit, offset, filters) => {
  const conditions = [];
  const values = [];
  let query = `
    SELECT 
      p.*, 
      json_build_object(
        'id', c.id, 
        'name', c.name, 
        'image', c.image
      ) AS category
    FROM PRODUCT p
    LEFT JOIN CATEGORY c ON p.category_id = c.id
  `; //LEFT JOIN is used to get all products even if they don't have a category
  
  if (filters.category_id) {
    conditions.push(`p.category_id = $${conditions.length + 1}`);
    values.push(filters.category_id);
  } //All the IF conditions here and below for filtering, adding the conditions to the query and values to the values array

  if (filters.search) {
    conditions.push(`p.name ILIKE $${conditions.length + 1}`);
    values.push(`%${filters.search}%`);
  }

  if (filters.min_price) {
    conditions.push(`p.price >= $${conditions.length + 1}`);
    values.push(filters.min_price);
  }

  if (filters.max_price) {
    conditions.push(`p.price <= $${conditions.length + 1}`);
    values.push(filters.max_price);
  }

  if (filters.min_release_year) {
    conditions.push(`p.release_year >= $${conditions.length + 1}`);
    values.push(filters.min_release_year);
  }

  if (filters.max_release_year) {
    conditions.push(`p.release_year <= $${conditions.length + 1}`);
    values.push(filters.max_release_year);
  }

  if (filters.isAvailable !== undefined) {
    if (filters.isAvailable === true) {
      conditions.push(`p.quantity > 0`);
    } else if (filters.isAvailable === false) {
      conditions.push(`p.quantity <= 0`);
    }
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  if (limit && offset !== null) {
    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);
  }

  return await db.any(query, values);
};

//Do the same work to all the functions below
exports.getProductCount = async (filters) => {
  const conditions = [];
  const values = [];
  let query = "SELECT COUNT(*) FROM PRODUCT";

  if (filters.category_id) {
    conditions.push(`category_id = $${conditions.length + 1}`);
    values.push(filters.category_id);
  }

  if (filters.search) {
    conditions.push(`name ILIKE $${conditions.length + 1}`);
    values.push(`%${filters.search}%`);
  }

  if (filters.min_price) {
    conditions.push(`price >= $${conditions.length + 1}`);
    values.push(filters.min_price);
  }

  if (filters.max_price) {
    conditions.push(`price <= $${conditions.length + 1}`);
    values.push(filters.max_price);
  }

  if (filters.min_release_year) {
    conditions.push(`release_year >= $${conditions.length + 1}`);
    values.push(filters.min_release_year);
  }

  if (filters.max_release_year) {
    conditions.push(`release_year <= $${conditions.length + 1}`);
    values.push(filters.max_release_year);
  }

  if (filters.isAvailable !== undefined) {
    if (filters.isAvailable === true) {
      conditions.push(`quantity > 0`);
    } else if (filters.isAvailable === false) {
      conditions.push(`quantity <= 0`);
    }
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  return await db.one(query, values, (result) => +result.count);
};

exports.insertProduct = async (
  name,
  description,
  image,
  price,
  category_id,
  quantity,
  release_year
) => {
  const query = `
    INSERT INTO PRODUCT (name, description, image, price, category_id, quantity, release_year)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  const values = [
    name,
    description,
    image,
    price,
    category_id,
    quantity,
    release_year,
  ];

  return await db.none(query, values);
};

exports.deleteProduct = async (id) => {
  const query = `
    DELETE FROM PRODUCT WHERE id = $1
  `;

  return await db.result(query, [id]);
};

exports.updateProduct = async (id, updates) => {
  const fields = [];
  const values = [];

  Object.keys(updates).forEach((key, index) => {
    fields.push(`${key} = $${index + 1}`);
    values.push(updates[key]);
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const query = `
    UPDATE PRODUCT
    SET ${fields.join(", ")}
    WHERE id = ${id}
    RETURNING *;
  `;

  return await db.oneOrNone(query, values);
};

exports.getRelatedProducts = async (id, limit, offset) => {
  let query = `
    SELECT p.*, 
           json_build_object(
        'id', c.id, 
        'name', c.name, 
        'image', c.image
      ) AS category
    FROM PRODUCT p
    JOIN CATEGORY c ON p.category_id = c.id
    WHERE p.category_id = (
        SELECT category_id
        FROM PRODUCT
        WHERE id = $1
    ) AND p.id != $1
    ORDER BY p.quantity DESC
  `;

  const values = [id];

  if (limit && offset !== null) {
    query += ` LIMIT $2 OFFSET $3`;
    values.push(limit, offset);
  }

  return await db.any(query, values);
};

exports.getRelatedProductCount = async (id) => {
  const query = `
    SELECT COUNT(*) 
    FROM PRODUCT 
    WHERE category_id = (
        SELECT category_id 
        FROM PRODUCT 
        WHERE id = $1
    ) AND id != $1
  `;
  return await db.one(query, [id], (result) => +result.count);
};