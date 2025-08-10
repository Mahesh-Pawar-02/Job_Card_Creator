import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, FileText, DollarSign, User, Calendar, Printer, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  customerCode: string
  invoiceDate: string
  dueDate: string
  subtotal: number
  taxAmount: number
  discount: number
  totalAmount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  paymentTerms: string
  notes: string
  items: InvoiceItem[]
  createdBy: string
  createdAt: string
}

interface InvoiceItem {
  id: string
  itemName: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
}

const AccountBillingProcess: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerName: 'ABC Manufacturing Ltd',
      customerCode: 'CUST-001',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-14',
      subtotal: 50000,
      taxAmount: 9000,
      discount: 2000,
      totalAmount: 57000,
      status: 'sent',
      paymentTerms: 'Net 30',
      notes: 'Payment due within 30 days',
      items: [
        {
          id: '1',
          itemName: 'Industrial Motor',
          description: 'High-performance industrial electric motor',
          quantity: 2,
          unit: 'Piece',
          unitPrice: 15000,
          total: 30000
        },
        {
          id: '2',
          itemName: 'Gear Box Assembly',
          description: 'Precision gear box for industrial applications',
          quantity: 1,
          unit: 'Piece',
          unitPrice: 20000,
          total: 20000
        }
      ],
      createdBy: 'John Doe',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerName: 'XYZ Industries',
      customerCode: 'CUST-002',
      invoiceDate: '2024-01-18',
      dueDate: '2024-02-17',
      subtotal: 75000,
      taxAmount: 13500,
      discount: 0,
      totalAmount: 88500,
      status: 'draft',
      paymentTerms: 'Net 45',
      notes: 'Draft invoice for review',
      items: [
        {
          id: '3',
          itemName: 'Hydraulic Pump',
          description: 'Industrial hydraulic pump system',
          quantity: 3,
          unit: 'Piece',
          unitPrice: 25000,
          total: 75000
        }
      ],
      createdBy: 'Jane Smith',
      createdAt: '2024-01-18'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Omit<Invoice, 'id' | 'createdAt' | 'createdBy'>>({
    invoiceNumber: '',
    customerName: '',
    customerCode: '',
    invoiceDate: '',
    dueDate: '',
    subtotal: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 0,
    status: 'draft',
    paymentTerms: '',
    notes: '',
    items: []
  })

  const paymentTerms = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt']
  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'overdue', label: 'Overdue', color: 'bg-red-100 text-red-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingInvoice) {
      setInvoices(invoices.map(inv => inv.id === editingInvoice.id ? { ...formData, id: inv.id, createdAt: inv.createdAt, createdBy: inv.createdBy } : inv))
      setEditingInvoice(null)
    } else {
      const newInvoice: Invoice = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'Current User' // In real app, get from auth context
      }
      setInvoices([...invoices, newInvoice])
    }
    setFormData({
      invoiceNumber: '',
      customerName: '',
      customerCode: '',
      invoiceDate: '',
      dueDate: '',
      subtotal: 0,
      taxAmount: 0,
      discount: 0,
      totalAmount: 0,
      status: 'draft',
      paymentTerms: '',
      notes: '',
      items: []
    })
    setShowForm(false)
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      customerCode: invoice.customerCode,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      subtotal: invoice.subtotal,
      taxAmount: invoice.taxAmount,
      discount: invoice.discount,
      totalAmount: invoice.totalAmount,
      status: invoice.status,
      paymentTerms: invoice.paymentTerms,
      notes: invoice.notes,
      items: invoice.items
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== id))
    }
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      itemName: '',
      description: '',
      quantity: 1,
      unit: 'Piece',
      unitPrice: 0,
      total: 0
    }
    setFormData({ ...formData, items: [...formData.items, newItem] })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Recalculate item total
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    }
    
    setFormData({ ...formData, items: newItems })
    
    // Recalculate invoice totals
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0)
    const totalAmount = subtotal + formData.taxAmount - formData.discount
    setFormData(prev => ({ ...prev, subtotal, totalAmount }))
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    return statusOption ? statusOption.label : status
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
    const totalAmount = subtotal + formData.taxAmount - formData.discount
    setFormData(prev => ({ ...prev, subtotal, totalAmount }))
  }

  React.useEffect(() => {
    calculateTotals()
  }, [formData.items, formData.taxAmount, formData.discount])

  const handlePrintInvoice = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const invoiceHTML = generateInvoiceHTML(invoice)
      printWindow.document.write(invoiceHTML)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      // Create a temporary div with the invoice content
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = generateInvoiceHTML(invoice)
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '0'
      tempDiv.style.width = '800px'
      tempDiv.style.padding = '20px'
      tempDiv.style.backgroundColor = 'white'
      tempDiv.style.fontFamily = 'Arial, sans-serif'
      document.body.appendChild(tempDiv)

      // Convert HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: tempDiv.scrollHeight
      })

      // Remove temporary div
      document.body.removeChild(tempDiv)

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Download PDF
      pdf.save(`${invoice.invoiceNumber}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const generateInvoiceHTML = (invoice: Invoice) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .customer-info, .invoice-details { flex: 1; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; }
          .totals { text-align: right; margin-top: 20px; }
          .total { font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <h2>${invoice.invoiceNumber}</h2>
        </div>
        
        <div class="invoice-info">
          <div class="customer-info">
            <h3>Bill To:</h3>
            <p><strong>${invoice.customerName}</strong></p>
            <p>Code: ${invoice.customerCode}</p>
          </div>
          <div class="invoice-details">
            <p><strong>Invoice Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p><strong>Payment Terms:</strong> ${invoice.paymentTerms}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.itemName}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>₹${item.unitPrice.toLocaleString()}</td>
                <td>₹${item.total.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <p><strong>Subtotal:</strong> ₹${invoice.subtotal.toLocaleString()}</p>
          <p><strong>Tax Amount:</strong> ₹${invoice.taxAmount.toLocaleString()}</p>
          <p><strong>Discount:</strong> ₹${invoice.discount.toLocaleString()}</p>
          <p class="total"><strong>Total Amount:</strong> ₹${invoice.totalAmount.toLocaleString()}</p>
        </div>
        
        ${invoice.notes ? `<div style="margin-top: 30px;"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
        
        <div style="margin-top: 50px; text-align: center; color: #666;">
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>
    `
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Billing Process</h1>
          <p className="text-gray-600">Manage billing and invoice generation</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search invoices by number, customer, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Invoice Form */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingInvoice(null)
                setFormData({
                  invoiceNumber: '',
                  customerName: '',
                  customerCode: '',
                  invoiceDate: '',
                  dueDate: '',
                  subtotal: 0,
                  taxAmount: 0,
                  discount: 0,
                  totalAmount: 0,
                  status: 'draft',
                  paymentTerms: '',
                  notes: '',
                  items: []
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
                  Invoice Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="form-input"
                  placeholder="e.g., INV-2024-001"
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
                  Invoice Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms *
                </label>
                <select
                  required
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Payment Terms</option>
                  {paymentTerms.map(term => (
                    <option key={term} value={term}>{term}</option>
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
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' })}
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
                placeholder="Additional notes or terms..."
              />
            </div>

            {/* Invoice Items */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Invoice Items
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  + Add Item
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 border rounded-lg">
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                      className="form-input"
                      placeholder="Item name"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="form-input"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className="form-input"
                      placeholder="Qty"
                      min="1"
                    />
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(index, 'unit', e.target.value)}
                      className="form-input"
                      placeholder="Unit"
                    />
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                      className="form-input"
                      placeholder="Unit price"
                      min="0"
                      step="0.01"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{item.total.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">₹{formData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax Amount:</span>
                  <input
                    type="number"
                    value={formData.taxAmount}
                    onChange={(e) => setFormData({ ...formData, taxAmount: Number(e.target.value) })}
                    className="form-input w-24"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="form-input w-24"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">₹{formData.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingInvoice(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {editingInvoice ? 'Update' : 'Create'} Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invoices List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Invoices List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Details
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">{invoice.paymentTerms}</div>
                        <div className="text-xs text-gray-400">By: {invoice.createdBy}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{invoice.customerName}</div>
                      <div className="text-sm text-gray-500">{invoice.customerCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">Invoice: {new Date(invoice.invoiceDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">₹{invoice.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Sub: ₹{invoice.subtotal.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Tax: ₹{invoice.taxAmount.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(invoice)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handlePrintInvoice(invoice)}
                        className="text-green-600 hover:text-green-900"
                        title="Print Invoice"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Download Invoice"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
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

export default AccountBillingProcess 