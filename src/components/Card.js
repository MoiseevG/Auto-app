import { useState } from "react";

export default function Card({ record, onUpdate, onDelete }) {
  const [currentRecord, setCurrentRecord] = useState(record);

  const handlePayment = () => {
    const amount = prompt("Введите сумму оплаты", currentRecord.price);
    const comment = prompt("Комментарий к оплате", currentRecord.comment || "");
    if (!amount) return;

    const updated = { ...currentRecord, payment_status: "PAID", price: +amount, comment };
    setCurrentRecord(updated);
    onUpdate(updated);
  };

  const handleCancel = () => {
    const reason = prompt("Причина отмены записи");
    if (!reason) return;

    const updated = { ...currentRecord, payment_status: "CANCELLED", cancelReason: reason };
    setCurrentRecord(updated);
    onUpdate(updated);
  };

  const statusClass = {
    PENDING: "status-pending",
    PAID: "status-paid",
    CANCELLED: "status-cancelled"
  }[currentRecord.payment_status] || "";

  const statusText = {
    PENDING: "Ожидает оплаты",
    PAID: "Оплачено",
    CANCELLED: "Отменено"
  }[currentRecord.payment_status] || "Неизвестно";

  return (
    <div className={`record-card ${statusClass}`} style={{ "--status-color": statusClass.includes("pending") ? "#f59e0b" : statusClass.includes("paid") ? "#10b981" : "#ef4444" }}>
      <div className="flex justify-between items-start mb-4">
        <h3 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#1e40af", margin: 0 }}>
          {currentRecord.client}
        </h3>
        <div className={`status-badge ${statusClass}`}>
          {statusText}
        </div>
      </div>

      <div className="info-grid">
        <div><strong>Авто:</strong> {currentRecord.car}</div>
        <div><strong>Услуга:</strong> {currentRecord.service}</div>
        <div><strong>Сумма:</strong> <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#10b981" }}>{currentRecord.price} ₽</span></div>
        <div><strong>Дата:</strong> {new Date(currentRecord.date).toLocaleDateString("ru-RU")}</div>
      </div>

      {currentRecord.comment && (
        <div style={{ background: "#ebf8ff", padding: "12px", borderRadius: "12px", margin: "16px 0", fontSize: "0.95rem" }}>
          <strong>Комментарий:</strong> {currentRecord.comment}
        </div>
      )}

      {currentRecord.cancelReason && (
        <div style={{ background: "#fee2e2", padding: "12px", borderRadius: "12px", margin: "16px 0", fontSize: "0.95rem" }}>
          <strong>Причина отмены:</strong> {currentRecord.cancelReason}
        </div>
      )}

      <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
        {currentRecord.payment_status === "PENDING" && (
          <>
            <button onClick={handlePayment} className="btn btn-pay">
              Провести оплату
            </button>
            <button onClick={handleCancel} className="btn btn-cancel">
              Отменить
            </button>
          </>
        )}
        <button onClick={() => onDelete(currentRecord.id)} className="btn btn-delete">
          Удалить
        </button>
      </div>
    </div>
  );
}