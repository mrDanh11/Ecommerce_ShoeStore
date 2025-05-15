//write an example route for a simple CRUD API using express & exampleMiddleware
import express from 'express';
import { exampleMiddleware } from '../middlewares/exampleMiddleware.js';
import {
  createExample,
} from '../controllers/exampleController.js';
const router = express.Router();
// Define routes
router.post('/example', exampleMiddleware, createExample);
