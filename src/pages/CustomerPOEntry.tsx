import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, FileText, User, Calendar, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface PurchaseOrder {
  id: string
  poNumber: string
  customerName: string
  customerCode: string
  poDate: string
  deliveryDate: string
  subtotal: number
  taxAmount: number
  discount: number
  totalAmount: number
  status: 'draft' | 'confirmed' | 'in_production' | 'ready' | 'delivered' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  paymentTerms: string
  deliveryAddress: string
  notes: string
  items: POItem[]
  createdBy: string
  createdAt: string
}

interface POItem {
  id: string
  itemName: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
  specifications: string
}

const CustomerPOEntry: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      poNumber: 'PO-2024-001',
      customerName: 'ABC Manufacturing Ltd',
      customerCode: 'CUST-001',
      poDate: '2024-01-15',
      deliveryDate: '2024-02-15',
      subtotal: 75000,
      taxAmount: 13500,
      discount: 3000,
      totalAmount: 85500,
      status: 'confirmed',
      priority: 'high',
      paymentTerms: 'Net 30',
      deliveryAddress: '123 Industrial Zone, Mumbai, Maharashtra 400001',
      notes: 'Urgent delivery required for production line',
      items: [
        {
          id: '1',
          itemName: 'Industrial Motor',
          description: 'High-performance industrial electric motor',
          quantity: 3,
          unit: 'Piece',
          unitPrice: 15000,
          total: 45000,
          specifications: '5.5 kW, 400V, 1500 RPM'
        }
      ],
      createdBy: 'John Doe',
      createdAt: '2024-01-15'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Omit<PurchaseOrder, 'id' | 'createdAt' | 'createdBy'>>({
    poNumber: '',
    customerName: '',
    customerCode: '',
    poDate: '',
    deliveryDate: '',
    subtotal: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 0,
    status: 'draft',
    priority: 'medium',
    paymentTerms: '',
    deliveryAddress: '',
    notes: '',
    items: []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPO) {
      setPurchaseOrders(purchaseOrders.map(po => po.id === editingPO.id ? { ...formData, id: po.id, createdAt: po.createdAt, createdBy: po.createdBy } : po))
      setEditingPO(null)
    } else {
      const newPO: PurchaseOrder = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'Current User'
      }
      setPurchaseOrders([...purchaseOrders, newPO])
    }
    setFormData({
      poNumber: '',
      customerName: '',
      customerCode: '',
      poDate: '',
      deliveryDate: '',
      subtotal: 0,
      taxAmount: 0,
      discount: 0,
      totalAmount: 0,
      status: 'draft',
      priority: 'medium',
      paymentTerms: '',
      deliveryAddress: '',
      notes: '',
      items: []
    })
    setShowForm(false)
  }

  const handleEdit = (po: PurchaseOrder) => {
    setEditingPO(po)
    setFormData({
      poNumber: po.poNumber,
      customerName: po.customerName,
      customerCode: po.customerCode,
      poDate: po.poDate,
      deliveryDate: po.deliveryDate,
      subtotal: po.subtotal,
      taxAmount: po.taxAmount,
      discount: po.discount,
      totalAmount: po.totalAmount,
      status: po.status,
      priority: po.priority,
      paymentTerms: po.paymentTerms,
      deliveryAddress: po.deliveryAddress,
      notes: po.notes,
      items: po.items
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      setPurchaseOrders(purchaseOrders.filter(po => po.id !== id))
    }
  }

  const filteredPOs = purchaseOrders.filter(po =>
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.customerCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer PO Entry</h1>
          <p className="text-gray-600">Enter and track purchase orders from customers</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create PO
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search POs by number, customer, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* PO Form */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingPO ? 'Edit Purchase Order' : 'Create New Purchase Order'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingPO(null)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.poNumber}
                  onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                  className="form-input"
                  placeholder="e.g., PO-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerCode}
                  onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                  className="form-input"
                  placeholder="e.g., CUST-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.poDate}
                  onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms *
                </label>
                <input
                  type="text"
                  required
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Net 30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                  className="form-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'confirmed' | 'in_production' | 'ready' | 'delivered' | 'cancelled' })}
                  className="form-input"
                >
                  <option value="draft">Draft</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_production">In Production</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                rows={2}
                className="form-input"
                placeholder="Enter complete delivery address..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="form-input"
                placeholder="Additional notes, special requirements, or terms..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingPO(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {editingPO ? 'Update' : 'Create'} PO
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Purchase Orders List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Purchase Orders List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PO Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amounts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPOs.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{po.poNumber}</div>
                        <div className="text-sm text-gray-500">{po.paymentTerms}</div>
                        <div className="text-xs text-gray-400">By: {po.createdBy}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{po.customerName}</div>
                      <div className="text-sm text-gray-500">{po.customerCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">PO: {new Date(po.poDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">Delivery: {new Date(po.deliveryDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">₹{po.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Sub: ₹{po.subtotal.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Tax: ₹{po.taxAmount.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        po.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        po.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        po.status === 'in_production' ? 'bg-yellow-100 text-yellow-800' :
                        po.status === 'ready' ? 'bg-purple-100 text-purple-800' :
                        po.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {po.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        po.priority === 'low' ? 'bg-green-100 text-green-800' :
                        po.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        po.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {po.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(po)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(po.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomerPOEntry 