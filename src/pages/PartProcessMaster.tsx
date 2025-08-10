import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, Settings, ArrowRight } from 'lucide-react'

interface Process {
  id: string
  name: string
  description: string
  partId: string
  partName: string
  sequence: number
  department: string
  estimatedTime: number
  cost: number
  status: 'active' | 'inactive'
  requirements: string[]
}

const PartProcessMaster: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([
    {
      id: '1',
      name: 'Assembly',
      description: 'Final assembly of motor components',
      partId: 'P001',
      partName: 'Motor Assembly',
      sequence: 1,
      department: 'Assembly',
      estimatedTime: 120,
      cost: 500,
      status: 'active',
      requirements: ['Motor Housing', 'Rotor', 'Stator', 'Bearings']
    },
    {
      id: '2',
      name: 'Testing',
      description: 'Quality testing and validation',
      partId: 'P001',
      partName: 'Motor Assembly',
      sequence: 2,
      department: 'Quality',
      estimatedTime: 60,
      cost: 200,
      status: 'active',
      requirements: ['Test Equipment', 'Power Supply']
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingProcess, setEditingProcess] = useState<Process | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Omit<Process, 'id'>>({
    name: '',
    description: '',
    partId: '',
    partName: '',
    sequence: 1,
    department: '',
    estimatedTime: 0,
    cost: 0,
    status: 'active',
    requirements: []
  })

  const departments = ['Assembly', 'Quality', 'Production', 'Testing', 'Packaging', 'Maintenance']
  const parts = ['P001 - Motor Assembly', 'P002 - Gear Box']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProcess) {
      setProcesses(processes.map(p => p.id === editingProcess.id ? { ...formData, id: p.id } : p))
      setEditingProcess(null)
    } else {
      const newProcess = { ...formData, id: Date.now().toString() }
      setProcesses([...processes, newProcess])
    }
    setFormData({
      name: '',
      description: '',
      partId: '',
      partName: '',
      sequence: 1,
      department: '',
      estimatedTime: 0,
      cost: 0,
      status: 'active',
      requirements: []
    })
    setShowForm(false)
  }

  const handleEdit = (process: Process) => {
    setEditingProcess(process)
    setFormData({
      name: process.name,
      description: process.description,
      partId: process.partId,
      partName: process.partName,
      sequence: process.sequence,
      department: process.department,
      estimatedTime: process.estimatedTime,
      cost: process.cost,
      status: process.status,
      requirements: process.requirements
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this process?')) {
      setProcesses(processes.filter(p => p.id !== id))
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

  const filteredProcesses = processes.filter(process =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Part Process Master</h1>
          <p className="text-gray-600">Manage workflows and processes for parts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Process
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search processes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Process Form */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingProcess ? 'Edit Process' : 'Add New Process'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingProcess(null)
                setFormData({
                  name: '',
                  description: '',
                  partId: '',
                  partName: '',
                  sequence: 1,
                  department: '',
                  estimatedTime: 0,
                  cost: 0,
                  status: 'active',
                  requirements: []
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
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part *
                </label>
                <select
                  required
                  value={formData.partId}
                  onChange={(e) => {
                    const part = parts.find(p => p.startsWith(e.target.value))
                    setFormData({ 
                      ...formData, 
                      partId: e.target.value,
                      partName: part ? part.split(' - ')[1] : ''
                    })
                  }}
                  className="form-input"
                >
                  <option value="">Select Part</option>
                  {parts.map(part => (
                    <option key={part} value={part.split(' - ')[0]}>{part}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sequence *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.sequence}
                  onChange={(e) => setFormData({ ...formData, sequence: Number(e.target.value) })}
                  className="form-input"
                />
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
                  Estimated Time (minutes) *
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
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingProcess(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {editingProcess ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Process List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Process List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Process
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sequence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time & Cost
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
              {filteredProcesses.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Settings className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{process.name}</div>
                        <div className="text-sm text-gray-500">{process.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{process.partName}</div>
                    <div className="text-sm text-gray-500">{process.partId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.sequence}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {process.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{process.estimatedTime} min</div>
                      <div className="text-sm text-gray-500">₹{process.cost}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      process.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {process.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(process)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(process.id)}
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

export default PartProcessMaster 