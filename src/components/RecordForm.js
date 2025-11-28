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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div className="create-form">
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "30px", color: "#4f46e5" }}>
          Новая запись
        </h2>
        <form onSubmit={handleSubmit}>
          <input name="client" value={form.client} onChange={handleChange} placeholder="Клиент (Иван Иванов)" required />
          <input name="car" value={form.car} onChange={handleChange} placeholder="Автомобиль (Lada Vesta)" required />
          <input name="service" value={form.service} onChange={handleChange} placeholder="Услуга (Замена масла + фильтры)" required />
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Сумма (8500)" required />
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
          <button type="submit">Создать запись</button>
        </form>
      </div>
    </div>
  );
}