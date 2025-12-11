const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

function normalizePhone(input) {
  const digits = String(input || '').replace(/\D/g, '');
  if (!digits) return '';
  const d = digits.length === 11 ? `+${digits[0]}${digits.slice(1)}` : `+${digits}`;
  return d;
}

let users = [
  { id: 1, phone: '+79991234567', name: 'Оператор', role: 'operator' },
  { id: 2, phone: '+79990000001', name: 'Клиент', role: 'client' },
  { id: 3, phone: '+79990000002', name: 'Оператор 2', role: 'operator' }
];
let nextUserId = 4;

let services = [
  { id: 1, name: 'Диагностика', price: 1500 },
  { id: 2, name: 'Замена масла', price: 2500 },
  { id: 3, name: 'Ремонт тормозов', price: 4000 }
];

let mastersByService = {
  1: [{ id: 1, name: 'Иван' }, { id: 2, name: 'Сергей' }],
  2: [{ id: 3, name: 'Петр' }],
  3: [{ id: 4, name: 'Алексей' }]
};

let operations = [
  {
    id: 1,
    client_name: 'Иван Иванов',
    car: 'Lada Vesta',
    service_id: 1,
    service: services.find(s => s.id === 1),
    master: mastersByService[1][0],
    price: 1500,
    status: 'PENDING',
    comment: '',
    cancel_reason: '',
    date: new Date().toISOString(),
    operator_id: 1,
    operator: users.find(u => u.id === 1)
  }
];
let nextOperationId = 2;

let shifts = {};
let nextShiftId = 1;

app.post('/auth/login', (req, res) => {
  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ detail: 'Телефон обязателен' });
  const normalized = normalizePhone(phone);
  const user = users.find(u => u.phone === normalized);
  if (!user) return res.status(404).json({ detail: 'Пользователь не найден' });
  res.json({ message: 'Код отправлен', code_hint: '1234' });
});

app.post('/auth/verify', (req, res) => {
  const { phone, code } = req.body || {};
  if (!phone || !code) return res.status(400).json({ detail: 'Телефон и код обязательны' });
  if (String(code) !== '1234') return res.status(401).json({ detail: 'Неверный код' });
  const normalized = normalizePhone(phone);
  const user = users.find(u => u.phone === normalized);
  if (!user) return res.status(404).json({ detail: 'Пользователь не найден' });
  res.json({ user });
});

app.post('/users/register', (req, res) => {
  const { phone, name, role } = req.body || {};
  if (!phone || !name) return res.status(400).json({ detail: 'Телефон и имя обязательны' });
  const normalized = normalizePhone(phone);
  const exists = users.find(u => u.phone === normalized);
  if (exists) return res.status(409).json({ detail: 'Пользователь уже существует' });
  const user = { id: nextUserId++, phone: normalized, name, role: role === 'operator' ? 'operator' : 'client' };
  users.push(user);
  res.json({ id: user.id });
});

app.get('/services/', (req, res) => {
  res.json(services);
});

app.get('/services/:id/masters', (req, res) => {
  const sid = Number(req.params.id);
  res.json(mastersByService[sid] || []);
});

app.get('/operations/', (req, res) => {
  const operatorId = req.query.operator_id ? Number(req.query.operator_id) : null;
  const data = operatorId ? operations.filter(o => o.operator_id === operatorId) : operations;
  res.json(data);
});

app.get('/operations/:id', (req, res) => {
  const id = Number(req.params.id);
  const op = operations.find(o => o.id === id);
  if (!op) return res.status(404).json({ detail: 'Запись не найдена' });
  res.json(op);
});

app.post('/operations/', (req, res) => {
  const operatorId = req.query.operator_id ? Number(req.query.operator_id) : null;
  const { client_name, car, service_id, price, comment } = req.body || {};
  if (!operatorId) return res.status(400).json({ detail: 'operator_id обязателен' });
  const operator = users.find(u => u.id === operatorId);
  if (!operator || operator.role !== 'operator') return res.status(403).json({ detail: 'Только оператор может создавать записи' });
  if (!client_name || !car || !service_id || !price) return res.status(400).json({ detail: 'Заполните все поля' });
  const service = services.find(s => s.id === Number(service_id));
  const op = {
    id: nextOperationId++,
    client_name,
    car,
    service_id: Number(service_id),
    service,
    master: null,
    price: Number(price),
    status: 'PENDING',
    comment: comment || '',
    cancel_reason: '',
    date: new Date().toISOString(),
    operator_id: operatorId,
    operator
  };
  operations.push(op);
  res.json(op);
});

app.patch('/operations/:id/pay', (req, res) => {
  const id = Number(req.params.id);
  const operatorId = req.query.operator_id ? Number(req.query.operator_id) : null;
  const op = operations.find(o => o.id === id);
  if (!op) return res.status(404).json({ detail: 'Запись не найдена' });
  if (!operatorId) return res.status(400).json({ detail: 'operator_id обязателен' });
  const operator = users.find(u => u.id === operatorId);
  if (!operator || operator.role !== 'operator') return res.status(403).json({ detail: 'Только оператор может проводить оплату' });
  op.status = 'PAID';
  res.json(op);
});

app.patch('/operations/:id/cancel', (req, res) => {
  const id = Number(req.params.id);
  const operatorId = req.query.operator_id ? Number(req.query.operator_id) : null;
  const reason = req.query.reason || '';
  const op = operations.find(o => o.id === id);
  if (!op) return res.status(404).json({ detail: 'Запись не найдена' });
  if (!operatorId) return res.status(400).json({ detail: 'operator_id обязателен' });
  const operator = users.find(u => u.id === operatorId);
  if (!operator || operator.role !== 'operator') return res.status(403).json({ detail: 'Только оператор может отменять запись' });
  op.status = 'CANCELLED';
  op.cancel_reason = reason;
  res.json(op);
});

app.delete('/operations/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = operations.findIndex(o => o.id === id);
  if (idx === -1) return res.status(404).json({ detail: 'Запись не найдена' });
  operations.splice(idx, 1);
  res.send('ok');
});

app.get('/shifts/current', (req, res) => {
  const operatorId = req.query.operator_id ? Number(req.query.operator_id) : null;
  if (!operatorId) return res.json(null);
  const shift = shifts[operatorId] || null;
  res.json(shift);
});

app.post('/shifts/open', (req, res) => {
  const operatorId = req.query.operator_id ? Number(req.query.operator_id) : null;
  if (!operatorId) return res.status(400).json({ detail: 'operator_id обязателен' });
  const operator = users.find(u => u.id === operatorId);
  if (!operator || operator.role !== 'operator') return res.status(403).json({ detail: 'Только оператор может открывать смену' });
  if (shifts[operatorId]) return res.status(409).json({ detail: 'Смена уже открыта' });
  const shift = { id: nextShiftId++, operator_id: operatorId, start_time: new Date().toISOString() };
  shifts[operatorId] = shift;
  res.json(shift);
});

app.post('/shifts/close', (req, res) => {
  const operatorId = req.query.operator_id ? Number(req.query.operator_id) : null;
  const shiftId = req.query.shift_id ? Number(req.query.shift_id) : null;
  if (!operatorId || !shiftId) return res.status(400).json({ detail: 'shift_id и operator_id обязательны' });
  const operator = users.find(u => u.id === operatorId);
  if (!operator || operator.role !== 'operator') return res.status(403).json({ detail: 'Только оператор может закрывать смену' });
  if (!shifts[operatorId] || shifts[operatorId].id !== shiftId) return res.status(404).json({ detail: 'Смена не найдена' });
  delete shifts[operatorId];
  res.json({ status: 'closed' });
});

const port = 8000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
