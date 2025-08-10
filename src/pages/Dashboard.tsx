import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Package, 
  Receipt, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Truck,
  FileText,
  ClipboardList
} from 'lucide-react'

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Total Customers', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { name: 'Total Parts', value: '5,678', icon: Package, color: 'bg-green-500' },
    { name: 'Active Orders', value: '89', icon: ShoppingCart, color: 'bg-yellow-500' },
    { name: 'Job Cards', value: '156', icon: ClipboardList, color: 'bg-indigo-500' },
    { name: 'Monthly Sale', value: '45,678', icon: DollarSign, color: 'bg-purple-500' },
  ]

  const quickActions = [
    { name: 'Add Customer', href: '/customer-master', icon: Users, color: 'bg-blue-100 text-blue-700' },
    { name: 'Add Part', href: '/part-master', icon: Package, color: 'bg-green-100 text-green-700' },
    { name: 'Create PO', href: '/customer-po-entry', icon: ShoppingCart, color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Create Job Card', href: '/job-card-master', icon: ClipboardList, color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Generate Bill', href: '/account-billing', icon: Receipt, color: 'bg-purple-100 text-purple-700' },
    { name: 'Track Inward', href: '/inward-against-po', icon: Truck, color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Manage Groups', href: '/group-master', icon: FileText, color: 'bg-pink-100 text-pink-700' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your business management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.name}
                to={action.href}
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
              >
                <div className={`flex-shrink-0 p-2 rounded-lg ${action.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">{action.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">New customer "ABC Corp" added</span>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Purchase order #PO-001 created</span>
            </div>
            <span className="text-xs text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Part "Motor Assembly" stock updated</span>
            </div>
            <span className="text-xs text-gray-500">6 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Job Card JC-2024-001 status updated to "In Progress"</span>
            </div>
            <span className="text-xs text-gray-500">8 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 