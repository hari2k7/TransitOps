import { useEffect, useState } from 'react'
import { FiTruck, FiTrendingUp, FiTool, FiShield } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { canAccess } from '../utils/permissions.js'
import { formatCurrency } from '../utils/currency.js'
import { getAnalytics } from '../services/analyticsService.js'
import Loader from '../components/ui/Loader.jsx'
import Alert from '../components/ui/Alert.jsx'
import StatCard from '../components/reports/StatCard.jsx'
import UtilizationGauge from '../components/reports/UtilizationGauge.jsx'
import VehicleTypeChart from '../components/reports/VehicleTypeChart.jsx'
import MaintenanceCostChart from '../components/reports/MaintenanceCostChart.jsx'
import DriverSafetyList from '../components/reports/DriverSafetyList.jsx'

export default function Reports() {
  const { role } = useAuth()
  const { currency } = useSettings()
  const allowed = canAccess(role, 'analytics')

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!allowed) return
    getAnalytics().then((result) => {
      setData(result)
      setLoading(false)
    })
  }, [allowed])

  if (!allowed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md">
          <Alert title="Access restricted">
            Your role ({role}) doesn't have access to Reports & Analytics. Contact a Fleet
            Manager or Financial Analyst if you need this data.
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Reports</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fleet performance, safety, and cost insights at a glance.
        </p>
      </div>

      {loading ? (
        <Loader label="Crunching the numbers…" />
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Fleet Value"
              value={formatCurrency(data.totalFleetValue, currency)}
              hint={`${data.totalVehicles} vehicles in the registry`}
              icon={FiTruck}
              accent="accent"
            />
            <StatCard
              label="Fleet Availability"
              value={`${data.availabilityPct}%`}
              hint="Vehicles ready to dispatch right now"
              icon={FiTrendingUp}
              accent="emerald"
            />
            <StatCard
              label="Maintenance Spend"
              value={formatCurrency(data.totalMaintenanceSpend, currency)}
              hint={`${data.openWorkOrders} open work order${data.openWorkOrders === 1 ? '' : 's'}`}
              icon={FiTool}
              accent="rose"
            />
            <StatCard
              label="Avg. Driver Safety Score"
              value={data.avgSafetyScore}
              hint="Out of 100, across all drivers"
              icon={FiShield}
              accent="violet"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <UtilizationGauge pct={data.utilizationPct} />
            <VehicleTypeChart data={data.vehicleTypeBreakdown} />
            <DriverSafetyList drivers={data.driverSafety} />
            <MaintenanceCostChart data={data.maintenanceCostByType} />
          </div>
        </>
      )}
    </div>
  )
}
