import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, Package } from 'lucide-react'

interface Part {
  id: string
  partNumber: string
  name: string
  description: string
  category: string
  unit: string
  price: number
  stock: number
  minStock: number
  maxStock: number
  supplier: string
  status: 'active' | 'inactive'
}

const PartMaster: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([
    {
      id: '1',
      partNumber: 'P001',
      name: 'Motor Assembly',
      description: 'Complete motor assembly with housing',
      category: 'Electronics',
      unit: 'Piece',
      price: 2500,
      stock: 45,
      minStock: 10,
      maxStock: 100,
      supplier: 'ABC Motors',
      status: 'active'
    },
    {
      id: '2',
      partNumber: 'P002',
      name: 'Gear Box',
      description: 'Industrial gear box assembly',
      category: 'Mechanical',
      unit: 'Piece',
      price: 1800,
      stock: 23,
      minStock: 5,
      maxStock: 50,
      supplier: 'XYZ Gears',
      status: 'active'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingPart, setEditingPart] = useState<Part | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Omit<Part, 'id'>>({
    partNumber: '',
    name: '',
    description: '',
    category: '',
    unit: '',
    price: 0,
    stock: 0,
    minStock: 0,
    maxStock: 0,
    supplier: '',
    status: 'active'
  })

  const categories = ['Electronics', 'Mechanical', 'Electrical', 'Hydraulic', 'Pneumatic', 'Other']
  const units = ['Piece', 'Kg', 'Meter', 'Liter', 'Set', 'Box']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPart) {
      setParts(parts.map(p => p.id === editingPart.id ? { ...formData, id: p.id } : p))
      setEditingPart(null)
    } else {
      const newPart = { ...formData, id: Date.now().toString() }
      setParts([...parts, newPart])
    }
    setFormData({
      partNumber: '',
      name: '',
      description: '',
      category: '',
      unit: '',
      price: 0,
      stock: 0,
      minStock: 0,
      maxStock: 0,
      supplier: '',
      status: 'active'
    })
    setShowForm(false)
  }

  const handleEdit = (part: Part) => {
    setEditingPart(part)
    setFormData({
      partNumber: part.partNumber,
      name: part.name,
      description: part.description,
      category: part.category,
      unit: part.unit,
      price: part.price,
      stock: part.stock,
      minStock: part.minStock,
      maxStock: part.maxStock,
      supplier: part.supplier,
      status: part.status
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      setParts(parts.filter(p => p.id !== id))
    }
  }

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) return 'bg-red-100 text-red-800'
    if (stock <= minStock * 1.5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Part Master</h1>
          <p className="text-gray-600">Manage parts inventory and specifications</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Part
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Part Form */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingPart ? 'Edit Part' : 'Add New Part'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingPart(null)
                setFormData({
                  partNumber: '',
                  name: '',
                  description: '',
                  category: '',
                  unit: '',
                  price: 0,
                  stock: 0,
                  minStock: 0,
                  maxStock: 0,
                  supplier: '',
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
                  Part Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.partNumber}
                  onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Name *
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
                  Price *
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
                  Current Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({ ...formData, maxStock: Number(e.target.value) })}
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
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingPart(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {editingPart ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Parts List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Parts Inventory</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
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
              {filteredParts.map((part) => (
                <tr key={part.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{part.name}</div>
                        <div className="text-sm text-gray-500">{part.partNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {part.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{part.stock} {part.unit}</div>
                      <div className="text-xs text-gray-500">Min: {part.minStock}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{part.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {part.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      part.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {part.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(part)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(part.id)}
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

export default PartMaster 