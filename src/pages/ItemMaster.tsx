import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, Package, Tag, Database } from 'lucide-react'

interface Item {
  id: string
  name: string
  code: string
  description: string
  category: string
  unit: string
  price: number
  cost: number
  supplier: string
  manufacturer: string
  model: string
  specifications: Record<string, string>
  status: 'active' | 'inactive'
  createdDate: string
}

const ItemMaster: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      name: 'Industrial Motor',
      code: 'IM-001',
      description: 'High-performance industrial electric motor',
      category: 'Electronics',
      unit: 'Piece',
      price: 15000,
      cost: 12000,
      supplier: 'MotorTech Industries',
      manufacturer: 'Siemens',
      model: 'SIMOTICS 1LE0',
      specifications: {
        'Power': '5.5 kW',
        'Voltage': '400V',
        'Speed': '1500 RPM',
        'Efficiency': 'IE2'
      },
      status: 'active',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Gear Box Assembly',
      code: 'GB-001',
      description: 'Precision gear box for industrial applications',
      category: 'Mechanical',
      unit: 'Piece',
      price: 8500,
      cost: 6800,
      supplier: 'Gear Solutions Ltd',
      manufacturer: 'Bonfiglioli',
      model: 'R Series',
      specifications: {
        'Ratio': '20:1',
        'Torque': '500 Nm',
        'Input Speed': '1500 RPM',
        'Efficiency': '95%'
      },
      status: 'active',
      createdDate: '2024-01-12'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Omit<Item, 'id' | 'createdDate'>>({
    name: '',
    code: '',
    description: '',
    category: '',
    unit: '',
    price: 0,
    cost: 0,
    supplier: '',
    manufacturer: '',
    model: '',
    specifications: {},
    status: 'active'
  })

  const categories = ['Electronics', 'Mechanical', 'Electrical', 'Hydraulic', 'Pneumatic', 'Tools', 'Consumables']
  const units = ['Piece', 'Kg', 'Meter', 'Liter', 'Box', 'Set', 'Roll']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { ...formData, id: item.id, createdDate: item.createdDate } : item))
      setEditingItem(null)
    } else {
      const newItem: Item = {
        ...formData,
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0]
      }
      setItems([...items, newItem])
    }
    setFormData({
      name: '',
      code: '',
      description: '',
      category: '',
      unit: '',
      price: 0,
      cost: 0,
      supplier: '',
      manufacturer: '',
      model: '',
      specifications: {},
      status: 'active'
    })
    setShowForm(false)
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      code: item.code,
      description: item.description,
      category: item.category,
      unit: item.unit,
      price: item.price,
      cost: item.cost,
      supplier: item.supplier,
      manufacturer: item.manufacturer,
      model: item.model,
      specifications: item.specifications,
      status: item.status
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const addSpecification = () => {
    setFormData({ ...formData, specifications: { ...formData.specifications, '': '' } })
  }

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications }
    delete newSpecs[key]
    setFormData({ ...formData, specifications: newSpecs })
  }

  const updateSpecification = (oldKey: string, newKey: string, value: string) => {
    const newSpecs = { ...formData.specifications }
    if (oldKey !== newKey) {
      delete newSpecs[oldKey]
    }
    newSpecs[newKey] = value
    setFormData({ ...formData, specifications: newSpecs })
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Item Master</h1>
          <p className="text-gray-600">Manage item details with relevant attributes and specifications</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Item Form */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingItem(null)
                setFormData({
                  name: '',
                  code: '',
                  description: '',
                  category: '',
                  unit: '',
                  price: 0,
                  cost: 0,
                  supplier: '',
                  manufacturer: '',
                  model: '',
                  specifications: {},
                  status: 'active'
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
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="form-input"
                  placeholder="e.g., IM-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="form-input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specifications
              </label>
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex space-x-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => updateSpecification(key, e.target.value, value)}
                      className="form-input w-1/3"
                      placeholder="Specification name"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateSpecification(key, key, e.target.value)}
                      className="form-input flex-1"
                      placeholder="Specification value"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecification}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  + Add Specification
                </button>
              </div>
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

      {/* Items List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Items List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pricing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.code}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{item.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">₹{item.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Cost: ₹{item.cost.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{item.supplier}</div>
                      <div className="text-xs text-gray-500">{item.manufacturer} {item.model}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ItemMaster 