<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;

// Route to fetch tasks (by title or all tasks)
Route::post('/get-tasks', [TaskController::class, 'getTasks']);

// Route to create a new task
Route::post('/tasks/create', [TaskController::class, 'store']);

// Route to update an existing task
Route::post('/tasks/update', [TaskController::class, 'updateWithBody']);

// Route to delete a task
Route::post('/tasks/delete', [TaskController::class, 'deleteWithBody']);
