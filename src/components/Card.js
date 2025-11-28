import { useState } from "react";

export default function Card({ record, onUpdate, onDelete }) {
  const [currentRecord, setCurrentRecord] = useState(record);

  const handlePayment = () => {
    const amount = prompt("Введите сумму оплаты", currentRecord.price);
    const comment = prompt("Оставьте комментарий", currentRecord.comment || "");
    if (!amount) return;

    const updated = { ...currentRecord, payment_status: "PAID", price: amount, comment };
    setCurrentRecord(updated);
    onUpdate(updated);
  };

  const handleCancel = () => {
    const reason = prompt("Введите причину отмены");
    if (!reason) return;

    const updated = { ...currentRecord, payment_status: "CANCELLED", cancelReason: reason };
    setCurrentRecord(updated);
    onUpdate(updated);
  };

  const getColor = () => {
    switch (currentRecord.payment_status) {
      case "PAID": return "green";
      case "PENDING": return "yellow";
      case "CANCELLED": return "red";
      default: return "gray";
    }
  };

  const isPending = currentRecord.payment_status === "PENDING";

  return (
    <div style={{ border: `2px solid ${getColor()}`, padding: "16px", marginBottom: "12px", borderRadius: "8px" }}>
      <p><b>Клиент:</b> {currentRecord.client}</p>
      <p><b>Автомобиль:</b> {currentRecord.car}</p>
      <p><b>Услуга:</b> {currentRecord.service}</p>
      <p><b>Сумма:</b> {currentRecord.price} ₽</p>
      <p><b>Дата:</b> {currentRecord.date}</p>
      <p><b>Статус:</b> 
        <span style={{ 
          padding: "2px 8px", 
          borderRadius: "4px", 
          background: getColor(), 
          color: "white", 
          marginLeft: "8px", 
          fontSize: "0.8em" 
        }}>
          {currentRecord.payment_status === "PENDING" && "Ожидает оплаты"}
          {currentRecord.payment_status === "PAID" && "Оплачено"}
          {currentRecord.payment_status === "CANCELLED" && "Отменено"}
        </span>
      </p>

      {currentRecord.cancelReason && (
        <p><b>Причина отмены:</b> {currentRecord.cancelReason}</p>
      )}
      {currentRecord.comment && <p><b>Комментарий:</b> {currentRecord.comment}</p>}

      {/* КНОПКИ ТОЛЬКО ДЛЯ PENDING */}
      {isPending && (
        <div style={{ marginTop: "12px" }}>
          <button onClick={handlePayment} style={{ background: "#28a745", color: "white", padding: "8px 16px", marginRight: "8px" }}>
            Провести оплату
          </button>
          <button onClick={handleCancel} style={{ background: "#dc3545", color: "white", padding: "8px 16px" }}>
            Отменить запись
          </button>
        </div>
      )}

      {/* КНОПКА УДАЛЕНИЯ ВСЕГДА */}
      <button 
        onClick={() => onDelete(currentRecord.id)} 
        style={{ 
          marginTop: "12px", 
          background: "#6c757d", 
          color: "white", 
          padding: "8px 16px" 
        }}>
        Удалить
      </button>
    </div>
  );
}