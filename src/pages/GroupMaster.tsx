import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, Folder, Users, Package } from 'lucide-react'

interface Group {
  id: string
  name: string
  description: string
  type: 'customer' | 'part' | 'item'
  code: string
  parentGroup?: string
  status: 'active' | 'inactive'
  memberCount: number
  createdDate: string
}

const GroupMaster: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Premium Customers',
      description: 'High-value customers with premium services',
      type: 'customer',
      code: 'CUST-PREM',
      status: 'active',
      memberCount: 25,
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Electronics Parts',
      description: 'All electronic components and assemblies',
      type: 'part',
      code: 'PART-ELEC',
      status: 'active',
      memberCount: 150,
      createdDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Mechanical Parts',
      description: 'Mechanical components and assemblies',
      type: 'part',
      code: 'PART-MECH',
      parentGroup: '2',
      status: 'active',
      memberCount: 89,
      createdDate: '2024-01-12'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Omit<Group, 'id' | 'memberCount' | 'createdDate'>>({
    name: '',
    description: '',
    type: 'customer',
    code: '',
    parentGroup: '',
    status: 'active'
  })

  const groupTypes = [
    { value: 'customer', label: 'Customer Group', icon: Users },
    { value: 'part', label: 'Part Group', icon: Package },
    { value: 'item', label: 'Item Group', icon: Folder }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingGroup) {
      setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, ...formData } : g))
      setEditingGroup(null)
    } else {
      const newGroup: Group = {
        ...formData,
        id: Date.now().toString(),
        memberCount: 0,
        createdDate: new Date().toISOString().split('T')[0]
      }
      setGroups([...groups, newGroup])
    }
    setFormData({
      name: '',
      description: '',
      type: 'customer',
      code: '',
      parentGroup: '',
      status: 'active'
    })
    setShowForm(false)
  }

  const handleEdit = (group: Group) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      description: group.description,
      type: group.type,
      code: group.code,
      parentGroup: group.parentGroup || '',
      status: group.status
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      setGroups(groups.filter(g => g.id !== id))
    }
  }

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getGroupIcon = (type: string) => {
    const groupType = groupTypes.find(gt => gt.value === type)
    return groupType ? groupType.icon : Folder
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer': return 'bg-blue-100 text-blue-800'
      case 'part': return 'bg-green-100 text-green-800'
      case 'item': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Group Master</h1>
          <p className="text-gray-600">Manage groups and categories for customers, parts, and items</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Group Form */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingGroup ? 'Edit Group' : 'Add New Group'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingGroup(null)
                setFormData({
                  name: '',
                  description: '',
                  type: 'customer',
                  code: '',
                  parentGroup: '',
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
                  Group Name *
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
                  Group Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="form-input"
                  placeholder="e.g., CUST-PREM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'customer' | 'part' | 'item' })}
                  className="form-input"
                >
                  {groupTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Group
                </label>
                <select
                  value={formData.parentGroup}
                  onChange={(e) => setFormData({ ...formData, parentGroup: e.target.value })}
                  className="form-input"
                >
                  <option value="">No Parent Group</option>
                  {groups
                    .filter(g => g.type === formData.type && g.id !== editingGroup?.id)
                    .map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))
                  }
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
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingGroup(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {editingGroup ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Groups List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Groups List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
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
              {filteredGroups.map((group) => {
                const Icon = getGroupIcon(group.type)
                return (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Icon className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{group.name}</div>
                          <div className="text-sm text-gray-500">{group.description}</div>
                          {group.parentGroup && (
                            <div className="text-xs text-gray-400">
                              Parent: {groups.find(g => g.id === group.parentGroup)?.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(group.type)}`}>
                        {groupTypes.find(gt => gt.value === group.type)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {group.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.memberCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(group.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        group.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {group.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(group)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(group.id)}
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

export default GroupMaster 