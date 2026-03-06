import type { Task } from "../types/task";
import { Pencil, Trash2, Star, Calendar } from "lucide-react";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onToggleImportant: (task: Task) => void;
  onToggleCompleted: (task: Task) => void;
};

export default function TaskCard({ task, onDelete, onEdit, onToggleImportant, onToggleCompleted }: Props) {

  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5
      animate-taskAppear">

      <div className="flex justify-between items-start">

        {/* LEFT SIDE */}
        <div className="flex gap-3">

          {/* CHECKBOX */}
          <input
            type="checkbox"
            checked={task.completed}
            className="w-5 h-5 mt-1 cursor-pointer"
            onChange={() => onToggleCompleted(task)}
          />

          <div>

            {/* TITLE */}
            <p className="font-semibold text-blue-900 text-lg">
              {task.title}
            </p>

            {/* DESCRIPTION */}
            {task.description && (
              <p className="text-gray-500 text-sm">
                {task.description}
              </p>
            )}

            {/* DATE */}
            {task.endDate && (
              <div className="flex items-center gap-2 text-blue-600 text-sm mt-1">
                <Calendar size={16} />
                <span>
                  Due: {new Date(task.endDate).toLocaleDateString()}
                </span>
              </div>
            )}

          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 text-blue-600 [&>button]:hover:scale-110 [&>button]:transition">

          <button
            onClick={() => onEdit(task)}
            className="cursor-pointer"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onToggleImportant(task)}
            className="cursor-pointer"
          >
            <Star
              size={18}
              className={task.important ? "text-orange-500 fill-orange-500" : ""}
            />
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="cursor-pointer hover:text-red-600 transition"
          >
            <Trash2 size={18} />
          </button>

        </div>
      </div>

      {/* PRIORITY BADGE */}
      <div className="mt-3">

        {task.priority === "urgent" && (
          <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-md">
            URGENT
          </span>
        )}

        {task.priority === "high" && (
          <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-md">
            HIGH
          </span>
        )}

        {task.priority === "medium" && (
          <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-md">
            MEDIUM
          </span>
        )}

        {task.priority === "low" && (
          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-md">
            LOW
          </span>
        )}

      </div>

      <DeleteConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
          onDelete(task.id);
          setShowDelete(false);
        }}
      />

    </div>
  );
}