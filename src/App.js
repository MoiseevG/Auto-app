import { useState, useEffect } from 'react';
import './App.css';
import RecordList from './components/RecordList';
import CreateCard from './components/RecordForm';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

function Navigation() {
  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
      <Link to="/records" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>📋 Список записей</Link>
      <Link to="/create" style={{ textDecoration: 'none', color: '#007bff' }}>➕ Создать запись</Link>
    </nav>
  );
}

function NotFound() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Страница не найдена</h2>
      <p>Проверьте адрес или перейдите к списку записей.</p>
      <Link to="/records" style={{ color: '#007bff' }}>К списку записей</Link>
    </div>
  );
}

function App() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('records');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('records', JSON.stringify(records));
  }, [records]);

  const handleCreateRecord = (newRecord) => {
    const recordWithId = { ...newRecord, id: Date.now(), payment_status: "Pending" };
    setRecords(prev => [...prev, recordWithId]);
  };

  const handleUpdateRecord = (updatedRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  const handleDeleteRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/records" replace />} />
          <Route path="/records" element={
            <RecordList 
              records={records} 
              onUpdate={handleUpdateRecord} 
              onDelete={handleDeleteRecord} 
            />} 
          />
          <Route path="/create" element={<CreateCard onCreate={handleCreateRecord} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
