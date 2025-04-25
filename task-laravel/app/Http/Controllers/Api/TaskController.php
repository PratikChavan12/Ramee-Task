<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Fetch all tasks from the database
        return Task::all();
    }

    /**
     * Store a newly created task in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'type' => 'required|string',
            'duedate' => 'required|date',
            'entity' => 'required|string',
            'staff' => 'required|string',
            'file' => 'nullable|image|max:2048', // File validation
        ]);

        // If there's a file in the request, upload it and get the file path
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('uploads/tasks', 'public');
            $validated['file'] = asset("storage/$path"); // Store the file URL
        }

        // Create the task in the database
        $task = Task::create($validated);

        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task
        ], 201);
    }

    /**
     * Fetch task by ID or return all tasks if no ID is provided.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function getTasks(Request $request)
    {
        // Log to check what's being received (optional)
        \Log::info('Request payload:', $request->all());

        // If 'id' is present and not empty, return single task
        if ($request->has('id') && $request->filled('id')) {
            $request->validate([
                'id' => 'required|exists:tasks,id'
            ]);

            $task = Task::find($request->id);

            return response()->json([
                'success' => true,
                'message' => 'Task fetched successfully',
                'data' => $task
            ]);
        }

        // Else return all tasks
        $tasks = Task::all();

        return response()->json([
            'success' => true,
            'message' => 'All tasks fetched successfully',
            'data' => $tasks
        ]);
    }
    

    /**
     * Update the specified task in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function updateWithBody(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'id' => 'required|exists:tasks,id',
            'title' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'priority' => 'in:low,medium,high',
            'type' => 'string',
            'duedate' => 'date',
            'entity' => 'string',
            'staff' => 'string',
            'file' => 'nullable|image|max:2048',
        ]);

        // Find the task by ID
        $task = Task::find($request->id);

        // If the request contains a file, handle file upload
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('uploads/tasks', 'public');
            $request['file'] = asset("storage/$path");
        }

        // Update the task in the database with the validated data
        $task->update($request->except('id'));

        // Return success response with updated task data
        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task
        ]);
    }

    /**
     * Remove the specified task from storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function deleteWithBody(Request $request)
    {
        // Validate the incoming request for task ID
        $request->validate([
            'id' => 'required|exists:tasks,id'
        ]);
    
        // Find the task by ID
        $task = Task::find($request->id);
    
        // Ensure the task exists
        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }
    
        // Delete the associated file if exists
        if ($task->file) {
            // Remove the "storage" part from the path
            $path = str_replace('storage/', '', $task->file);
    
            // Delete the file from storage
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }
    
        // Delete the task from the database
        $task->delete();
    
        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully'
        ]);
    }
    
}
