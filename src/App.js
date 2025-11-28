import { useState, useEffect } from 'react';
import './App.css';
import RecordList from './components/RecordList';
import CreateCard from './components/RecordForm';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';


import { 
  getRecords, 
  createRecord, 
  updatePaymentStatus, 
  removeRecord 
} from './api';

function Navigation() {
  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
      <Link to="/records" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>
        📋 Список записей
      </Link>
      <Link to="/create" style={{ textDecoration: 'none', color: '#007bff' }}>
        ➕ Создать запись
      </Link>
    </nav>
  );
}

function NotFound() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Страница не найдена</h2>
      <Link to="/records" style={{ color: '#007bff' }}>Вернуться</Link>
    </div>
  );
}

function App() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // === Загружаем данные при загрузке фронта ===
  useEffect(() => {
    async function load() {
      try {
        const data = await getRecords();
        setRecords(data);
      } catch (err) {
        console.error(err);
        alert("Ошибка API: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // === Создание записи ===
  const handleCreateRecord = async (newRecord) => {
    try {
      const created = await createRecord(newRecord);
      setRecords(prev => [...prev, created]);
    } catch (err) {
      alert("Ошибка создания: " + err.message);
    }
  };

  // === Обновление статуса оплаты ===
  const handleUpdateRecord = async (record) => {
    try {
      const updated = await updatePaymentStatus(record.id, record.payment_status);
      setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
    } catch (err) {
      alert("Ошибка обновления записи: " + err.message);
    }
  };

  // === Удаление ===
  const handleDeleteRecord = async (id) => {
    try {
      await removeRecord(id);
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Ошибка удаления: " + err.message);
    }
  };

  if (loading) {
    return <h2 style={{ padding: 20 }}>Загрузка...</h2>;
  }

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/records" replace />} />

        <Route
          path="/records"
          element={
            <RecordList
              records={records}
              onUpdate={handleUpdateRecord}
              onDelete={handleDeleteRecord}
            />
          }
        />

        <Route
          path="/create"
          element={<CreateCard onCreate={handleCreateRecord} />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
