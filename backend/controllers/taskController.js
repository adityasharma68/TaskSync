// controllers/taskController.js
// ============================================================
// Task Controller – Business logic layer (MVC).
// CHANGE: req.user.id (from JWT middleware) is now passed to
//         every model method so tasks are user-scoped.
// ============================================================

const { validationResult } = require('express-validator');
const taskModel = require('../models/taskModel');

// ── Helpers ─────────────────────────────────────────────────
const respond = (res, code, success, message, data = null) => {
  const payload = { success, message };
  if (data !== null) payload.data = data;
  return res.status(code).json(payload);
};

const extractErrors = (req) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(', ');
};

// ────────────────────────────────────────────────────────────
// GET /tasks  →  Return ONLY the logged-in user's tasks
// CHANGE: passes req.user.id to getAllTasks()
// ────────────────────────────────────────────────────────────
const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id; // ← from JWT middleware
    const tasks  = await taskModel.getAllTasks(userId);
    return respond(res, 200, true, `${tasks.length} task(s) retrieved.`, tasks);
  } catch (err) {
    console.error('[getAllTasks]', err);
    return respond(res, 500, false, 'Server error while fetching tasks.');
  }
};

// ────────────────────────────────────────────────────────────
// GET /tasks/search?q=  →  Search only THIS user's tasks
// CHANGE: passes req.user.id to searchTasks()
// ────────────────────────────────────────────────────────────
const searchTasks = async (req, res) => {
  try {
    const userId  = req.user.id;
    const keyword = (req.query.q || '').trim();

    // Empty keyword → return all tasks for this user
    if (!keyword) {
      const tasks = await taskModel.getAllTasks(userId);
      return respond(res, 200, true, 'All tasks returned.', tasks);
    }

    const tasks = await taskModel.searchTasks(keyword, userId);
    return respond(res, 200, true, `${tasks.length} task(s) matched "${keyword}".`, tasks);
  } catch (err) {
    console.error('[searchTasks]', err);
    return respond(res, 500, false, 'Server error while searching tasks.');
  }
};

// ────────────────────────────────────────────────────────────
// GET /tasks/:id  →  Get one task (only if owned by user)
// CHANGE: passes req.user.id to getTaskById()
// ────────────────────────────────────────────────────────────
const getTaskById = async (req, res) => {
  try {
    const errMsg = extractErrors(req);
    if (errMsg) return respond(res, 422, false, errMsg);

    const task = await taskModel.getTaskById(req.params.id, req.user.id);
    if (!task) return respond(res, 404, false, 'Task not found.');
    return respond(res, 200, true, 'Task retrieved.', task);
  } catch (err) {
    console.error('[getTaskById]', err);
    return respond(res, 500, false, 'Server error while fetching the task.');
  }
};

// ────────────────────────────────────────────────────────────
// POST /tasks  →  Create task and assign to logged-in user
// CHANGE: userId = req.user.id is automatically stored in DB
// ────────────────────────────────────────────────────────────
const createTask = async (req, res) => {
  try {
    const errMsg = extractErrors(req);
    if (errMsg) return respond(res, 422, false, errMsg);

    const { title, description, due_date, status, remarks, created_by } = req.body;
    const userId = req.user.id; // ← automatically taken from JWT, not from form input

    const newTask = await taskModel.createTask({
      title:       title.trim(),
      description: description?.trim(),
      due_date:    due_date || null,
      status:      status || 'Pending',
      remarks:     remarks?.trim(),
      created_by:  (created_by || 'System').trim(),
      userId,      // ← task is now owned by the logged-in user
    });

    return respond(res, 201, true, 'Task created successfully.', newTask);
  } catch (err) {
    console.error('[createTask]', err);
    return respond(res, 500, false, 'Server error while creating the task.');
  }
};

// ────────────────────────────────────────────────────────────
// PUT /tasks/:id  →  Update task (only if user owns it)
// CHANGE: passes req.user.id so users cannot edit others' tasks
// ────────────────────────────────────────────────────────────
const updateTask = async (req, res) => {
  try {
    const errMsg = extractErrors(req);
    if (errMsg) return respond(res, 422, false, errMsg);

    const { title, description, due_date, status, remarks, updated_by } = req.body;
    const userId = req.user.id;

    const updated = await taskModel.updateTask(
      req.params.id,
      {
        title:       title.trim(),
        description: description?.trim(),
        due_date:    due_date || null,
        status,
        remarks:     remarks?.trim(),
        updated_by:  (updated_by || 'System').trim(),
      },
      userId  // ← only updates if task.user_id matches
    );

    if (!updated) return respond(res, 404, false, 'Task not found or access denied.');
    return respond(res, 200, true, 'Task updated successfully.', updated);
  } catch (err) {
    console.error('[updateTask]', err);
    return respond(res, 500, false, 'Server error while updating the task.');
  }
};

// ────────────────────────────────────────────────────────────
// DELETE /tasks/:id  →  Delete task (only if user owns it)
// CHANGE: passes req.user.id so users cannot delete others' tasks
// ────────────────────────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const errMsg = extractErrors(req);
    if (errMsg) return respond(res, 422, false, errMsg);

    const deleted = await taskModel.deleteTask(req.params.id, req.user.id);
    if (!deleted) return respond(res, 404, false, 'Task not found or access denied.');
    return respond(res, 200, true, `Task "${deleted.title}" deleted successfully.`, deleted);
  } catch (err) {
    console.error('[deleteTask]', err);
    return respond(res, 500, false, 'Server error while deleting the task.');
  }
};

module.exports = {
  getAllTasks,
  searchTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
