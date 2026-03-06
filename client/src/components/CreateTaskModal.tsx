import { X, Star, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { createTask } from "../services/api";
import type { Priority } from "../types/task";

type Props = {
    open: boolean;
    onClose: () => void;
    onTaskCreated: (task: any) => void;
};

export default function CreateTaskModal({ open, onClose, onTaskCreated }: Props) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [important, setImportant] = useState(false);
    const [priority, setPriority] = useState<Priority>("urgent");

    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");

    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [error, setError] = useState<string | null>(null);

    const isTitleEmpty = title.trim() === "";

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setError(null);

        const task = {
            title,
            description,
            important,
            priority,
            startDate: startDate || null,
            startTime: startTime || null,
            endDate: endDate || null,
            endTime: endTime || null
        };

        try {
            const newTask = await createTask(task);
            onTaskCreated(newTask);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

            <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl animate-[scaleIn_.2s_ease]">

                {/* HEADER */}
                <div className="flex justify-between items-center border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Create Task
                    </h2>

                    <button
                        onClick={onClose}
                        className="hover:bg-gray-100 p-1 rounded"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* BODY */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* TITLE */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Title
                        </label>

                        <input
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (error) setError(null);
                            }}
                            className={`w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2
                            ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"} `}
                            placeholder="Task title..."
                        />

                        {error && (
                            <p className="text-red-500 text-sm mt-1">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Task description..."
                        />
                    </div>

                    {/* IMPORTANT */}
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2 text-gray-700">
                            <Star size={18} />
                            <span className="text-sm font-medium">
                                Important
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setImportant(!important)}
                            className={`relative w-11 h-6 rounded-full transition ${important ? "bg-blue-600" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${important ? "translate-x-5" : ""
                                    }`}
                            />
                        </button>

                    </div>

                    {/* PRIORITY */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Priority
                        </label>

                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    {/* START */}
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Start Date
                            </label>

                            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                <Calendar size={16} className="mr-2 text-gray-400" />

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Start Time
                            </label>

                            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                <Clock size={16} className="mr-2 text-gray-400" />

                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full outline-none"
                                />
                            </div>
                        </div>

                    </div>

                    {/* END */}
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Due Date
                            </label>

                            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                <Calendar size={16} className="mr-2 text-gray-400" />

                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Due Time
                            </label>

                            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                <Clock size={16} className="mr-2 text-gray-400" />

                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full outline-none"
                                />
                            </div>
                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="border-t pt-4 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 rounded-lg border hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isTitleEmpty}
                            className={`px-4 py-2 rounded-lg text-white
                                    ${isTitleEmpty
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                }`}
                        >
                            Create Task
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}