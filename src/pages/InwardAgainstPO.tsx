import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, Package, FileText, Truck, CheckCircle, AlertCircle } from 'lucide-react'

interface InwardItem {
  id: string
  poNumber: string
  poDate: string
  supplierName: string
  itemName: string
  itemCode: string
  quantity: number
  receivedQuantity: number
  unit: string
  unitPrice: number
  totalAmount: number
  receivedDate: string
  receivedBy: string
  quality: 'good' | 'damaged' | 'partial'
  notes: string
  status: 'pending' | 'received' | 'verified' | 'completed'
}

const InwardAgainstPO: React.FC = () => {
  const [inwardItems, setInwardItems] = useState<InwardItem[]>([
    {
      id: '1',
      poNumber: 'PO-2024-001',
      poDate: '2024-01-10',
      supplierName: 'MotorTech Industries',
      itemName: 'Industrial Motor',
      itemCode: 'IM-001',
      quantity: 10,
      receivedQuantity: 8,
      unit: 'Piece',
      unitPrice: 15000,
      totalAmount: 150000,
      receivedDate: '2024-01-15',
      receivedBy: 'John Doe',
      quality: 'good',
      notes: '2 units pending due to shipping delay',
      status: 'partial'
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      poDate: '2024-01-12',
      supplierName: 'Gear Solutions Ltd',
      itemName: 'Gear Box Assembly',
      itemCode: 'GB-001',
      quantity: 5,
      receivedQuantity: 5,
      unit: 'Piece',
      unitPrice: 8500,
      totalAmount: 42500,
      receivedDate: '2024-01-18',
      receivedBy: 'Jane Smith',
      quality: 'good',
      notes: 'All items received in good condition',
      status: 'completed'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<InwardItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Omit<InwardItem, 'id' | 'totalAmount'>>({
    poNumber: '',
    poDate: '',
    supplierName: '',
    itemName: '',
    itemCode: '',
    quantity: 0,
    receivedQuantity: 0,
    unit: '',
    unitPrice: 0,
    receivedDate: '',
    receivedBy: '',
    quality: 'good',
    notes: '',
    status: 'pending'
  })

  const units = ['Piece', 'Kg', 'Meter', 'Liter', 'Box', 'Set', 'Roll']
  const qualityOptions = [
    { value: 'good', label: 'Good', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'damaged', label: 'Damaged', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
    { value: 'partial', label: 'Partial', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800' }
  ]
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'received', label: 'Received', color: 'bg-blue-100 text-blue-800' },
    { value: 'verified', label: 'Verified', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalAmount = formData.quantity * formData.unitPrice
    
    if (editingItem) {
      setInwardItems(inwardItems.map(item => 
        item.id === editingItem.id 
          ? { ...formData, id: item.id, totalAmount } 
          : item
      ))
      setEditingItem(null)
    } else {
      const newItem: InwardItem = {
        ...formData,
        id: Date.now().toString(),
        totalAmount
      }
      setInwardItems([...inwardItems, newItem])
    }
    setFormData({
      poNumber: '',
      poDate: '',
      supplierName: '',
      itemName: '',
      itemCode: '',
      quantity: 0,
      receivedQuantity: 0,
      unit: '',
      unitPrice: 0,
      receivedDate: '',
      receivedBy: '',
      quality: 'good',
      notes: '',
      status: 'pending'
    })
    setShowForm(false)
  }

  const handleEdit = (item: InwardItem) => {
    setEditingItem(item)
    setFormData({
      poNumber: item.poNumber,
      poDate: item.poDate,
      supplierName: item.supplierName,
      itemName: item.itemName,
      itemCode: item.itemCode,
      quantity: item.quantity,
      receivedQuantity: item.receivedQuantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      receivedDate: item.receivedDate,
      receivedBy: item.receivedBy,
      quality: item.quality,
      notes: item.notes,
      status: item.status
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this inward item?')) {
      setInwardItems(inwardItems.filter(item => item.id !== id))
    }
  }

  const filteredItems = inwardItems.filter(item =>
    item.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getQualityIcon = (quality: string) => {
    const qualityOption = qualityOptions.find(q => q.value === quality)
    return qualityOption ? qualityOption.icon : CheckCircle
  }

  const getQualityColor = (quality: string) => {
    const qualityOption = qualityOptions.find(q => q.value === quality)
    return qualityOption ? qualityOption.color : 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    return statusOption ? statusOption.label : status
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inward Against PO</h1>
          <p className="text-gray-600">Record and track inward goods received against purchase orders</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Inward Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by PO number, supplier, or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Inward Form */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingItem ? 'Edit Inward Item' : 'Add New Inward Item'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingItem(null)
                setFormData({
                  poNumber: '',
                  poDate: '',
                  supplierName: '',
                  itemName: '',
                  itemCode: '',
                  quantity: 0,
                  receivedQuantity: 0,
                  unit: '',
                  unitPrice: 0,
                  receivedDate: '',
                  receivedBy: '',
                  quality: 'good',
                  notes: '',
                  status: 'pending'
                })
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
                  Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.itemCode}
                  onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Unit</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordered Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max={formData.quantity}
                  value={formData.receivedQuantity}
                  onChange={(e) => setFormData({ ...formData, receivedQuantity: Number(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.receivedDate}
                  onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received By *
                </label>
                <input
                  type="text"
                  required
                  value={formData.receivedBy}
                  onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality *
                </label>
                <select
                  required
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value as 'good' | 'damaged' | 'partial' })}
                  className="form-input"
                >
                  {qualityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'received' | 'verified' | 'completed' })}
                  className="form-input"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
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
                placeholder="Additional notes or comments..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingItem(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {editingItem ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inward Items List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Inward Items List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PO & Item Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity & Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const QualityIcon = getQualityIcon(item.quality)
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.poNumber}</div>
                          <div className="text-sm text-gray-500">{item.itemName}</div>
                          <div className="text-xs text-gray-400">{item.itemCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{item.supplierName}</div>
                        <div className="text-xs text-gray-500">PO: {new Date(item.poDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {item.receivedQuantity}/{item.quantity} {item.unit}
                        </div>
                        <div className="text-sm text-gray-500">₹{item.unitPrice.toLocaleString()}/unit</div>
                        <div className="text-xs text-gray-400">Total: ₹{item.totalAmount.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{new Date(item.receivedDate).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">By: {item.receivedBy}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualityColor(item.quality)}`}>
                          <QualityIcon className="h-3 w-3 mr-1" />
                          {qualityOptions.find(q => q.value === item.quality)?.label}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default InwardAgainstPO 