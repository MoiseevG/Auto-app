import { useState } from "react";

export default function Card({ record, onUpdate, onDelete }) {
  const [currentRecord, setCurrentRecord] = useState(record);

  const handlePayment = () => {
    const amount = prompt("Введите сумму оплаты", currentRecord.price);
    const comment = prompt("Оставьте комментарий", currentRecord.comment || "");
    if (!amount) return;

    const updated = { ...currentRecord, payment_status: "Paid", price: amount, comment };
    setCurrentRecord(updated);
    onUpdate(updated);
  };

  const handleCancel = () => {
    const reason = prompt("Введите причину отмены");
    if (!reason) return;

    const updated = { ...currentRecord, payment_status: "Cancelled", cancelReason: reason };
    setCurrentRecord(updated);
    onUpdate(updated);
  };

  const getColor = () => {
    switch (currentRecord.payment_status) {
      case "Paid": return "green";
      case "Pending": return "yellow";
      case "Cancelled": return "red";
      default: return "gray";
    }
  };

  return (
    <div style={{ border: `2px solid ${getColor()}`, padding: "10px", marginBottom: "10px" }}>
      <p><b>Клиент:</b> {currentRecord.client}</p>
      <p><b>Автомобиль:</b> {currentRecord.car}</p>
      <p><b>Услуга:</b> {currentRecord.service}</p>
      <p><b>Сумма:</b> {currentRecord.price}</p>
      <p><b>Дата:</b> {currentRecord.date}</p>
      <p><b>Статус:</b> {currentRecord.payment_status}</p>
      {currentRecord.payment_status === "Cancelled" && (
        <p><b>Причина отмены:</b> {currentRecord.cancelReason}</p>
      )}
      {currentRecord.comment && <p><b>Комментарий:</b> {currentRecord.comment}</p>}

      {currentRecord.payment_status === "Pending" && (
        <>
          <button onClick={handlePayment}>Провести</button>
          <button onClick={handleCancel} style={{ marginLeft: "10px" }}>Отменить</button>
        </>
      )}

      <button onClick={() => onDelete(currentRecord.id)} style={{ marginLeft: "10px" }}>Удалить</button>
    </div>
  );
}
