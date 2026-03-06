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
import TaskCard from "../components/TaskCard";

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
                            <TaskCard key={task.id} task={task} />
                        ))}

                </div>

            </div>
        </div>
    );
}