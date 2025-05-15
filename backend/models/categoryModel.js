const db = require("../config/database");

exports.getCategories = async (limit, offset, search) => {
  let query = "SELECT * FROM CATEGORY";
  const values = [];

  if (search) {
    query += " WHERE name ILIKE $1";
    values.push(`%${search}%`);
  }

  if (limit) {
    query += search ? " LIMIT $2 OFFSET $3" : " LIMIT $1 OFFSET $2";
    values.push(limit, offset);
  }

  return await db.any(query, values);
};

exports.getCategoryCount = async (search) => {
  let query = "SELECT COUNT(*) FROM CATEGORY";
  const values = [];

  if (search) {
    query += " WHERE name ILIKE $1";
    values.push(`%${search}%`);
  }

  const result = await db.one(query, values);
  return parseInt(result.count);
};

exports.insertCategory = async (name, image) => {
  return await db.none("INSERT INTO CATEGORY (name, image) VALUES ($1, $2)", [
    name,
    image,
  ]);
};

exports.deleteCategoryById = async (id) => {
  return await db.result("DELETE FROM CATEGORY WHERE id = $1", [id]);
};

exports.updateCategoryById = async (id, updates) => {
  const fields = [];
  const values = [];

  Object.keys(updates).forEach((key, index) => {
    fields.push(`${key} = $${index + 1}`);
    values.push(updates[key]);
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const query = `UPDATE CATEGORY SET ${fields.join(
    ", "
  )} WHERE id = ${id} RETURNING *;`;
  return await db.oneOrNone(query, values);
};