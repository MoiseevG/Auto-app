import { useState } from "react";
import Card from "./Card";

export default function RecordList({ records, onUpdate, onDelete }) {
  const [filter, setFilter] = useState("all");

  const filters = [
    { id: "all", label: "Все записи", icon: "📋" },
    { id: "PENDING", label: "В работе", icon: "⏳", color: "bg-yellow-500" },
    { id: "PAID", label: "Оплачено", icon: "✓", color: "bg-emerald-500" },
    { id: "CANCELLED", label: "Отменено", icon: "✗", color: "bg-red-500" },
  ];

  const filtered = filter === "all" ? records : records.filter(r => r.payment_status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Записи автосервиса</h1>

        {/* Фильтры */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-8 py-4 rounded-2xl font-bold text-white shadow-lg transform transition-all duration-300 hover:scale-110 ${
                filter === f.id ? "ring-4 ring-white ring-opacity-60" : ""
              } ${f.color || "bg-gradient-to-r from-purple-500 to-indigo-600"}`}
            >
              <span className="text-2xl mr-3">{f.icon}</span>
              {f.label} ({records.filter(r => f.id === "all" || r.payment_status === f.id).length})
            </button>
          ))}
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-3xl text-gray-400">Записей нет</p>
            </div>
          ) : (
            filtered.map(record => (
              <Card key={record.id} record={record} onUpdate={onUpdate} onDelete={onDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}