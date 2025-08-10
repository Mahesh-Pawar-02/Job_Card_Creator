class ManufacturingDashboard {
    constructor() {
        this.jobCards = [];
        this.charts = {};
        this.init();
    }

    init() {
        this.loadJobCards();
        this.updateDashboard();
        this.initializeCharts();
        this.setupEventListeners();
    }

    loadJobCards() {
        const stored = localStorage.getItem('manufacturingJobCards');
        this.jobCards = stored ? JSON.parse(stored) : [];
    }

    updateDashboard() {
        this.updateStats();
        this.updateWorkSections();
        this.updateRecentJobs();
    }

    updateStats() {
        const totalJobCards = this.jobCards.length;
        const pendingJobs = this.jobCards.filter(job => !job.isCompleted).length;
        const completedJobs = this.jobCards.filter(job => job.isCompleted).length;
        const totalWeight = this.jobCards.reduce((sum, job) => {
            return sum + job.parts.reduce((partSum, part) => partSum + (part.totalWeight || 0), 0);
        }, 0);

        document.getElementById('totalJobCards').textContent = totalJobCards;
        document.getElementById('pendingJobs').textContent = pendingJobs;
        document.getElementById('completedJobs').textContent = completedJobs;
        document.getElementById('totalWeight').textContent = totalWeight.toFixed(3);
    }

    updateWorkSections() {
        // Heat Treatment Jobs
        const heatTreatmentJobs = this.jobCards.filter(job => 
            job.heatTreatmentOperator && job.heatTreatmentOperator.trim() !== ''
        );
        document.getElementById('heatTreatmentCount').textContent = heatTreatmentJobs.length;
        this.populateWorkSection('heatTreatmentJobs', heatTreatmentJobs, 'Heat Treatment');

        // Inspection Jobs
        const inspectionJobs = this.jobCards.filter(job => 
            job.incomingOperator && job.incomingOperator.trim() !== ''
        );
        document.getElementById('inspectionCount').textContent = inspectionJobs.length;
        this.populateWorkSection('inspectionJobs', inspectionJobs, 'Inspection');

        // Quality Control Jobs
        const qualityJobs = this.jobCards.filter(job => 
            job.qmSignature && job.qmSignature.trim() !== ''
        );
        document.getElementById('qualityCount').textContent = qualityJobs.length;
        this.populateWorkSection('qualityJobs', qualityJobs, 'Quality Control');
    }

    populateWorkSection(elementId, jobs, type) {
        const element = document.getElementById(elementId);
        if (jobs.length === 0) {
            element.innerHTML = `<p class="no-data">No ${type} jobs found</p>`;
            return;
        }

        const recentJobs = jobs.slice(0, 3); // Show only 3 most recent
        element.innerHTML = recentJobs.map(job => `
            <div class="work-item">
                <div class="work-item-header">
                    <span class="work-customer">${job.customerName || 'N/A'}</span>
                    <span class="work-date">${job.jobDate || 'N/A'}</span>
                </div>
                <div class="work-details">
                    <span class="work-charge">Charge: ${job.chargeNo || 'N/A'}</span>
                    <span class="work-weight">${this.calculateTotalWeight(job.parts).toFixed(3)} KGS</span>
                </div>
                <div class="work-status">
                    <span class="status-badge ${job.isCompleted ? 'completed' : 'pending'}">
                        ${job.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    updateRecentJobs() {
        const recentJobs = this.jobCards.slice(0, 10); // Show last 10 jobs
        const tbody = document.getElementById('recentJobsBody');
        
        if (recentJobs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #64748b;">
                        No job cards found. <a href="index.html" style="color: #667eea;">Create your first job card</a>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = recentJobs.map(job => `
            <tr>
                <td>${job.jobDate || 'N/A'}</td>
                <td>${job.customerName || 'N/A'}</td>
                <td>${job.chargeNo || 'N/A'}</td>
                <td>${job.parts.length} part(s)</td>
                <td>${this.calculateTotalWeight(job.parts).toFixed(3)}</td>
                <td>
                    <span class="job-status ${job.isCompleted ? 'status-completed' : 'status-pending'}">
                        ${job.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="dashboard.editJobCard('${job.id}')" title="Edit Job Card">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="dashboard.deleteJobCard('${job.id}')" title="Delete Job Card">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-pdf" onclick="dashboard.generatePDF('${job.id}')" title="Generate PDF">
                            <i class="fas fa-file-pdf"></i>
                        </button>
                        <button class="btn-view" onclick="dashboard.viewJobCard('${job.id}')" title="View Job Card">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-download" onclick="dashboard.downloadJobCard('${job.id}')" title="Download Job Card">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-whatsapp" onclick="dashboard.shareViaWhatsApp('${job.id}')" title="Share via WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    initializeCharts() {
        this.createMonthlyChart();
        this.createCustomerChart();
    }

    createMonthlyChart() {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        
        // Group jobs by month
        const monthlyData = this.getMonthlyData();
        
        this.charts.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'Job Cards Created',
                    data: monthlyData.data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createCustomerChart() {
        const ctx = document.getElementById('customerChart').getContext('2d');
        
        // Group jobs by customer
        const customerData = this.getCustomerData();
        
        this.charts.customer = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: customerData.labels,
                datasets: [{
                    data: customerData.data,
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe',
                        '#43e97b',
                        '#38f9d7'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    getMonthlyData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const monthlyCounts = new Array(12).fill(0);

        this.jobCards.forEach(job => {
            if (job.jobDate) {
                const date = new Date(job.jobDate);
                if (date.getFullYear() === currentYear) {
                    monthlyCounts[date.getMonth()]++;
                }
            }
        });

        return {
            labels: months,
            data: monthlyCounts
        };
    }

    getCustomerData() {
        const customerCounts = {};
        
        this.jobCards.forEach(job => {
            const customer = job.customerName || 'Unknown';
            customerCounts[customer] = (customerCounts[customer] || 0) + 1;
        });

        const sortedCustomers = Object.entries(customerCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8); // Top 8 customers

        return {
            labels: sortedCustomers.map(([customer]) => customer),
            data: sortedCustomers.map(([, count]) => count)
        };
    }

    calculateTotalWeight(parts) {
        return parts.reduce((sum, part) => sum + (part.totalWeight || 0), 0);
    }

    editJobCard(id) {
        // Store the job card ID for editing
        localStorage.setItem('editJobCardId', id);
        window.location.href = 'index.html';
    }

    deleteJobCard(id) {
        if (confirm('Are you sure you want to delete this job card? This action cannot be undone.')) {
            this.jobCards = this.jobCards.filter(job => job.id !== id);
            this.saveToLocalStorage();
            this.updateDashboard();
            this.updateCharts();
            this.showNotification('Job card deleted successfully', 'success');
        }
    }

    generatePDF(id) {
        console.log('generatePDF called with id:', id);
        const job = this.jobCards.find(job => job.id === id);
        if (job) {
            // For now, show a notification - PDF generation can be implemented later
            this.showNotification('PDF generation feature coming soon!', 'info');
            console.log('Generate PDF for job:', job);
        } else {
            console.log('Job not found for id:', id);
        }
    }

    viewJobCard(id) {
        console.log('viewJobCard called with id:', id);
        const job = this.jobCards.find(job => job.id === id);
        if (job) {
            // Store the job data in localStorage for the main page to access
            localStorage.setItem('viewJobCard', JSON.stringify(job));
            // Redirect to main page to view the job card
            window.location.href = 'index.html?view=' + id;
        } else {
            console.log('Job not found for id:', id);
        }
    }

    downloadJobCard(id) {
        const job = this.jobCards.find(job => job.id === id);
        if (job) {
            // For now, show a notification - download can be implemented later
            this.showNotification('Download feature coming soon!', 'info');
            console.log('Download job card:', job);
        }
    }

    shareViaWhatsApp(id) {
        const job = this.jobCards.find(job => job.id === id);
        if (job) {
            // Create a summary message for WhatsApp
            const message = `Job Card Summary:\nCustomer: ${job.customerName}\nCharge No: ${job.chargeNo}\nParts: ${job.parts.length} part(s)\nWeight: ${this.calculateTotalWeight(job.parts).toFixed(3)} KGS\nStatus: ${job.isCompleted ? 'Completed' : 'Pending'}`;
            
            // Encode the message for WhatsApp URL
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
            
            // Open WhatsApp in a new window
            window.open(whatsappUrl, '_blank');
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('manufacturingJobCards', JSON.stringify(this.jobCards));
    }

    updateCharts() {
        if (this.charts.monthly) {
            const monthlyData = this.getMonthlyData();
            this.charts.monthly.data.datasets[0].data = monthlyData.data;
            this.charts.monthly.update();
        }

        if (this.charts.customer) {
            const customerData = this.getCustomerData();
            this.charts.customer.data.labels = customerData.labels;
            this.charts.customer.data.datasets[0].data = customerData.data;
            this.charts.customer.update();
        }
    }

    setupEventListeners() {
        // Add any additional event listeners here
        window.addEventListener('storage', (e) => {
            if (e.key === 'manufacturingJobCards') {
                this.loadJobCards();
                this.updateDashboard();
                this.updateCharts();
            }
        });
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Global functions
function exportAllData() {
    const jobCards = JSON.parse(localStorage.getItem('manufacturingJobCards') || '[]');
    if (jobCards.length === 0) {
        dashboard.showNotification('No data to export', 'info');
        return;
    }

    const dataStr = JSON.stringify(jobCards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manufacturing-job-cards-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    dashboard.showNotification('All data exported successfully', 'success');
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all job card data? This action cannot be undone.')) {
        localStorage.removeItem('manufacturingJobCards');
        dashboard.loadJobCards();
        dashboard.updateDashboard();
        dashboard.updateCharts();
        dashboard.showNotification('All data cleared successfully', 'success');
    }
}

function refreshDashboard() {
    dashboard.loadJobCards();
    dashboard.updateDashboard();
    dashboard.updateCharts();
    dashboard.showNotification('Dashboard refreshed', 'info');
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new ManufacturingDashboard();
    // Make dashboard globally accessible
    window.dashboard = dashboard;
});

// Add some CSS for work items
const style = document.createElement('style');
style.textContent = `
    .work-item {
        background: #f8fafc;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        border-left: 4px solid #667eea;
    }

    .work-item-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }

    .work-customer {
        font-weight: 600;
        color: #1e293b;
    }

    .work-date {
        color: #64748b;
        font-size: 0.9rem;
    }

    .work-details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 0.9rem;
    }

    .work-charge {
        color: #374151;
    }

    .work-weight {
        color: #059669;
        font-weight: 600;
    }

    .work-status {
        text-align: right;
    }

    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .status-badge.completed {
        background: #d1fae5;
        color: #065f46;
    }

    .status-badge.pending {
        background: #fef3c7;
        color: #92400e;
    }

    .no-data {
        text-align: center;
        color: #64748b;
        font-style: italic;
        padding: 20px;
    }
`;
document.head.appendChild(style);
