import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { canEdit } from '../utils/permissions.js';
import {
  getTrips,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  deleteTrip,
} from '../services/tripService.js';
import { getVehicles } from '../services/vehicleService.js';
import { getDrivers } from '../services/driverService.js';

// ==========================================
// SVG Icons (Fully self-contained & modular)
// ==========================================

const IconSearch = () => (
  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconMapPin = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconTruck = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16v-4a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0016.586 7H13m8 9h-2m-4 0H9" />
  </svg>
);

const IconUser = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconScale = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const IconRoute = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconNotes = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconAlertCircle = () => (
  <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconInbox = () => (
  <svg className="w-16 h-16 text-zinc-600 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-3.586 3.586a2 2 0 01-2.828 0L6 13m12 2a2 2 0 01-2 2H8a2 2 0 01-2-2" />
  </svg>
);

// Stat Card Icons
const StatIconTrips = () => (
  <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const StatIconDraft = () => (
  <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const StatIconDispatched = () => (
  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const StatIconCompleted = () => (
  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const StatIconCancelled = () => (
  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const StatIconDistance = () => (
  <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const StatIconCargo = () => (
  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

// ==========================================
// Sub-components
// ==========================================

export function StatusBadge({ status }) {
  let styles = 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/50';
  if (status === 'Dispatched') styles = 'bg-amber-500/10 text-amber-500 border border-amber-500/30';
  if (status === 'Completed') styles = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
  if (status === 'Cancelled') styles = 'bg-red-500/10 text-red-400 border border-red-500/30';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  let styles = 'text-blue-400 bg-blue-500/10 border border-blue-500/30';
  if (priority === 'Medium') styles = 'text-amber-500 bg-amber-500/10 border border-amber-500/30';
  if (priority === 'High') styles = 'text-red-500 bg-red-500/10 border border-red-500/30';

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1 ${styles}`}>
      {priority}
    </span>
  );
}

export function StatCard({ title, value, subtitle, icon: IconComponent }) {
  return (
    <div className="bg-[#17171b] border border-[#2a2a31] rounded-xl p-4 shadow-lg shadow-black/40 hover:-translate-y-1 hover:border-[#d97706]/35 transition-all duration-300 flex flex-col justify-between group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400 transition-colors">
          {title}
        </span>
        <div className="p-1.5 rounded-lg bg-zinc-800/40 group-hover:bg-zinc-800/80 transition-colors">
          {IconComponent && <IconComponent />}
        </div>
      </div>
      <div>
        <div className="text-xl font-bold text-white tracking-tight group-hover:text-[#d97706] transition-colors">
          {value}
        </div>
        <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-grow max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconSearch />
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Trip ID, Route, Vehicle, Driver..."
        className="w-full bg-[#17171b] text-white pl-10 pr-4 py-2 rounded-lg border border-[#2a2a31] focus:outline-none focus:ring-2 focus:ring-[#d97706]/40 focus:border-[#d97706] transition-all placeholder-zinc-500 text-sm focus-visible:ring-offset-0 focus-visible:ring-2"
        aria-label="Search trips"
      />
    </div>
  );
}

export function FilterBar({ activeFilter, onChange }) {
  const options = ['All', 'Draft', 'Dispatched', 'Completed', 'Cancelled'];

  return (
    <div className="flex overflow-x-auto space-x-1.5 p-1 bg-[#17171b] rounded-xl border border-[#2a2a31] max-w-full scrollbar-none" role="tablist">
      {options.map((opt) => {
        const isActive = activeFilter === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            role="tab"
            aria-selected={isActive}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 relative whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#d97706]/50 ${
              isActive
                ? 'bg-[#d97706] text-white shadow-md shadow-[#d97706]/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function TripActions({ trip, onUpdateStatus, onDeleteRequest, editable }) {
  if (!editable) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {trip.status === 'Draft' && (
        <button
          onClick={() => onUpdateStatus(trip.id, 'Dispatched')}
          type="button"
          className="px-2.5 py-1 text-xs font-medium rounded bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-[#d97706] hover:text-white active:scale-[0.97] transition-all"
        >
          Dispatch
        </button>
      )}
      {trip.status === 'Dispatched' && (
        <button
          onClick={() => onUpdateStatus(trip.id, 'Completed')}
          type="button"
          className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white active:scale-[0.97] transition-all"
        >
          Complete
        </button>
      )}
      {(trip.status === 'Draft' || trip.status === 'Dispatched') && (
        <button
          onClick={() => onUpdateStatus(trip.id, 'Cancelled')}
          type="button"
          className="px-2.5 py-1 text-xs font-medium rounded bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white active:scale-[0.97] transition-all"
        >
          Cancel
        </button>
      )}
      <button
        onClick={() => onDeleteRequest(trip.id)}
        type="button"
        className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
        aria-label={`Delete trip ${trip.id}`}
      >
        <IconTrash />
      </button>
    </div>
  );
}

export function TripTable({ trips, vehicles, drivers, onUpdateStatus, onDeleteRequest, editable }) {
  const getVehicleName = (id) => vehicles.find((v) => String(v.id) === String(id))?.name || id;
  const getDriverName = (id) => drivers.find((d) => String(d.id) === String(id))?.name || id;

  return (
    <div className="overflow-x-auto rounded-xl border border-[#2a2a31] bg-[#17171b] shadow-xl shadow-black/40">
      <table className="w-full border-collapse text-left text-sm text-zinc-300">
        <thead>
          <tr className="bg-[#1c1c21] border-b border-[#2a2a31] sticky top-0 text-zinc-400 font-semibold tracking-wider text-xs">
            <th className="px-6 py-4.5 font-bold uppercase">Trip ID</th>
            <th className="px-6 py-4.5 font-bold uppercase">Route</th>
            <th className="px-6 py-4.5 font-bold uppercase">Vehicle</th>
            <th className="px-6 py-4.5 font-bold uppercase">Driver</th>
            <th className="px-6 py-4.5 font-bold uppercase">Cargo</th>
            <th className="px-6 py-4.5 font-bold uppercase font-sans">Distance</th>
            <th className="px-6 py-4.5 font-bold uppercase">Priority</th>
            <th className="px-6 py-4.5 font-bold uppercase">Expected Delivery</th>
            <th className="px-6 py-4.5 font-bold uppercase">Status</th>
            <th className="px-6 py-4.5 font-bold uppercase">Created At</th>
            <th className="px-6 py-4.5 font-bold uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a31]">
          {trips.map((trip) => (
            <tr
              key={trip.id}
              className="hover:bg-[#1c1c21]/45 odd:bg-[#17171b] even:bg-[#0d0d10]/35 transition-colors group"
            >
              <td className="px-6 py-4 font-mono font-medium text-xs text-zinc-400 group-hover:text-white">
                #{trip.id}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-white">{trip.destination}</span>
                  <span className="text-zinc-500 text-xs mt-0.5">From: {trip.source}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-medium text-zinc-300 group-hover:text-white">
                {getVehicleName(trip.vehicleId)}
              </td>
              <td className="px-6 py-4 font-medium text-zinc-300 group-hover:text-white">
                {getDriverName(trip.driverId)}
              </td>
              <td className="px-6 py-4 text-zinc-300 font-sans">
                {trip.cargo} kg
              </td>
              <td className="px-6 py-4 text-zinc-300 font-sans">
                {trip.distance} km
              </td>
              <td className="px-6 py-4">
                <PriorityBadge priority={trip.priority} />
              </td>
              <td className="px-6 py-4 text-zinc-400 text-xs font-sans">
                {trip.expectedDelivery ? new Date(trip.expectedDelivery).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={trip.status} />
              </td>
              <td className="px-6 py-4 text-zinc-500 text-xs font-sans">
                {trip.createdAt ? new Date(trip.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end">
                  <TripActions
                    trip={trip}
                    onUpdateStatus={onUpdateStatus}
                    onDeleteRequest={onDeleteRequest}
                    editable={editable}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TripCard({ trip, vehicles, drivers, onUpdateStatus, onDeleteRequest, editable }) {
  const vehicleName = vehicles.find((v) => String(v.id) === String(trip.vehicleId))?.name || trip.vehicleId;
  const driverName = drivers.find((d) => String(d.id) === String(trip.driverId))?.name || trip.driverId;

  return (
    <div className="bg-[#17171b] border border-[#2a2a31] rounded-xl p-4.5 shadow-lg shadow-black/30 hover:border-[#d97706]/20 transition-all flex flex-col gap-3.5">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs font-semibold text-zinc-500">
            #{trip.id}
          </span>
          <div className="text-zinc-400 text-xs font-semibold flex items-center gap-1">
            <IconMapPin />
            <span>Route</span>
          </div>
          <div className="text-sm font-bold text-white flex flex-col">
            <span>{trip.destination}</span>
            <span className="text-xs font-normal text-zinc-500">from {trip.source}</span>
          </div>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      <hr className="border-[#2a2a31]" />

      <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
        <div className="flex flex-col gap-0.5">
          <div className="text-zinc-500 flex items-center gap-1 font-medium">
            <IconTruck /> <span>Vehicle</span>
          </div>
          <span className="font-semibold text-zinc-300">{vehicleName}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-zinc-500 flex items-center gap-1 font-medium">
            <IconUser /> <span>Driver</span>
          </div>
          <span className="font-semibold text-zinc-300">{driverName}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-zinc-500 flex items-center gap-1 font-medium">
            <IconScale /> <span>Cargo</span>
          </div>
          <span className="font-semibold text-zinc-300 font-sans">{trip.cargo} kg</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-zinc-500 flex items-center gap-1 font-medium">
            <IconRoute /> <span>Distance</span>
          </div>
          <span className="font-semibold text-zinc-300 font-sans">{trip.distance} km</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-zinc-500 font-medium">Priority</span>
          <div>
            <PriorityBadge priority={trip.priority} />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-zinc-500 flex items-center gap-1 font-medium">
            <IconCalendar /> <span>Delivery</span>
          </div>
          <span className="font-semibold text-zinc-300 font-sans">
            {trip.expectedDelivery ? new Date(trip.expectedDelivery).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      {trip.notes && (
        <>
          <hr className="border-[#2a2a31]" />
          <div className="text-xs">
            <div className="text-zinc-500 flex items-center gap-1 font-medium mb-1">
              <IconNotes /> <span>Notes</span>
            </div>
            <p className="text-zinc-400 bg-[#0d0d10]/40 p-2 rounded border border-[#2a2a31]/50 leading-relaxed italic">
              {trip.notes}
            </p>
          </div>
        </>
      )}

      <hr className="border-[#2a2a31]" />

      <div className="flex justify-end pt-1">
        <TripActions
          trip={trip}
          onUpdateStatus={onUpdateStatus}
          onDeleteRequest={onDeleteRequest}
          editable={editable}
        />
      </div>
    </div>
  );
}

export function NewTripModal({ isOpen, onClose, onSubmit, vehicles, drivers }) {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargo: '',
    distance: '',
    expectedDelivery: '',
    priority: 'Medium',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.source.trim()) newErrors.source = 'Source is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.vehicleId) newErrors.vehicleId = 'Vehicle is required';
    if (!formData.driverId) newErrors.driverId = 'Driver is required';

    const cargoVal = parseFloat(formData.cargo);
    if (isNaN(cargoVal) || cargoVal <= 0) {
      newErrors.cargo = 'Cargo weight must be a positive number';
    } else if (formData.vehicleId) {
      const selectedVehicle = vehicles.find((v) => String(v.id) === String(formData.vehicleId));
      if (selectedVehicle && cargoVal > selectedVehicle.capacity) {
        newErrors.cargo = `Cargo (${cargoVal} kg) exceeds vehicle capacity (${selectedVehicle.capacity} kg)`;
      }
    }

    const distanceVal = parseFloat(formData.distance);
    if (isNaN(distanceVal) || distanceVal <= 0) {
      newErrors.distance = 'Distance must be a positive number';
    }

    if (!formData.expectedDelivery) {
      newErrors.expectedDelivery = 'Expected delivery date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deliveryDate = new Date(formData.expectedDelivery);
      if (deliveryDate < today) {
        newErrors.expectedDelivery = 'Expected delivery date cannot be in the past';
      }
    }

    if (!formData.priority) newErrors.priority = 'Priority is required';
    if (!formData.notes.trim()) newErrors.notes = 'Notes are required';

    // Verify Vehicle availability
    if (formData.vehicleId) {
      const selectedVehicle = vehicles.find((v) => String(v.id) === String(formData.vehicleId));
      if (selectedVehicle && selectedVehicle.status !== 'Available') {
        newErrors.vehicleId = 'Vehicle must be Available';
      }
    }

    // Verify Driver availability, license validity, and suspension status
    if (formData.driverId) {
      const selectedDriver = drivers.find((d) => String(d.id) === String(formData.driverId));
      if (selectedDriver) {
        if (selectedDriver.status === 'Suspended') {
          newErrors.driverId = 'Driver is suspended and cannot be assigned.';
        } else if (
          selectedDriver.licenseExpiry &&
          new Date(selectedDriver.licenseExpiry) < new Date()
        ) {
          newErrors.driverId = 'Driver license has expired.';
        } else if (selectedDriver.status !== 'Available') {
          newErrors.driverId = 'Driver must be Available';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        cargo: parseFloat(formData.cargo),
        distance: parseFloat(formData.distance),
        expectedDelivery: formData.expectedDelivery,
        priority: formData.priority,
        notes: formData.notes.trim()
      };
      await onSubmit(payload);
      // Reset form
      setFormData({
        source: '',
        destination: '',
        vehicleId: '',
        driverId: '',
        cargo: '',
        distance: '',
        expectedDelivery: '',
        priority: 'Medium',
        notes: ''
      });
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, api: err.message || 'Failed to submit' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-[#1c1c21] border border-[#2a2a31] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-black/80 animate-scaleIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-[#2a2a31]">
          <h2 id="modal-title" className="text-lg font-bold text-white tracking-wide">
            Create New Trip
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/60 active:scale-95 transition-all"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4.5 flex-grow">
          {errors.api && (
            <div className="p-3.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              {errors.api}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
            {/* Source */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="source" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Source
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={`w-full bg-[#17171b] text-white px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.source
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-[#2a2a31] focus:ring-[#d97706]/40 focus:border-[#d97706]'
                }`}
                placeholder="Departure location"
              />
              {errors.source && <span className="text-red-400 text-[11px] font-medium">{errors.source}</span>}
            </div>

            {/* Destination */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="destination" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className={`w-full bg-[#17171b] text-white px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.destination
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-[#2a2a31] focus:ring-[#d97706]/40 focus:border-[#d97706]'
                }`}
                placeholder="Arrival location"
              />
              {errors.destination && <span className="text-red-400 text-[11px] font-medium">{errors.destination}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
            {/* Vehicle Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vehicleId" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Vehicle
              </label>
              <select
                id="vehicleId"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                className={`w-full bg-[#17171b] text-white px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.vehicleId
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-[#2a2a31] focus:ring-[#d97706]/40 focus:border-[#d97706]'
                }`}
              >
                <option value="">Select a Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.capacity} kg) - {v.status}
                  </option>
                ))}
              </select>
              {errors.vehicleId && <span className="text-red-400 text-[11px] font-medium">{errors.vehicleId}</span>}
            </div>

            {/* Driver Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="driverId" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Driver
              </label>
              <select
                id="driverId"
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                className={`w-full bg-[#17171b] text-white px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.driverId
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-[#2a2a31] focus:ring-[#d97706]/40 focus:border-[#d97706]'
                }`}
              >
                <option value="">Select a Driver</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} - {d.status}
                  </option>
                ))}
              </select>
              {errors.driverId && <span className="text-red-400 text-[11px] font-medium">{errors.driverId}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
            {/* Cargo Weight */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cargo" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Cargo Weight (kg)
              </label>
              <input
                type="number"
                step="any"
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                className={`w-full bg-[#17171b] text-white px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 font-sans transition-all ${
                  errors.cargo
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-[#2a2a31] focus:ring-[#d97706]/40 focus:border-[#d97706]'
                }`}
                placeholder="e.g. 1500"
              />
              {errors.cargo && <span className="text-red-400 text-[11px] font-medium">{errors.cargo}</span>}
            </div>

            {/* Distance */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="distance" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Distance (km)
              </label>
              <input
                type="number"
                step="any"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                className={`w-full bg-[#17171b] text-white px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 font-sans transition-all ${
                  errors.distance
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-[#2a2a31] focus:ring-[#d97706]/40 focus:border-[#d97706]'
                }`}
                placeholder="e.g. 320"
              />
              {errors.distance && <span className="text-red-400 text-[11px] font-medium">{errors.distance}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
            {/* Expected Delivery Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="expectedDelivery" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Expected Delivery Date
              </label>
              <input
                type="date"
                id="expectedDelivery"
                name="expectedDelivery"
                value={formData.expectedDelivery}
                onChange={handleChange}
                className={`w-full bg-[#17171b] text-white px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 font-sans transition-all ${
                  errors.expectedDelivery
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-[#2a2a31] focus:ring-[#d97706]/40 focus:border-[#d97706]'
                }`}
              />
              {errors.expectedDelivery && (
                <span className="text-red-400 text-[11px] font-medium">{errors.expectedDelivery}</span>
              )}
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="priority" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full bg-[#17171b] text-white px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.priority
                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-[#2a2a31] focus:ring-[#d97706]/40 focus:border-[#d97706]'
                }`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && <span className="text-red-400 text-[11px] font-medium">{errors.priority}</span>}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className={`w-full bg-[#17171b] text-white px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.notes
                  ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
                  : 'border-[#2a2a31] focus:ring-[#d97706]/40 focus:border-[#d97706]'
              }`}
              placeholder="Provide special instructions, details, etc."
            />
            {errors.notes && <span className="text-red-400 text-[11px] font-medium">{errors.notes}</span>}
          </div>

          {/* Footer Action buttons */}
          <div className="flex justify-end gap-3 pt-3.5 border-t border-[#2a2a31] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/60 active:scale-95 transition-all border border-transparent hover:border-[#2a2a31]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#d97706] hover:bg-[#b45309] disabled:opacity-50 active:scale-95 shadow-lg shadow-[#d97706]/20 transition-all flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Create Trip'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-[#1c1c21] border border-[#2a2a31] rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black animate-scaleIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <h3 id="confirm-title" className="text-base font-bold text-white mb-2">
          {title}
        </h3>
        <p className="text-zinc-400 text-xs leading-relaxed mb-6">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/60 active:scale-95 transition-all border border-transparent hover:border-[#2a2a31]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4.5 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 shadow-lg shadow-red-600/20 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-[#17171b] border border-[#2a2a31] rounded-xl p-4 h-[92px] animate-pulse flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-2.5 bg-zinc-700/60 rounded w-16" />
              <div className="w-6 h-6 rounded-lg bg-zinc-700/40" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 bg-zinc-700/80 rounded w-10" />
              <div className="h-2 bg-zinc-700/40 rounded w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Skeleton */}
      <div className="bg-[#17171b] rounded-xl border border-[#2a2a31] overflow-hidden">
        <div className="p-4 bg-[#1c1c21] border-b border-[#2a2a31] flex justify-between items-center gap-4 flex-wrap animate-pulse">
          <div className="h-8 bg-zinc-700/60 rounded w-60" />
          <div className="h-8 bg-zinc-700/60 rounded w-72" />
        </div>
        <div className="p-6 space-y-5 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-3 bg-zinc-700/80 rounded w-1/12" />
              <div className="h-3 bg-zinc-700/40 rounded w-3/12" />
              <div className="h-3 bg-zinc-700/40 rounded w-2/12" />
              <div className="h-3 bg-zinc-700/40 rounded w-1/12" />
              <div className="h-3 bg-zinc-700/40 rounded w-1/12" />
              <div className="h-3 bg-zinc-700/80 rounded w-2/12" />
              <div className="h-3 bg-zinc-700/40 rounded w-2/12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#17171b] border border-[#2a2a31] rounded-2xl max-w-md mx-auto my-12 text-center shadow-2xl shadow-black/35 animate-fadeIn">
      <IconAlertCircle />
      <h3 className="text-base font-bold text-white mb-2">Data Fetching Failed</h3>
      <p className="text-zinc-400 text-xs leading-relaxed mb-6">
        {message || 'An error occurred while communicating with the fleet service.'}
      </p>
      <button
        onClick={onRetry}
        type="button"
        className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-[#d97706] hover:bg-[#b45309] active:scale-95 shadow-lg shadow-[#d97706]/20 transition-all"
      >
        Retry Connection
      </button>
    </div>
  );
}

export function EmptyState({ onCreateTripClick }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[#17171b] border border-[#2a2a31] rounded-2xl text-center shadow-xl shadow-black/20 my-10 animate-fadeIn">
      <div className="p-3 bg-zinc-800/40 rounded-full mb-3">
        <IconInbox />
      </div>
      <h3 className="text-base font-bold text-white mb-2">No trips found</h3>
      <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mb-6">
        It looks like there are no fleet trips recorded in the database. Create one to get started tracking status.
      </p>
      <button
        onClick={onCreateTripClick}
        type="button"
        className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-[#d97706] hover:bg-[#b45309] active:scale-95 shadow-lg shadow-[#d97706]/20 transition-all flex items-center"
      >
        <IconPlus /> Create your first trip
      </button>
    </div>
  );
}

// ==========================================
// Main Components
// ==========================================

export default function Trips() {
  const { role } = useAuth();
  const editable = canEdit(role, 'trips');

  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Custom dialog confirmations
  const [deletingId, setDeletingId] = useState(null);

  // NOTE: previously this hit fetch('http://localhost:3000/...') directly —
  // wrong port (backend is on 5000), missing the /api prefix, and no
  // fallback while the real trip/vehicle/driver endpoints are still stubs.
  // Swapped for the dummy-data services (same pattern as Dashboard/Vehicles)
  // so this page actually renders today; each service has a commented-out
  // real Axios call ready to swap in once the backend's live.
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        getTrips(),
        getVehicles(),
        getDrivers(),
      ]);

      setTrips(tripsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
    } catch (err) {
      setError(err.message || 'An unexpected networking failure occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Trip Creation Handler — createTrip() enforces the mandatory business
  // rules (vehicle/driver availability, license expiry, cargo vs capacity)
  // and throws with a message NewTripModal already displays via errors.api.
  const handleCreateTrip = useCallback(async (payload) => {
    await createTrip(payload);
    // Refresh so the newly created Draft trip shows up
    fetchData();
  }, [fetchData]);

  // Update Status Handler — routes to the matching lifecycle function so
  // vehicle/driver status cascades correctly (Dispatch/Complete/Cancel all
  // flip vehicle+driver status per the spec's Mandatory Business Rules).
  const handleUpdateStatus = useCallback(async (id, newStatus) => {
    try {
      if (newStatus === 'Dispatched') await dispatchTrip(id);
      else if (newStatus === 'Completed') await completeTrip(id);
      else if (newStatus === 'Cancelled') await cancelTrip(id);

      // Re-fetch vehicles/drivers too, since their status may have changed
      fetchData();
    } catch (err) {
      alert(err.message || 'Unable to update status.');
    }
  }, [fetchData]);

  // Delete Action Handler
  const handleDeleteTrip = useCallback(async () => {
    if (!deletingId) return;

    try {
      await deleteTrip(deletingId);
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      alert(err.message || 'Unable to delete trip.');
    }
  }, [deletingId]);

  // Statistics Calculations using trips raw array
  const statistics = useMemo(() => {
    const stats = {
      total: trips.length,
      draft: trips.filter((t) => t.status === 'Draft').length,
      dispatched: trips.filter((t) => t.status === 'Dispatched').length,
      completed: trips.filter((t) => t.status === 'Completed').length,
      cancelled: trips.filter((t) => t.status === 'Cancelled').length,
      averageDistance: 0,
      totalCargo: 0,
    };

    let totalDist = 0;
    trips.forEach((t) => {
      totalDist += Number(t.distance) || 0;
      stats.totalCargo += Number(t.cargo) || 0;
    });

    stats.averageDistance = stats.total > 0 ? (totalDist / stats.total).toFixed(1) : '0';
    return stats;
  }, [trips]);

  // Search & Filter Memoization
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // 1. Status Filter
      if (filter !== 'All' && trip.status !== filter) {
        return false;
      }

      // 2. Search Filter
      if (search.trim() !== '') {
        const query = search.toLowerCase();
        const vehicleObj = vehicles.find((v) => v.id === trip.vehicleId);
        const vehicleName = vehicleObj ? vehicleObj.name.toLowerCase() : '';
        const driverObj = drivers.find((d) => d.id === trip.driverId);
        const driverName = driverObj ? driverObj.name.toLowerCase() : '';

        const matchId = String(trip.id).toLowerCase().includes(query);
        const matchSource = trip.source?.toLowerCase().includes(query);
        const matchDestination = trip.destination?.toLowerCase().includes(query);
        const matchVehicle = vehicleName.includes(query);
        const matchDriver = driverName.includes(query);

        return matchId || matchSource || matchDestination || matchVehicle || matchDriver;
      }

      return true;
    });
  }, [trips, filter, search, vehicles, drivers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d10] p-6 lg:p-8 flex flex-col justify-start">
        <div className="max-w-[1600px] w-full mx-auto space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#2a2a31] pb-6">
            <div>
              <div className="h-6 bg-zinc-700/60 rounded w-48 mb-2 animate-pulse" />
              <div className="h-3 bg-zinc-700/40 rounded w-64 animate-pulse" />
            </div>
            <div className="h-10 bg-zinc-700/60 rounded-lg w-40 animate-pulse" />
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d10] p-6 flex items-center justify-center">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d10] text-white p-6 lg:p-8 font-sans">
      <div className="max-w-[1600px] w-full mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex justify-between items-center flex-wrap gap-4 border-b border-[#2a2a31] pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Fleet Operations Panel
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Manage, dispatch, and track active cargo shipments in real-time.
            </p>
          </div>
          {editable && (
            <button
              onClick={() => setShowModal(true)}
              type="button"
              className="inline-flex items-center px-4.5 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 shadow-lg shadow-[#d97706]/15 hover:shadow-[#d97706]/25 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#d97706]/40"
            >
              <IconPlus /> Create Trip
            </button>
          )}
        </header>

        {/* Statistics Grid */}
        <section aria-label="Key Performance Indicators">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            <StatCard
              title="Total Trips"
              value={statistics.total}
              subtitle="All registered records"
              icon={StatIconTrips}
            />
            <StatCard
              title="Draft Trips"
              value={statistics.draft}
              subtitle="Pending dispatch configuration"
              icon={StatIconDraft}
            />
            <StatCard
              title="Dispatched"
              value={statistics.dispatched}
              subtitle="En route to destination"
              icon={StatIconDispatched}
            />
            <StatCard
              title="Completed"
              value={statistics.completed}
              subtitle="Successfully delivered cargo"
              icon={StatIconCompleted}
            />
            <StatCard
              title="Cancelled"
              value={statistics.cancelled}
              subtitle="Aborted shipments"
              icon={StatIconCancelled}
            />
            <StatCard
              title="Avg Distance"
              value={`${statistics.averageDistance} km`}
              subtitle="Average route spacing"
              icon={StatIconDistance}
            />
            <StatCard
              title="Total Cargo"
              value={`${statistics.totalCargo.toLocaleString()} kg`}
              subtitle="Accumulated loaded weight"
              icon={StatIconCargo}
            />
          </div>
        </section>

        {/* Actions bar (Search and Filter Pills) */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-1">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar activeFilter={filter} onChange={setFilter} />
        </div>

        {/* Trips List/Table Area */}
        <main>
          {filteredTrips.length === 0 ? (
            editable ? (
              <EmptyState onCreateTripClick={() => setShowModal(true)} />
            ) : (
              <p className="text-center text-zinc-500 text-sm py-12">No trips found.</p>
            )
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <TripTable
                  trips={filteredTrips}
                  vehicles={vehicles}
                  drivers={drivers}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteRequest={setDeletingId}
                  editable={editable}
                />
              </div>

              {/* Mobile/Tablet Card Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4.5">
                {filteredTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    vehicles={vehicles}
                    drivers={drivers}
                    onUpdateStatus={handleUpdateStatus}
                    onDeleteRequest={setDeletingId}
                    editable={editable}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Creation Modal overlay */}
      <NewTripModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateTrip}
        vehicles={vehicles}
        drivers={drivers}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteTrip}
        title="Confirm Trip Deletion"
        message={`Are you sure you want to delete Trip #${deletingId}? This action is permanent and will remove the cargo shipment from database tables immediately.`}
      />

      {/* Custom Global Animation Utilities in CSS Style Block */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        /* Custom scrollbar hides */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>   
  );
}
