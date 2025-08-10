import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, CheckCircle, Clock, AlertTriangle, FileCheck } from 'lucide-react'

interface Clearance {
  id: string
  name: string
  code: string
  description: string
  type: 'import' | 'export' | 'domestic' | 'customs'
  department: string
  estimatedTime: number
  cost: number
  requirements: string[]
  documents: string[]
  status: 'active' | 'inactive'
  priority: 'low' | 'medium' | 'high'
  createdDate: string
}

const ClearanceMaster: React.FC = () => {
  const [clearances, setClearances] = useState<Clearance[]>([
    {
      id: '1',
      name: 'Import Customs Clearance',
      code: 'IMP-CUST',
      description: 'Standard customs clearance for imported goods',
      type: 'import',
      department: 'Customs',
      estimatedTime: 48,
      cost: 2500,
      requirements: ['Bill of Lading', 'Commercial Invoice', 'Packing List'],
      documents: ['Import License', 'Insurance Certificate'],
      status: 'active',
      priority: 'high',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Export Documentation',
      code: 'EXP-DOC',
      description: 'Documentation process for export shipments',
      type: 'export',
      department: 'Export',
      estimatedTime: 24,
      cost: 1500,
      requirements: ['Export License', 'Commercial Invoice'],
      documents: ['Certificate of Origin', 'Packing List'],
      status: 'active',
      priority: 'medium',
      createdDate: '2024-01-12'
    },
    {
      id: '3',
      name: 'Domestic Transport Clearance',
      code: 'DOM-TRANS',
      description: 'Clearance for domestic transportation permits',
      type: 'domestic',
      department: 'Transport',
      estimatedTime: 12,
      cost: 800,
      requirements: ['Vehicle Registration', 'Driver License'],
      documents: ['Route Permit', 'Insurance'],
      status: 'active',
      priority: 'low',
      createdDate: '2024-01-10'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingClearance, setEditingClearance] = useState<Clearance | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Omit<Clearance, 'id' | 'createdDate'>>({
    name: '',
    code: '',
    description: '',
    type: 'import',
    department: '',
    estimatedTime: 0,
    cost: 0,
    requirements: [],
    documents: [],
    status: 'active',
    priority: 'medium'
  })

  const clearanceTypes = [
    { value: 'import', label: 'Import', icon: CheckCircle },
    { value: 'export', label: 'Export', icon: FileCheck },
    { value: 'domestic', label: 'Domestic', icon: Clock },
    { value: 'customs', label: 'Customs', icon: AlertTriangle }
  ]
  const departments = ['Customs', 'Export', 'Import', 'Transport', 'Logistics', 'Compliance']
  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingClearance) {
      setClearances(clearances.map(c => c.id === editingClearance.id ? { ...formData, id: c.id, createdDate: c.createdDate } : c))
      setEditingClearance(null)
    } else {
      const newClearance: Clearance = {
        ...formData,
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0]
      }
      setClearances([...clearances, newClearance])
    }
    setFormData({
      name: '',
      code: '',
      description: '',
      type: 'import',
      department: '',
      estimatedTime: 0,
      cost: 0,
      requirements: [],
      documents: [],
      status: 'active',
      priority: 'medium'
    })
    setShowForm(false)
  }

  const handleEdit = (clearance: Clearance) => {
    setEditingClearance(clearance)
    setFormData({
      name: clearance.name,
      code: clearance.code,
      description: clearance.description,
      type: clearance.type,
      department: clearance.department,
      estimatedTime: clearance.estimatedTime,
      cost: clearance.cost,
      requirements: clearance.requirements,
      documents: clearance.documents,
      status: clearance.status,
      priority: clearance.priority
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this clearance process?')) {
      setClearances(clearances.filter(c => c.id !== id))
    }
  }

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ''] })
  }

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    })
  }

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData({ ...formData, requirements: newRequirements })
  }

  const addDocument = () => {
    setFormData({ ...formData, documents: [...formData.documents, ''] })
  }

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index)
    })
  }

  const updateDocument = (index: number, value: string) => {
    const newDocuments = [...formData.documents]
    newDocuments[index] = value
    setFormData({ ...formData, documents: newDocuments })
  }

  const filteredClearances = clearances.filter(clearance =>
    clearance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clearance.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clearance.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getClearanceTypeIcon = (type: string) => {
    const clearanceType = clearanceTypes.find(ct => ct.value === type)
    return clearanceType ? clearanceType.icon : CheckCircle
  }

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority)
    return priorityObj ? priorityObj.color : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clearance Master</h1>
          <p className="text-gray-600">Manage clearance processes and documentation requirements</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Clearance Process
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search clearance processes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Clearance Form */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingClearance ? 'Edit Clearance Process' : 'Add New Clearance Process'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingClearance(null)
                setFormData({
                  name: '',
                  code: '',
                  description: '',
                  type: 'import',
                  department: '',
                  estimatedTime: 0,
                  cost: 0,
                  requirements: [],
                  documents: [],
                  status: 'active',
                  priority: 'medium'
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
                  Process Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Import Customs Clearance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Process Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="form-input"
                  placeholder="e.g., IMP-CUST"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clearance Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'import' | 'export' | 'domestic' | 'customs' })}
                  className="form-input"
                >
                  {clearanceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Time (hours) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: Number(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (₹) *
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
                  Priority *
                </label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="form-input"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
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
                Requirements
              </label>
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      className="form-input flex-1"
                      placeholder="Enter requirement"
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  + Add Requirement
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Documents
              </label>
              <div className="space-y-2">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={doc}
                      onChange={(e) => updateDocument(index, e.target.value)}
                      className="form-input flex-1"
                      placeholder="Enter document name"
                    />
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDocument}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  + Add Document
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingClearance(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {editingClearance ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clearances List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Clearance Processes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Process Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time & Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
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
              {filteredClearances.map((clearance) => {
                const TypeIcon = getClearanceTypeIcon(clearance.type)
                return (
                  <tr key={clearance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TypeIcon className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{clearance.name}</div>
                          <div className="text-sm text-gray-500">{clearance.code}</div>
                          <div className="text-xs text-gray-400">{clearance.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-1">
                          {clearanceTypes.find(ct => ct.value === clearance.type)?.label}
                        </span>
                        <div className="text-sm text-gray-900">{clearance.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{clearance.estimatedTime} hours</div>
                        <div className="text-sm text-gray-500">₹{clearance.cost.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(clearance.priority)}`}>
                        {priorities.find(p => p.value === clearance.priority)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        clearance.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {clearance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(clearance)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(clearance.id)}
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

export default ClearanceMaster 