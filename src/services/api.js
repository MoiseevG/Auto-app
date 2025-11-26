const API_BASE_URL = process.env.REACT_APP_API_URL; 

export async function getRecords() {
  const res = await fetch(`${API_BASE_URL}/`);
  if (!res.ok) throw new Error('Ошибка при получении записей');
  return res.json();
}

export async function getRecord(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Запись не найдена');
  return res.json();
}

export async function createRecord(record) {
  const res = await fetch(`${API_BASE_URL}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Ошибка при создании записи');
  return res.json();
}

export async function updatePaymentStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/${id}/payment-status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status: status }),
  });
  if (!res.ok) throw new Error('Ошибка при обновлении платежа');
  return res.json();
}

export async function removeRecord(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Ошибка при удалении записи');
  return res.text();
}
