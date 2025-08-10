import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CustomerMaster from './pages/CustomerMaster'
import PartMaster from './pages/PartMaster'
import PartProcessMaster from './pages/PartProcessMaster'
import GroupMaster from './pages/GroupMaster'
import ItemMaster from './pages/ItemMaster'
import TaxMaster from './pages/TaxMaster'
import ClearanceMaster from './pages/ClearanceMaster'
import InwardAgainstPO from './pages/InwardAgainstPO'
import AccountBilling from './pages/AccountBillingProcess'
import CustomerPOEntry from './pages/CustomerPOEntry'
import JobCardMaster from './pages/JobCardMaster'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer-master" element={<CustomerMaster />} />
          <Route path="/part-master" element={<PartMaster />} />
          <Route path="/part-process-master" element={<PartProcessMaster />} />
          <Route path="/group-master" element={<GroupMaster />} />
          <Route path="/item-master" element={<ItemMaster />} />
          <Route path="/job-card-master" element={<JobCardMaster />} />
          <Route path="/tax-master" element={<TaxMaster />} />
          <Route path="/clearance-master" element={<ClearanceMaster />} />
          <Route path="/inward-against-po" element={<InwardAgainstPO />} />
          <Route path="/account-billing" element={<AccountBilling />} />
          <Route path="/customer-po-entry" element={<CustomerPOEntry />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 