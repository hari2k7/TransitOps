import { useCallback, useEffect, useState } from 'react'
import {
  FiTruck,
  FiCheckCircle,
  FiNavigation,
  FiTool,
  FiUsers,
  FiUserCheck,
  FiMap,
  FiAlertCircle,
  FiDroplet,
  FiDollarSign,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { formatCurrency } from '../utils/currency.js'
import { getDashboardStats, getRecentTrips } from '../services/dashboardService.js'
import Card from '../components/ui/Card.jsx'
import Select from '../components/ui/Select.jsx'
import Loader from '../components/ui/Loader.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import FleetStatusChart from '../components/dashboard/FleetStatusChart.jsx'
import RecentTrips from '../components/dashboard/RecentTrips.jsx'
import { VEHICLE_TYPES, VEHICLE_STATUSES, REGIONS } from '../utils/constants.js'

const KPI_CARDS = [
  { key: 'totalVehicles', label: 'Total Vehicles', icon: FiTruck, accent: 'accent' },
  { key: 'availableVehicles', label: 'Available Vehicles', icon: FiCheckCircle, accent: 'emerald' },
  { key: 'vehiclesOnTrip', label: 'Vehicles On Trip', icon: FiNavigation, accent: 'sky' },
  { key: 'vehiclesInShop', label: 'Vehicles In Shop', icon: FiTool, accent: 'accent' },
  { key: 'totalDrivers', label: 'Total Drivers', icon: FiUsers, accent: 'violet' },
  { key: 'availableDrivers', label: 'Available Drivers', icon: FiUserCheck, accent: 'emerald' },
  { key: 'activeTrips', label: 'Active Trips', icon: FiMap, accent: 'sky' },
  { key: 'maintenanceActive', label: 'Maintenance Active', icon: FiAlertCircle, accent: 'rose' },
  {
    key: 'fuelCost',
    label: 'Fuel Cost',
    icon: FiDroplet,
    accent: 'accent',
    isCurrency: true,
  },
  {
    key: 'expenseCost',
    label: 'Expense Cost',
    icon: FiDollarSign,
    accent: 'violet',
    isCurrency: true,
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { currency } = useSettings()
  const [filters, setFilters] = useState({
    vehicleType: 'All',
    status: 'All',
    region: 'All',
  })
  const [stats, setStats] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(
    (cancelledRef) => {
      setLoading(true)
      setError(null)

      Promise.all([getDashboardStats(filters), getRecentTrips()])
        .then(([statsData, tripsData]) => {
          if (cancelledRef.current) return
          setStats(statsData)
          setTrips(tripsData)
        })
        .catch((err) => {
          if (cancelledRef.current) return
          // Same failure whether it's the network being down or a real
          // server error — either way, stop spinning and let the user retry.
          setError(err.response?.data?.message || err.message || 'Could not load the dashboard.')
        })
        .finally(() => {
          if (!cancelledRef.current) setLoading(false)
        })
    },
    [filters],
  )

  useEffect(() => {
    const cancelledRef = { current: false }
    fetchData(cancelledRef)
    return () => {
      cancelledRef.current = true
    }
  }, [fetchData])

  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const fleetStatusData = stats
    ? [
        { name: 'Available', value: stats.availableVehicles },
        { name: 'On Trip', value: stats.vehiclesOnTrip },
        { name: 'In Shop', value: stats.vehiclesInShop },
        { name: 'Retired', value: stats.vehiclesRetired },
      ]
    : []

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-100">
        Welcome, {user?.name}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Fleet overview across vehicles, drivers, and trips.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Select
          value={filters.vehicleType}
          onChange={handleFilterChange('vehicleType')}
          className="w-auto min-w-[9rem]"
        >
          {VEHICLE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === 'All' ? 'Vehicle Type: All' : type}
            </option>
          ))}
        </Select>

        <Select
          value={filters.status}
          onChange={handleFilterChange('status')}
          className="w-auto min-w-[9rem]"
        >
          {VEHICLE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status === 'All' ? 'Status: All' : status}
            </option>
          ))}
        </Select>

        <Select
          value={filters.region}
          onChange={handleFilterChange('region')}
          className="w-auto min-w-[9rem]"
        >
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {region === 'All' ? 'Region: All' : region}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <Loader label="Loading dashboard…" />
      ) : error ? (
        <div className="mt-6 max-w-md">
          <Alert title="Couldn't load the dashboard">{error}</Alert>
          <Button
            onClick={() => fetchData({ current: false })}
            className="mt-3"
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {KPI_CARDS.map((card) => (
              <Card
                key={card.key}
                title={card.label}
                value={
                  card.isCurrency
                    ? formatCurrency(stats[card.key], currency)
                    : stats[card.key]
                }
                icon={card.icon}
                accent={card.accent}
              />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <FleetStatusChart data={fleetStatusData} />
            </div>
            <div className="lg:col-span-3">
              <RecentTrips trips={trips} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
