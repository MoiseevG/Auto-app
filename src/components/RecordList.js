import { useState } from "react";
import Card from "./Card";

export default function RecordList({ records, onUpdate, onDelete }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" 
    ? records 
    : records.filter(r => r.payment_status === filter);

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", fontSize: "2.8rem", color: "white", margin: "40px 0", textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}>
        Автосервис — Записи
      </h1>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button onClick={() => setFilter("all")} className="btn" style={{ background: filter === "all" ? "#6366f1" : "#8b5cf6", margin: "0 8px" }}>
          Все ({records.length})
        </button>
        <button onClick={() => setFilter("PENDING")} className="btn" style={{ background: "#f59e0b", margin: "0 8px" }}>
          В работе ({records.filter(r => r.payment_status === "PENDING").length})
        </button>
        <button onClick={() => setFilter("PAID")} className="btn" style={{ background: "#10b981", margin: "0 8px" }}>
          Оплачено ({records.filter(r => r.payment_status === "PAID").length})
        </button>
        <button onClick={() => setFilter("CANCELLED")} className="btn" style={{ background: "#ef4444", margin: "0 8px" }}>
          Отменено ({records.filter(r => r.payment_status === "CANCELLED").length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.8rem", color: "white", marginTop: "100px" }}>
          Записей нет
        </p>
      ) : (
        filtered.map(record => (
          <Card key={record.id} record={record} onUpdate={onUpdate} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}