import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCard({ onCreate }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ client: "", car: "", service: "", price: "", date: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client || !form.car || !form.service || !form.price || !form.date) {
      alert("Заполните все поля");
      return;
    }
    onCreate({ ...form, price: Number(form.price) });
    navigate("/records");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <div>
        <label>Клиент: </label>
        <input name="client" value={form.client} onChange={handleChange} />
      </div>
      <div>
        <label>Автомобиль: </label>
        <input name="car" value={form.car} onChange={handleChange} />
      </div>
      <div>
        <label>Услуга: </label>
        <input name="service" value={form.service} onChange={handleChange} />
      </div>
      <div>
        <label>Сумма: </label>
        <input name="price" value={form.price} onChange={handleChange} type="number" />
      </div>
      <div>
        <label>Дата: </label>
        <input name="date" value={form.date} onChange={handleChange} type="date" />
      </div>
      <button type="submit" style={{ marginTop: "10px" }}>Создать запись</button>
    </form>
  );
}
