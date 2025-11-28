import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCard({ onCreate }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ client: "", car: "", service: "", price: "", date: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client || !form.car || !form.service || !form.price || !form.date) {
      alert("Заполните все поля!");
      return;
    }
    onCreate({ ...form, price: Number(form.price) });
    navigate("/records");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
        <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          Новая запись
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {["client", "car", "service"].map(field => (
            <div key={field}>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                {field === "client" && "Клиент"}
                {field === "car" && "Автомобиль"}
                {field === "service" && "Услуга"}
              </label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-all text-lg"
                placeholder={field === "client" ? "Иван Иванов" : field === "car" ? "Toyota Camry" : "Полировка + химчистка"}
                required
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Сумма</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none transition-all text-lg"
                placeholder="15000"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Дата</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-lg"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl py-5 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Создать запись
          </button>
        </form>
      </div>
    </div>
  );
}