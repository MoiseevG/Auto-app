import { useState } from "react";
import Card from "./Card";

export default function RecordList({ records, onUpdate, onDelete }) {
  const [filter, setFilter] = useState("all");

  const filteredRecords = records.filter((r) => {
    if (filter === "all") return true;
    return r.payment_status === filter;
  });

  return (
    <div style={{ padding: "20px" }}>
      <p>Фильтр по статусу:</p>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setFilter("all")}>Все</button>
        <button onClick={() => setFilter("Paid")}>Проведенные</button>
        <button onClick={() => setFilter("Pending")}>В работе</button>
        <button onClick={() => setFilter("Cancelled")}>Отмененные</button>
      </div>

      {filteredRecords.map((r) => (
        <Card 
          key={r.id} 
          record={r} 
          onUpdate={onUpdate} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}
