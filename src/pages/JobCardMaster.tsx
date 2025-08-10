import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, Calendar, Clock, User, Package, FileText, Printer } from 'lucide-react'

interface JobCard {
  id: string
  jcNumber: string
  chargeNumber: string
  jobTitle: string
  jobDescription: string
  customerId: string
  customerName: string
  partId: string
  partName: string
  partNumber: string
  poNumber: string
  sqfNumber: string
  weight: number
  quantity: number
  totalWeight: number
  fixtureWeight: number
  assignedTo: string
  startDate: string
  endDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedHours: number
  actualHours: number
  notes: string
  createdAt: string
  updatedAt: string
  
  // Inspection stages
  incomingInspection: InspectionStage
  heatTreatmentProcess: ProcessStage[]
  finalInspection: FinalInspection
  
  // Document control
  formatNumber: string
  revisionNumber: string
  revisionDate: string
}

interface InspectionStage {
  visualInspection: {
    dentDamage: boolean
    freeFromRust: boolean
    operatorSign: string
    remarks: string
  }
  punching: {
    done: boolean
    operatorSign: string
    remarks: string
  }
  pasting: {
    done: boolean
    operatorSign: string
    remarks: string
  }
  fixtureInspection: {
    done: boolean
    operatorSign: string
    remarks: string
  }
  cutPiece: {
    done: boolean
    operatorSign: string
    remarks: string
  }
}

interface ProcessStage {
  id: string
  processName: string
  inTime: string
  outTime: string
  operatorSign: string
  remarks: string
  status: 'pending' | 'in-progress' | 'completed'
}

interface FinalInspection {
  surfaceHardness: {
    specified: string
    actual: string
    remarks: string
  }
  coreHardness: {
    specified: string
    actual: string
    remarks: string
  }
  caseDepth: {
    specified: string
    actual: string
    remarks: string
  }
  qmSignature: string
  remarks: string
}

interface Customer {
  id: string
  name: string
}

interface Part {
  id: string
  name: string
}

const JobCardMaster: React.FC = () => {
  // Mock data for customers and parts (in real app, these would come from API)
  const [customers] = useState<Customer[]>([
    { id: '1', name: 'ABC Corporation' },
    { id: '2', name: 'XYZ Industries' },
    { id: '3', name: 'DEF Manufacturing' }
  ])

  const [parts] = useState<Part[]>([
    { id: '1', name: 'Motor Assembly' },
    { id: '2', name: 'Hydraulic Pump' },
    { id: '3', name: 'Control Panel' },
    { id: '4', name: 'Gear Box' }
  ])

  const [jobCards, setJobCards] = useState<JobCard[]>([
    {
      id: '1',
      jcNumber: 'JC-2024-001',
      chargeNumber: 'CH-001',
      jobTitle: 'Heat Treatment - Motor Shaft',
      jobDescription: 'Carburizing heat treatment for motor shaft components',
      customerId: '1',
      customerName: 'ABC Corporation',
      partId: '1',
      partName: 'Motor Shaft',
      partNumber: 'MS-001',
      poNumber: 'PO-001',
      sqfNumber: 'SQF-001',
      weight: 2.5,
      quantity: 100,
      totalWeight: 250,
      fixtureWeight: 15,
      assignedTo: 'John Smith',
      startDate: '2024-01-15',
      endDate: '2024-01-25',
      status: 'in-progress',
      priority: 'high',
      estimatedHours: 40,
      actualHours: 25,
      notes: 'Customer requested urgent completion',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      formatNumber: 'JHTPL/PROD/F/13',
      revisionNumber: '00/--',
      revisionDate: '01.01.2024',
      incomingInspection: {
        visualInspection: {
          dentDamage: false,
          freeFromRust: true,
          operatorSign: 'JS',
          remarks: 'All parts in good condition'
        },
        punching: {
          done: true,
          operatorSign: 'JS',
          remarks: 'Punching completed'
        },
        pasting: {
          done: true,
          operatorSign: 'JS',
          remarks: 'Pasting done'
        },
        fixtureInspection: {
          done: true,
          operatorSign: 'JS',
          remarks: 'Fixture checked and approved'
        },
        cutPiece: {
          done: true,
          operatorSign: 'JS',
          remarks: 'Cut pieces verified'
        }
      },
      heatTreatmentProcess: [
        {
          id: '1',
          processName: 'Charge Preparation',
          inTime: '08:00',
          outTime: '08:30',
          operatorSign: 'JS',
          remarks: 'Charge prepared as per specification',
          status: 'completed'
        },
        {
          id: '2',
          processName: 'Pre Washing',
          inTime: '08:30',
          outTime: '09:00',
          operatorSign: 'JS',
          remarks: 'Pre-washing completed',
          status: 'completed'
        },
        {
          id: '3',
          processName: 'Pre Heating',
          inTime: '09:00',
          outTime: '10:00',
          operatorSign: 'JS',
          remarks: 'Pre-heating in progress',
          status: 'in-progress'
        },
        {
          id: '4',
          processName: 'CHT',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '5',
          processName: 'Post Washing',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '6',
          processName: 'As Quench Hardness',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '7',
          processName: 'Tempering',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '8',
          processName: 'Shot Blasting',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        }
      ],
      finalInspection: {
        surfaceHardness: {
          specified: '58-62 HRC',
          actual: '',
          remarks: ''
        },
        coreHardness: {
          specified: '35-45 HRC',
          actual: '',
          remarks: ''
        },
        caseDepth: {
          specified: '0.8-1.2 mm',
          actual: '',
          remarks: ''
        },
        qmSignature: '',
        remarks: ''
      }
    },
    {
      id: '2',
      jcNumber: 'JC-2024-002',
      chargeNumber: 'CH-002',
      jobTitle: 'Heat Treatment - Hydraulic Pump Body',
      jobDescription: 'Heat treatment for hydraulic pump body components',
      customerId: '2',
      customerName: 'XYZ Industries',
      partId: '2',
      partName: 'Hydraulic Pump Body',
      partNumber: 'HPB-001',
      poNumber: 'PO-002',
      sqfNumber: 'SQF-002',
      weight: 5.0,
      quantity: 50,
      totalWeight: 250,
      fixtureWeight: 20,
      assignedTo: 'Mike Johnson',
      startDate: '2024-01-20',
      endDate: '2024-01-30',
      status: 'pending',
      priority: 'medium',
      estimatedHours: 24,
      actualHours: 0,
      notes: 'Scheduled maintenance',
      createdAt: '2024-01-12T09:00:00Z',
      updatedAt: '2024-01-12T09:00:00Z',
      formatNumber: 'JHTPL/PROD/F/13',
      revisionNumber: '00/--',
      revisionDate: '01.01.2024',
      incomingInspection: {
        visualInspection: {
          dentDamage: false,
          freeFromRust: true,
          operatorSign: '',
          remarks: ''
        },
        punching: {
          done: false,
          operatorSign: '',
          remarks: ''
        },
        pasting: {
          done: false,
          operatorSign: '',
          remarks: ''
        },
        fixtureInspection: {
          done: false,
          operatorSign: '',
          remarks: ''
        },
        cutPiece: {
          done: false,
          operatorSign: '',
          remarks: ''
        }
      },
      heatTreatmentProcess: [
        {
          id: '1',
          processName: 'Charge Preparation',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '2',
          processName: 'Pre Washing',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '3',
          processName: 'Pre Heating',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '4',
          processName: 'CHT',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '5',
          processName: 'Post Washing',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '6',
          processName: 'As Quench Hardness',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '7',
          processName: 'Tempering',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        },
        {
          id: '8',
          processName: 'Shot Blasting',
          inTime: '',
          outTime: '',
          operatorSign: '',
          remarks: '',
          status: 'pending'
        }
      ],
      finalInspection: {
        surfaceHardness: {
          specified: '55-60 HRC',
          actual: '',
          remarks: ''
        },
        coreHardness: {
          specified: '30-40 HRC',
          actual: '',
          remarks: ''
        },
        caseDepth: {
          specified: '1.0-1.5 mm',
          actual: '',
          remarks: ''
        },
        qmSignature: '',
        remarks: ''
      }
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingJobCard, setEditingJobCard] = useState<JobCard | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedJobCards, setSelectedJobCards] = useState<string[]>([])
  const [formData, setFormData] = useState<Omit<JobCard, 'id' | 'jcNumber' | 'createdAt' | 'updatedAt'>>({
    chargeNumber: '',
    jobTitle: '',
    jobDescription: '',
    customerId: '',
    customerName: '',
    partId: '',
    partName: '',
    partNumber: '',
    poNumber: '',
    sqfNumber: '',
    weight: 0,
    quantity: 0,
    totalWeight: 0,
    fixtureWeight: 0,
    assignedTo: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    priority: 'medium',
    estimatedHours: 0,
    actualHours: 0,
    notes: '',
    formatNumber: 'JHTPL/PROD/F/13',
    revisionNumber: '00/--',
    revisionDate: '01.01.2024',
    incomingInspection: {
      visualInspection: {
        dentDamage: false,
        freeFromRust: true,
        operatorSign: '',
        remarks: ''
      },
      punching: {
        done: false,
        operatorSign: '',
        remarks: ''
      },
      pasting: {
        done: false,
        operatorSign: '',
        remarks: ''
      },
      fixtureInspection: {
        done: false,
        operatorSign: '',
        remarks: ''
      },
      cutPiece: {
        done: false,
        operatorSign: '',
        remarks: ''
      }
    },
    heatTreatmentProcess: [
      {
        id: '1',
        processName: 'Charge Preparation',
        inTime: '',
        outTime: '',
        operatorSign: '',
        remarks: '',
        status: 'pending'
      },
      {
        id: '2',
        processName: 'Pre Washing',
        inTime: '',
        outTime: '',
        operatorSign: '',
        remarks: '',
        status: 'pending'
      },
      {
        id: '3',
        processName: 'Pre Heating',
        inTime: '',
        outTime: '',
        operatorSign: '',
        remarks: '',
        status: 'pending'
      },
      {
        id: '4',
        processName: 'CHT',
        inTime: '',
        outTime: '',
        operatorSign: '',
        remarks: '',
        status: 'pending'
      },
      {
        id: '5',
        processName: 'Post Washing',
        inTime: '',
        outTime: '',
        operatorSign: '',
        remarks: '',
        status: 'pending'
      },
      {
        id: '6',
        processName: 'As Quench Hardness',
        inTime: '',
        outTime: '',
        operatorSign: '',
        remarks: '',
        status: 'pending'
      },
      {
        id: '7',
        processName: 'Tempering',
        inTime: '',
        outTime: '',
        operatorSign: '',
        remarks: '',
        status: 'pending'
      },
      {
        id: '8',
        processName: 'Shot Blasting',
        inTime: '',
        outTime: '',
        operatorSign: '',
        remarks: '',
        status: 'pending'
      }
    ],
    finalInspection: {
      surfaceHardness: {
        specified: '',
        actual: '',
        remarks: ''
      },
      coreHardness: {
        specified: '',
        actual: '',
        remarks: ''
      },
      caseDepth: {
        specified: '',
        actual: '',
        remarks: ''
      },
      qmSignature: '',
      remarks: ''
    }
  })

  // Generate next JC number
  const generateJCNumber = () => {
    const currentYear = new Date().getFullYear()
    const existingNumbers = jobCards
      .filter(jc => jc.jcNumber.startsWith(`JC-${currentYear}-`))
      .map(jc => parseInt(jc.jcNumber.split('-')[2]))
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1
    return `JC-${currentYear}-${nextNumber.toString().padStart(3, '0')}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingJobCard) {
      setJobCards(jobCards.map(jc => 
        jc.id === editingJobCard.id 
          ? { ...formData, id: jc.id, jcNumber: jc.jcNumber, createdAt: jc.createdAt, updatedAt: new Date().toISOString() }
          : jc
      ))
      setEditingJobCard(null)
    } else {
      const newJobCard: JobCard = {
        ...formData,
        id: Date.now().toString(),
        jcNumber: generateJCNumber(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setJobCards([...jobCards, newJobCard])
    }
    
    resetForm()
    setShowForm(false)
  }

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      jobDescription: '',
      customerId: '',
      customerName: '',
      partId: '',
      partName: '',
      poNumber: '',
      assignedTo: '',
      startDate: '',
      endDate: '',
      status: 'pending',
      priority: 'high',
      estimatedHours: 0,
      actualHours: 0,
      notes: ''
    })
  }

  const handleEdit = (jobCard: JobCard) => {
    setEditingJobCard(jobCard)
    setFormData({
      jobTitle: jobCard.jobTitle,
      jobDescription: jobCard.jobDescription,
      customerId: jobCard.customerId,
      customerName: jobCard.customerName,
      partId: jobCard.partId,
      partName: jobCard.partName,
      poNumber: jobCard.poNumber,
      assignedTo: jobCard.assignedTo,
      startDate: jobCard.startDate,
      endDate: jobCard.endDate,
      status: jobCard.status,
      priority: jobCard.priority,
      estimatedHours: jobCard.estimatedHours,
      actualHours: jobCard.actualHours,
      notes: jobCard.notes
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job card?')) {
      setJobCards(jobCards.filter(jc => jc.id !== id))
    }
  }

  const handlePrint = (jobCard: JobCard) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Job Card - ${jobCard.jcNumber}</title>
          <style>
            @page { margin: 15mm; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
              color: #333;
            }
            .page-header { 
              text-align: center; 
              border-bottom: 3px solid #1e40af; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 20px;
              border-radius: 8px;
            }
            .company-logo { 
              font-size: 28px; 
              font-weight: bold; 
              color: #1e40af; 
              margin-bottom: 8px; 
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .company-tagline { 
              font-size: 14px; 
              color: #64748b; 
              margin-bottom: 15px; 
            }
            .job-card-title { 
              font-size: 22px; 
              font-weight: bold; 
              color: #dc2626; 
              margin-bottom: 5px; 
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .jc-number { 
              font-size: 20px; 
              font-weight: bold; 
              color: #1e40af; 
              background: #f1f5f9;
              padding: 8px 16px;
              border-radius: 6px;
              display: inline-block;
              border: 2px solid #1e40af;
            }
            .main-content { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 30px; 
              margin-bottom: 30px; 
            }
            .section { 
              margin-bottom: 25px; 
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #1e40af;
            }
            .section-title { 
              font-size: 16px; 
              font-weight: bold; 
              color: #1e40af; 
              border-bottom: 2px solid #e2e8f0; 
              padding-bottom: 8px; 
              margin-bottom: 15px; 
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .row { 
              display: flex; 
              margin-bottom: 12px; 
              align-items: center;
            }
            .label { 
              font-weight: 600; 
              width: 140px; 
              color: #475569;
              font-size: 14px;
            }
            .value { 
              flex: 1; 
              font-size: 14px;
              color: #1e293b;
            }
            .status-badge { 
              display: inline-block; 
              padding: 6px 14px; 
              border-radius: 25px; 
              font-weight: bold; 
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .priority-badge { 
              display: inline-block; 
              padding: 6px 14px; 
              border-radius: 25px; 
              font-weight: bold; 
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .timeline-section {
              grid-column: 1 / -1;
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border-left: 4px solid #f59e0b;
            }
            .timeline-section .section-title {
              color: #92400e;
              border-bottom-color: #fbbf24;
            }
            .progress-bar {
              width: 100%;
              height: 20px;
              background: #e5e7eb;
              border-radius: 10px;
              overflow: hidden;
              margin: 10px 0;
            }
            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #10b981, #059669);
              border-radius: 10px;
              transition: width 0.3s ease;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #64748b;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            .signature-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-top: 30px;
            }
            .signature-box {
              text-align: center;
              padding: 20px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
            }
            .signature-line {
              border-top: 1px solid #9ca3af;
              margin-top: 40px;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .no-print { display: none; }
              .page-header { background: white !important; }
              .section { background: white !important; }
              .timeline-section { background: white !important; }
            }
          </style>
        </head>
        <body>
          <div class="page-header">
            <div class="company-logo">Business Management System</div>
            <div class="company-tagline">Professional Business Solutions & Management</div>
            <div class="job-card-title">Work Order / Job Card</div>
            <div class="jc-number">${jobCard.jcNumber}</div>
          </div>

          <div class="main-content">
            <div class="section">
              <div class="section-title">Job Details</div>
              <div class="row">
                <div class="label">Job Title:</div>
                <div class="value"><strong>${jobCard.jobTitle}</strong></div>
              </div>
              <div class="row">
                <div class="label">Description:</div>
                <div class="value">${jobCard.jobDescription}</div>
              </div>
              <div class="row">
                <div class="label">Status:</div>
                <div class="value">
                  <span class="status-badge" style="background-color: ${
                    jobCard.status === 'pending' ? '#fef3c7' : 
                    jobCard.status === 'in-progress' ? '#dbeafe' : 
                    jobCard.status === 'completed' ? '#dcfce7' : 
                    jobCard.status === 'on-hold' ? '#fed7aa' : '#fee2e2'
                  }; color: ${
                    jobCard.status === 'pending' ? '#92400e' : 
                    jobCard.status === 'in-progress' ? '#1e40af' : 
                    jobCard.status === 'completed' ? '#166534' : 
                    jobCard.status === 'on-hold' ? '#ea580c' : '#dc2626'
                  };">
                    ${jobCard.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <div class="row">
                <div class="label">Priority:</div>
                <div class="value">
                  <span class="priority-badge" style="background-color: ${
                    jobCard.priority === 'low' ? '#f3f4f6' : 
                    jobCard.priority === 'medium' ? '#dbeafe' : 
                    jobCard.priority === 'high' ? '#fed7aa' : '#fee2e2'
                  }; color: ${
                    jobCard.priority === 'low' ? '#374151' : 
                    jobCard.priority === 'medium' ? '#1e40af' : 
                    jobCard.priority === 'high' ? '#ea580c' : '#dc2626'
                  };">
                    ${jobCard.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Customer Information</div>
              <div class="row">
                <div class="label">Customer Name:</div>
                <div class="value"><strong>${jobCard.customerName}</strong></div>
              </div>
              <div class="row">
                <div class="label">Part/Item:</div>
                <div class="value"><strong>${jobCard.partName}</strong></div>
              </div>
              <div class="row">
                <div class="label">PO Reference:</div>
                <div class="value">${jobCard.poNumber || 'N/A'}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Assignment</div>
              <div class="row">
                <div class="label">Assigned To:</div>
                <div class="value"><strong>${jobCard.assignedTo}</strong></div>
              </div>
              <div class="row">
                <div class="label">Start Date:</div>
                <div class="value">${new Date(jobCard.startDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
              <div class="row">
                <div class="label">End Date:</div>
                <div class="value">${new Date(jobCard.endDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Time Tracking</div>
              <div class="row">
                <div class="label">Estimated Hours:</div>
                <div class="value"><strong>${jobCard.estimatedHours} hours</strong></div>
              </div>
              <div class="row">
                <div class="label">Actual Hours:</div>
                <div class="value"><strong>${jobCard.actualHours} hours</strong></div>
              </div>
              <div class="row">
                <div class="label">Progress:</div>
                <div class="value">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min((jobCard.actualHours / jobCard.estimatedHours) * 100, 100)}%"></div>
                  </div>
                  <small>${Math.round((jobCard.actualHours / jobCard.estimatedHours) * 100)}% Complete</small>
                </div>
              </div>
            </div>
          </div>

          <div class="timeline-section">
            <div class="section-title">Work Progress & Notes</div>
            <div class="row">
              <div class="label">Additional Notes:</div>
              <div class="value">${jobCard.notes || 'No additional notes or special instructions provided.'}</div>
            </div>
            <div class="row">
              <div class="label">Created On:</div>
              <div class="value">${new Date(jobCard.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
            </div>
            <div class="row">
              <div class="label">Last Updated:</div>
              <div class="value">${new Date(jobCard.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
            </div>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">Technician/Worker Signature</div>
              <small>Date: _________________</small>
            </div>
            <div class="signature-box">
              <div class="signature-line">Supervisor/Manager Signature</div>
              <small>Date: _________________</small>
            </div>
          </div>

          <div class="footer">
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p>This is an official job card document from Business Management System</p>
            <p>For any queries, please contact the system administrator</p>
          </div>

          <div class="no-print" style="margin-top: 20px; text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px;">
            <button onclick="window.print()" style="padding: 12px 24px; background: #1e40af; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 10px; font-size: 14px; font-weight: 600;">
              🖨️ Print Job Card
            </button>
            <button onclick="window.close()" style="padding: 12px 24px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 10px; font-size: 14px; font-weight: 600;">
              ❌ Close Window
            </button>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || ''
    }))
  }

  const handlePartChange = (partId: string) => {
    const part = parts.find(p => p.id === partId)
    setFormData(prev => ({
      ...prev,
      partId,
      partName: part?.name || ''
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'on-hold': return 'bg-orange-100 text-orange-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredJobCards = jobCards.filter(jobCard => {
    const matchesSearch = 
      jobCard.jcNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || jobCard.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Card Management</h1>
          <p className="text-gray-600">Create and manage job cards for tracking work orders</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Job Card
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by JC number, title, customer, or assigned person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Cards Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JC Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobCards.map((jobCard) => (
                <tr key={jobCard.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{jobCard.jcNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{jobCard.jobTitle}</div>
                      <div className="text-sm text-gray-500">{jobCard.partName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {jobCard.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {jobCard.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(jobCard.status)}`}>
                      {jobCard.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(jobCard.priority)}`}>
                      {jobCard.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(jobCard.startDate).toLocaleDateString()} - {new Date(jobCard.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrint(jobCard)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Print Job Card"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(jobCard)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit Job Card"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(jobCard.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Job Card"
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

      {/* Job Card Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingJobCard ? 'Edit Job Card' : 'Create New Job Card'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingJobCard(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Document Control Section */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format No.</label>
                    <input
                      type="text"
                      name="formatNumber"
                      value={formData.formatNumber}
                      onChange={(e) => setFormData({ ...formData, formatNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Revision No.</label>
                    <input
                      type="text"
                      name="revisionNumber"
                      value={formData.revisionNumber}
                      onChange={(e) => setFormData({ ...formData, revisionNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Revision Date</label>
                    <input
                      type="text"
                      name="revisionDate"
                      value={formData.revisionDate}
                      onChange={(e) => setFormData({ ...formData, revisionDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Basic Job Information */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Charge Number *</label>
                    <input
                      type="text"
                      name="chargeNumber"
                      value={formData.chargeNumber}
                      onChange={(e) => setFormData({ ...formData, chargeNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                    <select
                      required
                      value={formData.customerId}
                      onChange={(e) => handleCustomerChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Part *</label>
                    <select
                      required
                      value={formData.partId}
                      onChange={(e) => handlePartChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Part</option>
                      {parts.map(part => (
                        <option key={part.id} value={part.id}>{part.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
                    <input
                      type="text"
                      name="partNumber"
                      value={formData.partNumber}
                      onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PO Number</label>
                    <input
                      type="text"
                      value={formData.poNumber}
                      onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SQF Number</label>
                    <input
                      type="text"
                      name="sqfNumber"
                      value={formData.sqfNumber}
                      onChange={(e) => setFormData({ ...formData, sqfNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To *</label>
                    <input
                      type="text"
                      required
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Weight and Quantity Section */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Weight & Quantity Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="weight"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="totalWeight"
                      value={formData.totalWeight}
                      onChange={(e) => setFormData({ ...formData, totalWeight: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fixture Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="fixtureWeight"
                      value={formData.fixtureWeight}
                      onChange={(e) => setFormData({ ...formData, fixtureWeight: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                    <select
                      required
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Actual Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.actualHours}
                      onChange={(e) => setFormData({ ...formData, actualHours: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Description and Notes */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Description & Notes</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                    <textarea
                      rows={3}
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingJobCard(null)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingJobCard ? 'Update' : 'Create'} Job Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobCardMaster 