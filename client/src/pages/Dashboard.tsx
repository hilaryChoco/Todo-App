import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../services/api";
import type { Task } from "../types/task";
import { Search } from "lucide-react";

import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";

export default function Dashboard() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleTaskCreated = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setEditOpen(true);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev =>
      prev.map(t => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleToggleImportant = async (task: Task) => {
    try {

      const updated = await updateTask(task.id, {
        important: !task.important
      });

      setTasks(prev =>
        prev.map(t => (t.id === updated.id ? updated : t))
      );

    } catch (err) {
      console.error("Important toggle failed", err);
    }
  };

  const handleToggleCompleted = async (task: Task) => {
    try {

      const updated = await updateTask(task.id, {
        completed: !task.completed
      });

      setTasks(prev =>
        prev.map(t => (t.id === updated.id ? updated : t))
      );

    } catch (err) {
      console.error("Completed toggle failed", err);
    }
  };

  useEffect(() => {

    async function load() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error("Load tasks failed", err);
      } finally {
        setLoading(false);
      }
    }

    load();

  }, []);

  const sortedTasks = [...tasks].sort(
    (a, b) => Number(a.completed ?? false) - Number(b.completed ?? false)
  );

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center p-10">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center border rounded-lg px-3 py-2 w-1/2">

            <Search size={18} className="text-gray-400 mr-2" />

            <input
              placeholder="Search..."
              className="outline-none w-full"
            />

          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            + New Task
          </button>

        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-6">

          <button className="cursor-pointer bg-blue-600 text-white px-4 py-1 rounded-lg">
            All
          </button>

          <button className="cursor-pointer bg-gray-100 px-4 py-1 rounded-lg">
            Active
          </button>

          <button className="cursor-pointer bg-gray-100 px-4 py-1 rounded-lg">
            Done
          </button>

          <button className="cursor-pointer bg-gray-100 px-4 py-1 rounded-lg">
            Important
          </button>

          <button className="cursor-pointer bg-gray-100 px-4 py-1 rounded-lg">
            Priority
          </button>

          <button className="cursor-pointer bg-gray-100 px-4 py-1 rounded-lg">
            Sort
          </button>

        </div>

        {/* TASK LIST */}
        <div className="space-y-4">

          {loading && <p>Loading tasks...</p>}

          {!loading &&
            sortedTasks.map((task, index) => {

              const previous = sortedTasks[index - 1];

              const showDivider =
                previous &&
                !previous.completed &&
                task.completed;

              return (
                <div key={task.id}>

                  {showDivider && (
                    <div className="border-t pt-4 mt-6 text-center text-gray-400 text-sm">
                      Completed Tasks
                    </div>
                  )}

                  <TaskCard
                    task={task}
                    onDelete={handleDeleteTask}
                    onEdit={handleEdit}
                    onToggleImportant={handleToggleImportant}
                    onToggleCompleted={handleToggleCompleted}
                  />

                </div>
              );

            })}

        </div>

      </div>

      <CreateTaskModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onTaskCreated={handleTaskCreated}
      />

      <EditTaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={editingTask}
        onUpdated={handleTaskUpdated}
      />

    </div>
  );
}