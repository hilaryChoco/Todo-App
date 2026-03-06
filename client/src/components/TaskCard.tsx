import type { Task } from "../types/task";
import { Pencil, Trash2, Star, Calendar } from "lucide-react";

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  return (
    <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">

      <div className="flex justify-between items-start">

        {/* LEFT SIDE */}
        <div className="flex gap-3">

          {/* CHECKBOX */}
          <input
            type="checkbox"
            checked={task.completed}
            className="w-5 h-5 mt-1"
            readOnly
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
        <div className="flex gap-3 text-blue-600">

          <button>
            <Pencil size={18} />
          </button>

          <button>
            <Star size={18} />
          </button>

          <button>
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

    </div>
  );
}