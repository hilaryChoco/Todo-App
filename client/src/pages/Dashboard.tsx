import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../services/api";
import type { Task } from "../types/task";

import {
Search,
User,
Pencil,
CheckCircle,
Star,
Flag,
ChevronDown
} from "lucide-react";

import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";

export default function Dashboard() {

const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(true);

const [openModal, setOpenModal] = useState(false);

const [editingTask, setEditingTask] = useState<Task | null>(null);
const [editOpen, setEditOpen] = useState(false);

const [search, setSearch] = useState("");

const [filter, setFilter] =
useState<"all" | "active" | "done" | "important">("all");

const [priorityFilter, setPriorityFilter] =
useState<string | null>(null);

const [priorityOpen, setPriorityOpen] = useState(false);
const [dateOpen, setDateOpen] = useState(false);

const [selectedDate, setSelectedDate] = useState<string | null>(null);

const resetExtraFilters = () => {
setPriorityFilter(null);
setSelectedDate(null);
setPriorityOpen(false);
};

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
await deleteTask(id);
setTasks(prev => prev.filter(task => task.id !== id));
};

const handleToggleImportant = async (task: Task) => {

const updated = await updateTask(task.id, {
important: !task.important
});

setTasks(prev =>
prev.map(t => (t.id === updated.id ? updated : t))
);

};

const handleToggleCompleted = async (task: Task) => {

const updated = await updateTask(task.id, {
completed: !task.completed
});

setTasks(prev =>
prev.map(t => (t.id === updated.id ? updated : t))
);

};

useEffect(() => {

async function load() {
const data = await getTasks();
setTasks(data);
setLoading(false);
}

load();

}, []);

const sortedTasks = [...tasks].sort(
(a, b) => Number(a.completed ?? false) - Number(b.completed ?? false)
);

let filteredTasks = [...sortedTasks];

if (filter === "active")
filteredTasks = filteredTasks.filter(t => !t.completed);

if (filter === "done")
filteredTasks = filteredTasks.filter(t => t.completed);

if (filter === "important")
filteredTasks = filteredTasks.filter(t => t.important);

if (priorityFilter)
filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);

if (search) {

const text = search.toLowerCase();

filteredTasks = filteredTasks.filter(task =>
task.title.toLowerCase().includes(text) ||
task.description?.toLowerCase().includes(text)
);

}

if (selectedDate) {

const chosen = new Date(selectedDate).getTime();

filteredTasks = filteredTasks.filter(task => {

if (!task.startDate || !task.endDate) return false;

const start = new Date(task.startDate).getTime();
const end = new Date(task.endDate).getTime();

return chosen >= start && chosen <= end;

});

}

return (

<div className="min-h-screen bg-blue-100 flex justify-center p-4 md:p-10">

<div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-4 md:p-6">

{/* HEADER */}

<div className="flex flex-col md:flex-row gap-3 md:gap-6 items-center justify-between mb-6">

<div className="flex items-center border rounded-lg px-3 py-2 w-full md:w-1/2">

<Search size={18} className="text-gray-400 mr-2" />

<input
placeholder="Search..."
className="outline-none w-full"
value={search}
onChange={(e) => setSearch(e.target.value)}
/>

</div>

<button
onClick={() => setOpenModal(true)}
className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 w-full md:w-auto"
>
+ New Task
</button>

</div>

{/* FILTERS */}

<div className="flex flex-wrap gap-2 mb-6 items-center">

<button
onClick={() => {
setFilter("all");
resetExtraFilters();
}}
className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg ${
filter === "all"
? "bg-blue-600 text-white"
: "bg-gray-100"
}`}
>
<User size={16} />
All
</button>

<button
onClick={() => {
setFilter("active");
resetExtraFilters();
}}
className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg ${
filter === "active"
? "bg-blue-600 text-white"
: "bg-gray-100"
}`}
>
<Pencil size={16} />
Active
</button>

<button
onClick={() => {
setFilter("done");
resetExtraFilters();
}}
className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg ${
filter === "done"
? "bg-blue-600 text-white"
: "bg-gray-100"
}`}
>
<CheckCircle size={16} />
Done
</button>

<button
onClick={() => {
setFilter("important");
resetExtraFilters();
}}
className={`cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg ${
filter === "important"
? "bg-blue-600 text-white"
: "bg-gray-100"
}`}
>
<Star size={16} />
Important
</button>

{/* PRIORITY */}

<div className="relative">

<button
onClick={() => setPriorityOpen(!priorityOpen)}
className="cursor-pointer flex items-center gap-2 px-4 py-1 rounded-lg bg-gray-100"
>
<Flag size={16} />
Priority
<ChevronDown size={14} />
</button>

{priorityOpen && (

<div className="absolute mt-1 bg-white shadow rounded-lg p-2 text-sm z-10">

{["urgent","high","medium","low"].map(p => (

<div
key={p}
onClick={() => {
setPriorityFilter(p);
setPriorityOpen(false);
}}
className="cursor-pointer px-2 py-1 hover:bg-gray-100"
>
{p}
</div>

))}

</div>

)}

</div>

{/* DATE FILTER */}

<div className="relative">

<button
onClick={() => setDateOpen(!dateOpen)}
className="cursor-pointer flex items-center gap-2 bg-gray-100 px-4 py-1 rounded-lg"
>
Date
<ChevronDown size={14} />
</button>

{dateOpen && (

<div className="absolute mt-1 bg-white shadow rounded-lg p-3 text-sm z-10">

<input
type="date"
className="border rounded px-2 py-1"
onChange={(e) => {
setSelectedDate(e.target.value);
setDateOpen(false);
}}
/>

</div>

)}

</div>

</div>

{/* TASK LIST */}

<div className="space-y-4">

{loading && <p>Loading tasks...</p>}

{!loading && filteredTasks.length === 0 && (
<p className="text-center text-gray-400 py-10">
No tasks found
</p>
)}

{!loading &&
filteredTasks.map((task, index) => {

const previous = filteredTasks[index - 1];

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