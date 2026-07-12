import { useState, useEffect } from 'react';
import { getFuelLogs, createFuelLog } from '../services/fuelService.js';
import { getExpenses, createExpense } from '../services/expenseService.js';
import { getVehicles } from '../services/vehicleService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { canAccess, canEdit } from '../utils/permissions.js';
import { formatCurrency, currencySymbol } from '../utils/currency.js';
import Loader from '../components/ui/Loader.jsx';
import Alert from '../components/ui/Alert.jsx';

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-surface-raised/60 backdrop-blur-sm border border-border-subtle rounded-2xl p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold text-white mt-1.5">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
        active
          ? 'bg-accent text-black border-accent'
          : 'text-gray-400 border-border-subtle hover:bg-surface-panel'
      }`}
    >
      {children}
    </button>
  );
}

function FuelForm({ vehicles, onSubmit, onClose, submitting }) {
  const { currency } = useSettings();
  const [form, setForm] = useState({ vehicleId: '', liters: '', cost: '', date: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.vehicleId || !form.liters || !form.cost || !form.date) {
      setError('All fields are required.');
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Vehicle</label>
        <select
          value={form.vehicleId}
          onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-white focus:outline-none focus:border-accent transition-colors"
        >
          <option value="">Select vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Liters</label>
          <input
            type="number"
            step="0.01"
            value={form.liters}
            onChange={(e) => setForm({ ...form, liters: e.target.value })}
            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
            placeholder="45.5"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Cost ({currencySymbol(currency)})</label>
          <input
            type="number"
            step="0.01"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
            placeholder="4200"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-white focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
        />
      </div>

      {error && (
        <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 border border-border-subtle hover:bg-surface-panel transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-accent text-black hover:bg-accent-hover transition-colors shadow-[0_0_20px_-4px_var(--color-accent)] disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Add Fuel Log'}
        </button>
      </div>
    </form>
  );
}

function ExpenseForm({ vehicles, onSubmit, onClose, submitting }) {
  const { currency } = useSettings();
  const [form, setForm] = useState({ vehicleId: '', type: 'Toll', amount: '', date: '', notes: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.vehicleId || !form.amount || !form.date) {
      setError('Vehicle, amount, and date are required.');
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Vehicle</label>
        <select
          value={form.vehicleId}
          onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-white focus:outline-none focus:border-accent transition-colors"
        >
          <option value="">Select vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option>Toll</option>
            <option>Maintenance</option>
            <option>Parking</option>
            <option>Fine</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount ({currencySymbol(currency)})</label>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
            placeholder="350"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-white focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Notes (optional)</label>
        <input
          type="text"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
          placeholder="NH-544 toll plaza"
        />
      </div>

      {error && (
        <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 border border-border-subtle hover:bg-surface-panel transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-accent text-black hover:bg-accent-hover transition-colors shadow-[0_0_20px_-4px_var(--color-accent)] disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-raised/95 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Fuel() {
  const { role } = useAuth();
  const { currency } = useSettings();
  const allowed = canAccess(role, 'fuelExpenses');
  const editable = canEdit(role, 'fuelExpenses');

  const [tab, setTab] = useState('fuel');
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [fuelData, expenseData, vehicleData] = await Promise.all([
        getFuelLogs(),
        getExpenses(),
        getVehicles(),
      ]);
      setFuelLogs(fuelData);
      setExpenses(expenseData);
      setVehicles(vehicleData);
    } catch (err) {
      setError('Could not load data from the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allowed) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  const handleAddFuel = async (form) => {
    setSubmitting(true);
    try {
      const log = await createFuelLog(form);
      setFuelLogs([log, ...fuelLogs]);
      setShowModal(false);
    } catch (err) {
      setError('Failed to save fuel log. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExpense = async (form) => {
    setSubmitting(true);
    try {
      const expense = await createExpense(form);
      setExpenses([expense, ...expenses]);
      setShowModal(false);
    } catch (err) {
      setError('Failed to save expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + Number(f.cost || 0), 0);
  const totalExpenseCost = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const vehicleName = (id) => vehicles.find((v) => v.id === Number(id))?.name || '—';

  if (!allowed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md">
          <Alert title="Access restricted">
            Your role ({role}) doesn't have access to Fuel & Expenses. Contact a Financial
            Analyst if you need this data.
          </Alert>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader label="Loading fuel & expense data…" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Fuel & Expenses</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track fuel consumption and operational costs</p>
        </div>
        {editable && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent text-black text-sm font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-[0_0_24px_-6px_var(--color-accent)] shrink-0"
          >
            <span className="text-base leading-none">+</span> {tab === 'fuel' ? 'Add Fuel Log' : 'Add Expense'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-center justify-between">
          {error}
          <button onClick={fetchAll} className="text-xs font-medium underline hover:text-red-300">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Fuel Cost" value={formatCurrency(totalFuelCost, currency)} sub={`${fuelLogs.length} logs`} />
        <StatCard label="Total Expenses" value={formatCurrency(totalExpenseCost, currency)} sub={`${expenses.length} entries`} />
        <StatCard label="Combined Cost" value={formatCurrency(totalFuelCost + totalExpenseCost, currency)} />
        <StatCard label="Vehicles Tracked" value={vehicles.length} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5">
        <TabButton active={tab === 'fuel'} onClick={() => setTab('fuel')}>Fuel Logs</TabButton>
        <TabButton active={tab === 'expenses'} onClick={() => setTab('expenses')}>Expenses</TabButton>
      </div>

      {/* Fuel Logs table */}
      {tab === 'fuel' && (
        <>
          <div className="hidden md:block bg-surface-raised/60 backdrop-blur-sm border border-border-subtle rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  {['Vehicle', 'Liters', 'Cost', 'Date'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fuelLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-panel/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-white">{vehicleName(log.vehicleId)}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{log.liters} L</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{formatCurrency(log.cost, currency)}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{log.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fuelLogs.length === 0 && <div className="text-center py-12 text-sm text-gray-600">No fuel logs yet.</div>}
          </div>

          <div className="md:hidden space-y-3">
            {fuelLogs.map((log) => (
              <div key={log.id} className="bg-surface-raised/60 backdrop-blur-sm border border-border-subtle rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{vehicleName(log.vehicleId)}</span>
                  <span className="text-xs text-gray-500">{log.date}</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>⛽ {log.liters} L</span>
                  <span>{formatCurrency(log.cost, currency)}</span>
                </div>
              </div>
            ))}
            {fuelLogs.length === 0 && <div className="text-center py-12 text-sm text-gray-600">No fuel logs yet.</div>}
          </div>
        </>
      )}

      {/* Expenses table */}
      {tab === 'expenses' && (
        <>
          <div className="hidden md:block bg-surface-raised/60 backdrop-blur-sm border border-border-subtle rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  {['Vehicle', 'Type', 'Amount', 'Date', 'Notes'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-panel/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-white">{vehicleName(exp.vehicleId)}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-surface-panel border border-border-subtle">{exp.type}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{formatCurrency(exp.amount, currency)}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{exp.date}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{exp.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {expenses.length === 0 && <div className="text-center py-12 text-sm text-gray-600">No expenses yet.</div>}
          </div>

          <div className="md:hidden space-y-3">
            {expenses.map((exp) => (
              <div key={exp.id} className="bg-surface-raised/60 backdrop-blur-sm border border-border-subtle rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{vehicleName(exp.vehicleId)}</span>
                  <span className="text-xs text-gray-500">{exp.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-0.5 rounded-full bg-surface-panel border border-border-subtle">{exp.type}</span>
                  <span>{formatCurrency(exp.amount, currency)}</span>
                </div>
                {exp.notes && <p className="text-xs text-gray-600 mt-2">{exp.notes}</p>}
              </div>
            ))}
            {expenses.length === 0 && <div className="text-center py-12 text-sm text-gray-600">No expenses yet.</div>}
          </div>
        </>
      )}

      {showModal && editable && (
        <Modal title={tab === 'fuel' ? 'New Fuel Log' : 'New Expense'} onClose={() => setShowModal(false)}>
          {tab === 'fuel' ? (
            <FuelForm vehicles={vehicles} onSubmit={handleAddFuel} onClose={() => setShowModal(false)} submitting={submitting} />
          ) : (
            <ExpenseForm vehicles={vehicles} onSubmit={handleAddExpense} onClose={() => setShowModal(false)} submitting={submitting} />
          )}
        </Modal>
      )}
    </div>
  );
}
