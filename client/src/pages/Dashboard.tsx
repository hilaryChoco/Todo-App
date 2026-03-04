import { useEffect, useState } from "react";
import { getTasks } from "../services/api";
import type { Task } from "../types/task";
import {
    Pencil,
    Trash2,
    Star,
    Calendar,
    Search,
    CheckSquare
} from "lucide-react";

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getTasks();
            setTasks(data);
            setLoading(false);
        }

        load();
    }, []);

    return (
        <div className="min-h-screen bg-blue-100 flex justify-center p-10">

            {/* MAIN CONTAINER */}
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">

                    {/* SEARCH */}
                    <div className="flex items-center border rounded-lg px-3 py-2 w-1/2">

                        <Search size={18} className="text-gray-400 mr-2" />

                        <input
                            placeholder="Search..."
                            className="outline-none w-full"
                        />

                    </div>

                    {/* NEW TASK BUTTON */}
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        + New Task
                    </button>

                </div>

                {/* FILTERS */}
                <div className="flex gap-3 mb-6">

                    <button className="bg-blue-600 text-white px-4 py-1 rounded-lg">
                        All
                    </button>

                    <button className="bg-gray-100 px-4 py-1 rounded-lg">
                        Active
                    </button>

                    <button className="bg-gray-100 px-4 py-1 rounded-lg">
                        Done
                    </button>

                    <button className="bg-gray-100 px-4 py-1 rounded-lg">
                        Important
                    </button>

                    <button className="bg-gray-100 px-4 py-1 rounded-lg">
                        Priority
                    </button>

                    <button className="bg-gray-100 px-4 py-1 rounded-lg">
                        Sort
                    </button>

                </div>

                {/* TASK LIST */}
                <div className="space-y-4">

                    {loading && <p>Loading tasks...</p>}

                    {!loading &&
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start">

                                    {/* LEFT SIDE */}
                                    <div className="flex gap-3">

                                        {/* CHECKBOX */}
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            className="w-5 h-5 mt-1"
                                        />

                                        <div>

                                            {/* TITLE */}
                                            <p className="font-semibold text-blue-900 text-lg">
                                                {task.title}
                                            </p>

                                            {/* DESCRIPTION */}
                                            <p className="text-gray-500 text-sm">
                                                {task.description}
                                            </p>

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
                        ))
                    }

                </div>

            </div>
        </div>
    );
}