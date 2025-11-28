import { useState } from "react";

export default function Card({ record, onUpdate, onDelete }) {
  const [currentRecord, setCurrentRecord] = useState(record);

  const handlePayment = () => {
    const amount = prompt("Введите сумму оплаты", currentRecord.price);
    const comment = prompt("Комментарий к оплате", "");
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

  const statusConfig = {
    PENDING: { color: "bg-yellow-500", text: "Ожидает", icon: "⏳" },
    PAID: { color: "bg-emerald-500", text: "Оплачено", icon: "✓" },
    CANCELLED: { color: "bg-red-500", text: "Отменено", icon: "✗" },
  };

  const status = statusConfig[currentRecord.payment_status] || { color: "bg-gray-400", text: "Неизвестно", icon: "?" };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* Цветная полоска сверху */}
      <div className={`h-2 ${status.color}`}></div>

      <div className="p-6">
        {/* Заголовок с иконкой статуса */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{currentRecord.client}</h3>
          <div className={`px-4 py-2 rounded-full text-white font-bold text-sm ${status.color} flex items-center gap-2`}>
            <span className="text-lg">{status.icon}</span>
            {status.text}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
          <div><span className="font-semibold">Авто:</span> {currentRecord.car}</div>
          <div><span className="font-semibold">Услуга:</span> {currentRecord.service}</div>
          <div><span className="font-semibold">Сумма:</span> <span className="text-xl font-bold text-emerald-600">{currentRecord.price} ₽</span></div>
          <div><span className="font-semibold">Дата:</span> {new Date(currentRecord.date).toLocaleDateString("ru-RU")}</div>
        </div>

        {currentRecord.comment && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
            <span className="font-semibold">Комментарий:</span> {currentRecord.comment}
          </div>
        )}

        {currentRecord.cancelReason && (
          <div className="bg-red-50 p-3 rounded-lg mb-4 text-sm">
            <span className="font-semibold">Причина отмены:</span> {currentRecord.cancelReason}
          </div>
        )}

        {/* Кнопки */}
        <div className="flex gap-3 mt-6">
          {currentRecord.payment_status === "PENDING" && (
            <>
              <button
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                Провести оплату
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                Отменить
              </button>
            </>
          )}

          <button
            onClick={() => onDelete(currentRecord.id)}
            className="px-6 py-3 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-md"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}