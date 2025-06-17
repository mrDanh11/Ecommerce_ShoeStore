//write an example controller for a simple CRUD API using
const Example = require('../models/exampleModel');

// Create a new example
exports.createExample = async (req, res) => {
  try {
    const example = new Example(req.body);
    await example.save();
    res.status(201).json(example);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};