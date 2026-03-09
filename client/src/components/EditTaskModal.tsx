import { useState, useEffect } from "react";
import { updateTask } from "../services/api";
import type { Task } from "../types/task";

type Props = {
    open: boolean;
    onClose: () => void;
    task: Task | null;
    onUpdated: (task: Task) => void;
};

export default function EditTaskModal({
    open,
    onClose,
    task,
    onUpdated
}: Props) {

    const [form, setForm] = useState<Partial<Task>>({});

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || "",
                description: task.description || "",
                important: task.important || false,
                completed: task.completed || false,
                priority: task.priority || "medium",
                startDate: task.startDate || "",
                startTime: task.startTime || "",
                endDate: task.endDate || "",
                endTime: task.endTime || ""
            });
        }
    }, [task]);

    if (!open || !task) return null;

    const handleChange = (field: keyof Task, value: any) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if(!task) return;

        const cleaned: any = {};

        Object.entries(form).forEach(([key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
                cleaned[key] = value;
            }
        });

        try {
            const updated = await updateTask(task.id, cleaned);

            onUpdated(updated);
            onClose();
        } catch (err) {
            console.error(err);
        }
    }
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[999]">
            <div
                className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6"
                onClick={(e) => e.stopPropagation()}
            >

                <h2 className="text-lg font-semibold mb-4">Edit Task</h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* TITLE */}
                    <input
                        className="w-full border rounded p-2"
                        value={form.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Title"
                    />

                    {/* DESCRIPTION */}
                    <textarea
                        className="w-full border rounded p-2"
                        value={form.description || ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Description"
                    />

                    {/* IMPORTANT */}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.important || false}
                            onChange={(e) => handleChange("important", e.target.checked)}
                        />
                        Important
                    </label>

                    {/* COMPLETED */}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.completed || false}
                            onChange={(e) => handleChange("completed", e.target.checked)}
                        />
                        Completed
                    </label>

                    {/* PRIORITY */}
                    <select
                        className="w-full border rounded p-2"
                        value={form.priority || "medium"}
                        onChange={(e) => handleChange("priority", e.target.value)}
                    >
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    {/* START DATE */}
                    <input
                        type="date"
                        className="w-full border rounded p-2"
                        value={form.startDate || ""}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                    />

                    {/* START TIME */}
                    <input
                        type="time"
                        className="w-full border rounded p-2"
                        value={form.startTime || ""}
                        onChange={(e) => handleChange("startTime", e.target.value)}
                    />

                    {/* END DATE */}
                    <input
                        type="date"
                        className="w-full border rounded p-2"
                        value={form.endDate || ""}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                    />

                    {/* END TIME */}
                    <input
                        type="time"
                        className="w-full border rounded p-2"
                        value={form.endTime || ""}
                        onChange={(e) => handleChange("endTime", e.target.value)}
                    />

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            className="border px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Update
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}