import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, Percent, Calculator, FileText } from 'lucide-react'

interface Tax {
  id: string
  name: string
  code: string
  rate: number
  type: 'percentage' | 'fixed'
  description: string
  category: string
  effectiveFrom: string
  effectiveTo?: string
  isActive: boolean
  appliesTo: string[]
  exemptions: string[]
}

const TaxMaster: React.FC = () => {
  const [taxes, setTaxes] = useState<Tax[]>([
    {
      id: '1',
      name: 'Goods and Services Tax',
      code: 'GST',
      rate: 18,
      type: 'percentage',
      description: 'Standard GST rate for most goods and services',
      category: 'Federal',
      effectiveFrom: '2017-07-01',
      isActive: true,
      appliesTo: ['Goods', 'Services'],
      exemptions: ['Essential Food Items', 'Healthcare Services']
    },
    {
      id: '2',
      name: 'Central Sales Tax',
      code: 'CST',
      rate: 2,
      type: 'percentage',
      description: 'Tax on inter-state sales of goods',
      category: 'Federal',
      effectiveFrom: '2017-07-01',
      isActive: true,
      appliesTo: ['Inter-state Goods'],
      exemptions: ['Exports', 'Zero-rated Supplies']
    },
    {
      id: '3',
      name: 'Professional Tax',
      code: 'PT',
      rate: 200,
      type: 'fixed',
      description: 'Annual professional tax for employed individuals',
      category: 'State',
      effectiveFrom: '2024-01-01',
      isActive: true,
      appliesTo: ['Salaried Employees', 'Professionals'],
      exemptions: ['Students', 'Senior Citizens']
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingTax, setEditingTax] = useState<Tax | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Omit<Tax, 'id'>>({
    name: '',
    code: '',
    rate: 0,
    type: 'percentage',
    description: '',
    category: '',
    effectiveFrom: '',
    effectiveTo: '',
    isActive: true,
    appliesTo: [],
    exemptions: []
  })

  const categories = ['Federal', 'State', 'Local', 'Municipal']
  const taxTypes = [
    { value: 'percentage', label: 'Percentage (%)', icon: Percent },
    { value: 'fixed', label: 'Fixed Amount (₹)', icon: Calculator }
  ]
  const applicableTo = ['Goods', 'Services', 'Inter-state Goods', 'Salaried Employees', 'Professionals', 'Businesses']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTax) {
      setTaxes(taxes.map(tax => tax.id === editingTax.id ? { ...formData, id: tax.id } : tax))
      setEditingTax(null)
    } else {
      const newTax: Tax = { ...formData, id: Date.now().toString() }
      setTaxes([...taxes, newTax])
    }
    setFormData({
      name: '',
      code: '',
      rate: 0,
      type: 'percentage',
      description: '',
      category: '',
      effectiveFrom: '',
      effectiveTo: '',
      isActive: true,
      appliesTo: [],
      exemptions: []
    })
    setShowForm(false)
  }

  const handleEdit = (tax: Tax) => {
    setEditingTax(tax)
    setFormData({
      name: tax.name,
      code: tax.code,
      rate: tax.rate,
      type: tax.type,
      description: tax.description,
      category: tax.category,
      effectiveFrom: tax.effectiveFrom,
      effectiveTo: tax.effectiveTo || '',
      isActive: tax.isActive,
      appliesTo: tax.appliesTo,
      exemptions: tax.exemptions
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tax?')) {
      setTaxes(taxes.filter(tax => tax.id !== id))
    }
  }

  const addApplicableTo = () => {
    setFormData({ ...formData, appliesTo: [...formData.appliesTo, ''] })
  }

  const removeApplicableTo = (index: number) => {
    setFormData({
      ...formData,
      appliesTo: formData.appliesTo.filter((_, i) => i !== index)
    })
  }

  const updateApplicableTo = (index: number, value: string) => {
    const newApplicableTo = [...formData.appliesTo]
    newApplicableTo[index] = value
    setFormData({ ...formData, appliesTo: newApplicableTo })
  }

  const addExemption = () => {
    setFormData({ ...formData, exemptions: [...formData.exemptions, ''] })
  }

  const removeExemption = (index: number) => {
    setFormData({
      ...formData,
      exemptions: formData.exemptions.filter((_, i) => i !== index)
    })
  }

  const updateExemption = (index: number, value: string) => {
    const newExemptions = [...formData.exemptions]
    newExemptions[index] = value
    setFormData({ ...formData, exemptions: newExemptions })
  }

  const filteredTaxes = taxes.filter(tax =>
    tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTaxTypeIcon = (type: string) => {
    const taxType = taxTypes.find(tt => tt.value === type)
    return taxType ? taxType.icon : Percent
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Federal': return 'bg-blue-100 text-blue-800'
      case 'State': return 'bg-green-100 text-green-800'
      case 'Local': return 'bg-purple-100 text-purple-800'
      case 'Municipal': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Master</h1>
          <p className="text-gray-600">Manage tax rates, rules, and configurations</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tax
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search taxes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Tax Form */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingTax ? 'Edit Tax' : 'Add New Tax'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingTax(null)
                setFormData({
                  name: '',
                  code: '',
                  rate: 0,
                  type: 'percentage',
                  description: '',
                  category: '',
                  effectiveFrom: '',
                  effectiveTo: '',
                  isActive: true,
                  appliesTo: [],
                  exemptions: []
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
                  Tax Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Goods and Services Tax"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="form-input"
                  placeholder="e.g., GST"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                  className="form-input"
                >
                  {taxTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
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
                  Effective From *
                </label>
                <input
                  type="date"
                  required
                  value={formData.effectiveFrom}
                  onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective To
                </label>
                <input
                  type="date"
                  value={formData.effectiveTo}
                  onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
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
                Applies To
              </label>
              <div className="space-y-2">
                {formData.appliesTo.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <select
                      value={item}
                      onChange={(e) => updateApplicableTo(index, e.target.value)}
                      className="form-input flex-1"
                    >
                      <option value="">Select applicable category</option>
                      {applicableTo.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeApplicableTo(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addApplicableTo}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  + Add Applicable Category
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exemptions
              </label>
              <div className="space-y-2">
                {formData.exemptions.map((exemption, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={exemption}
                      onChange={(e) => updateExemption(index, e.target.value)}
                      className="form-input flex-1"
                      placeholder="Enter exemption"
                    />
                    <button
                      type="button"
                      onClick={() => removeExemption(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExemption}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  + Add Exemption
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingTax(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {editingTax ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Taxes List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Taxes List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate & Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective Period
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
              {filteredTaxes.map((tax) => {
                const TypeIcon = getTaxTypeIcon(tax.type)
                return (
                  <tr key={tax.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{tax.name}</div>
                          <div className="text-sm text-gray-500">{tax.code}</div>
                          <div className="text-xs text-gray-400">{tax.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TypeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {tax.type === 'percentage' ? `${tax.rate}%` : `₹${tax.rate}`}
                          </div>
                          <div className="text-xs text-gray-500">{taxTypes.find(tt => tt.value === tax.type)?.label}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(tax.category)}`}>
                        {tax.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">From: {new Date(tax.effectiveFrom).toLocaleDateString()}</div>
                        {tax.effectiveTo && (
                          <div className="text-sm text-gray-500">To: {new Date(tax.effectiveTo).toLocaleDateString()}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tax.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tax.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(tax)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tax.id)}
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

export default TaxMaster 