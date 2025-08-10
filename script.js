// Manufacturing Job Card Application JavaScript

class ManufacturingJobCardApp {
    constructor() {
        this.jobCards = JSON.parse(localStorage.getItem('manufacturingJobCards')) || [];
        this.currentEditIndex = null;
        this.partCounter = 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderJobCards();
        this.updatePreview();
        this.setupPartCalculations();
        this.setDefaultDate();
    }

    setupEventListeners() {
        const form = document.getElementById('jobCardForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Add event listeners for form inputs to update preview
        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
            input.addEventListener('change', () => this.updatePreview());
        });
    }

    setupPartCalculations() {
        // Set up weight calculations for the first part
        this.setupPartWeightCalculation(1);
    }

    setupPartWeightCalculation(partNumber) {
        const weightInput = document.getElementById(`weight${partNumber}`);
        const quantityInput = document.getElementById(`quantity${partNumber}`);
        const totalWeightInput = document.getElementById(`totalWeight${partNumber}`);

        if (weightInput && quantityInput && totalWeightInput) {
            const calculateTotal = () => {
                const weight = parseFloat(weightInput.value) || 0;
                const quantityText = quantityInput.value;
                const quantity = this.extractQuantity(quantityText);
                const total = weight * quantity;
                totalWeightInput.value = total.toFixed(3);
                this.updatePreview();
            };

            weightInput.addEventListener('input', calculateTotal);
            quantityInput.addEventListener('input', calculateTotal);
        }
    }

    extractQuantity(quantityText) {
        // Extract numeric value from quantity text (e.g., "56 NOS" -> 56)
        const match = quantityText.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('jobDate').value = today;
    }

    addPartEntry() {
        this.partCounter++;
        const partsContainer = document.getElementById('partsContainer');
        
        const partEntry = document.createElement('div');
        partEntry.className = 'part-entry';
        partEntry.innerHTML = `
            <h4>Part ${this.partCounter}</h4>
            <div class="form-row">
                <div class="form-group">
                    <label for="partName${this.partCounter}">Part Name/No *</label>
                    <input type="text" id="partName${this.partCounter}" name="partName${this.partCounter}" placeholder="e.g., Sprocket B04082L" required>
                </div>
                <div class="form-group">
                    <label for="weight${this.partCounter}">Weight (KGS)</label>
                    <input type="number" id="weight${this.partCounter}" name="weight${this.partCounter}" step="0.001" placeholder="e.g., 3.142">
                </div>
                <div class="form-group">
                    <label for="quantity${this.partCounter}">Quantity</label>
                    <input type="text" id="quantity${this.partCounter}" name="quantity${this.partCounter}" placeholder="e.g., 56 NOS">
                </div>
                <div class="form-group">
                    <label for="totalWeight${this.partCounter}">Total Weight (KGS)</label>
                    <input type="number" id="totalWeight${this.partCounter}" name="totalWeight${this.partCounter}" step="0.001" readonly>
                </div>
            </div>
            <button type="button" class="btn btn-secondary" onclick="this.parentElement.remove(); updatePreview();" style="margin-top: 10px;">
                <i class="fas fa-trash"></i> Remove Part
            </button>
        `;
        
        partsContainer.appendChild(partEntry);
        this.setupPartWeightCalculation(this.partCounter);
        
        // Add event listeners for the new part
        const newInputs = partEntry.querySelectorAll('input');
        newInputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
            input.addEventListener('change', () => this.updatePreview());
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const jobCardData = this.extractFormData(formData);
        
        if (this.currentEditIndex !== null) {
            // Update existing job card - preserve ID and completion status
            const existingJob = this.jobCards[this.currentEditIndex];
            jobCardData.id = existingJob.id;
            jobCardData.isCompleted = existingJob.isCompleted;
            jobCardData.createdAt = existingJob.createdAt;
            this.jobCards[this.currentEditIndex] = jobCardData;
            this.showNotification('Job card updated successfully!', 'success');
        } else {
            // Create new job card
            jobCardData.createdAt = new Date().toISOString();
            this.jobCards.push(jobCardData);
            this.showNotification('Job card created successfully!', 'success');
        }
        
        this.saveToLocalStorage();
        this.renderJobCards();
        this.clearForm();
        this.updatePreview();
        this.currentEditIndex = null;
    }

    extractFormData(formData) {
        const data = {};
        
        // Generate unique ID and set completion status
        data.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        data.isCompleted = false;
        
        // Company Information (from static header)
        data.companyName = 'JYOTI HEAT TREATMENT PVT LTD';
        data.companyAddress = 'Plot No. J-199, M.I.D.C, Bhosari, Pune-26';
        data.formatNo = 'JHTPL/QA/F/04';
        data.revNo = '00/-';
        data.revDate = '01.01.2023';
        data.chargeNo = formData.get('chargeNo');
        
        // Parts Information
        data.jobDate = formData.get('jobDate');
        data.customerName = formData.get('customerName');
        data.sqfNo = formData.get('sqfNo');
        
        // Extract parts data
        data.parts = [];
        const partEntries = document.querySelectorAll('.part-entry');
        partEntries.forEach((entry, index) => {
            const partNumber = index + 1;
            const partName = formData.get(`partName${partNumber}`);
            const weight = formData.get(`weight${partNumber}`);
            const quantity = formData.get(`quantity${partNumber}`);
            const totalWeight = formData.get(`totalWeight${partNumber}`);
            
            if (partName) {
                data.parts.push({
                    partName,
                    weight: parseFloat(weight) || 0,
                    quantity,
                    totalWeight: parseFloat(totalWeight) || 0
                });
            }
        });
        
        // Incoming Inspection
        data.incomingOperator = formData.get('incomingOperator');
        data.incomingInspection = {
            visual1a: formData.get('visual1a'),
            visual1aDone: formData.get('visual1aDone'),
            visual1aRemarks: formData.get('visual1aRemarks'),
            punching: formData.get('punching'),
            punchingDone: formData.get('punchingDone'),
            punchingRemarks: formData.get('punchingRemarks'),
            pasting: formData.get('pasting'),
            pastingDone: formData.get('pastingDone'),
            pastingRemarks: formData.get('pastingRemarks'),
            fixture: formData.get('fixture'),
            fixtureDone: formData.get('fixtureDone'),
            fixtureRemarks: formData.get('fixtureRemarks'),
            cutPiece: formData.get('cutPiece'),
            cutPieceDone: formData.get('cutPieceDone'),
            cutPieceRemarks: formData.get('cutPieceRemarks')
        };
        
        // Heat Treatment Process
        data.heatTreatmentOperator = formData.get('heatTreatmentOperator');
        data.heatTreatmentProcess = {
            chargePrep: { in: formData.get('chargePrepIn'), out: formData.get('chargePrepOut'), remarks: formData.get('chargePrepRemarks') },
            preWashing: { in: formData.get('preWashingIn'), out: formData.get('preWashingOut'), remarks: formData.get('preWashingRemarks') },
            preHeating: { in: formData.get('preHeatingIn'), out: formData.get('preHeatingOut'), remarks: formData.get('preHeatingRemarks') },
            cht: { in: formData.get('chtIn'), out: formData.get('chtOut'), remarks: formData.get('chtRemarks') },
            postWashing: { in: formData.get('postWashingIn'), out: formData.get('postWashingOut'), remarks: formData.get('postWashingRemarks') },
            hardness: { in: formData.get('hardnessIn'), out: formData.get('hardnessOut'), remarks: formData.get('hardnessRemarks') },
            tempering: { in: formData.get('temperingIn'), out: formData.get('temperingOut'), remarks: formData.get('temperingRemarks') },
            shotBlasting: { in: formData.get('shotBlastingIn'), out: formData.get('shotBlastingOut'), remarks: formData.get('shotBlastingRemarks') }
        };
        
        // Final Inspection
        data.finalInspectionOperator = formData.get('finalInspectionOperator');
        data.finalInspection = {
            surfaceHardness: { specified: formData.get('surfaceHardnessSpec'), actual: formData.get('surfaceHardnessActual') },
            coreHardness: { specified: formData.get('coreHardnessSpec'), actual: formData.get('coreHardnessActual') },
            caseDepth: { specified: formData.get('caseDepthSpec'), actual: formData.get('caseDepthActual') }
        };
        
        // Quality Management
        data.remarks = formData.get('remarks');
        data.qmSignature = formData.get('qmSignature');
        
        return data;
    }

    updatePreview() {
        const preview = document.getElementById('jobCardPreview');
        const formData = new FormData(document.getElementById('jobCardForm'));
        
        if (!formData.get('customerName')) {
            preview.innerHTML = `
                <div class="preview-placeholder">
                    <i class="fas fa-eye"></i>
                    <p>Your job card preview will appear here</p>
                </div>
            `;
            return;
        }
        
        const jobCardData = this.extractFormData(formData);
        preview.innerHTML = this.generatePreviewHTML(jobCardData);
    }

    generatePreviewHTML(data) {
        const totalWeight = data.parts.reduce((sum, part) => sum + (part.totalWeight || 0), 0);
        
        return `
            <div class="job-card-preview-content">
                <!-- Company Header Table -->
                <div class="preview-company-header">
                    <table class="preview-header-table">
                        <tr>
                            <td class="preview-logo-cell" rowspan="5">
                                <div class="preview-logo-placeholder">
                                    <i class="fas fa-industry"></i>
                                    <span>JYOTI</span>
                                </div>
                            </td>
                            <td class="preview-company-details" rowspan="4" align="center">
                                <span class="preview-company-name">JYOTI HEAT TREATMENT PVT LTD</span><br>
                                Plot No. J-199, M.I.D.C, Bhosari, Pune-26<br>
                                Email: sales@jyotiht.com<br>
                                Mobile No.: 8888240351 / 8888140351
                            </td>
                            <td class="preview-doc-label">Doc. No.</td>
                            <td class="preview-doc-value">JHTPL/QA/F/04</td>
                        </tr>
                        <tr>
                            <td class="preview-doc-label">Rev Date</td>
                            <td class="preview-doc-value">01.01.2023</td>
                        </tr>
                        <tr>
                            <td class="preview-doc-label">Rev No.</td>
                            <td class="preview-doc-value">00/-</td>
                        </tr>
                    </table>
                </div>
                
                <div class="preview-header">
                    <h2>JOB CARD</h2>
                    <div class="preview-control-info">
                        <span>Charge: ${data.chargeNo || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="preview-parts">
                    <h4>Parts Information</h4>
                    <p><strong>Date:</strong> ${data.jobDate || 'N/A'}</p>
                    <p><strong>Customer:</strong> ${data.customerName || 'N/A'}</p>
                    <p><strong>SQF No:</strong> ${data.sqfNo || 'N/A'}</p>
                    
                    <div class="preview-parts-table">
                        ${data.parts.map(part => `
                            <div class="preview-part">
                                <span><strong>Part:</strong> ${part.partName}</span>
                                <span><strong>Weight:</strong> ${part.weight} KGS</span>
                                <span><strong>Qty:</strong> ${part.quantity}</span>
                                <span><strong>Total:</strong> ${part.totalWeight} KGS</span>
                            </div>
                        `).join('')}
                    </div>
                    <p><strong>Total Weight:</strong> ${totalWeight.toFixed(3)} KGS</p>
                </div>
                
                <div class="preview-inspection">
                    <h4>Incoming Inspection</h4>
                    <p><strong>Operator:</strong> ${data.incomingOperator || 'N/A'}</p>
                    <p><strong>Status:</strong> Inspection data recorded</p>
                </div>
                
                <div class="preview-process">
                    <h4>Heat Treatment Process</h4>
                    <p><strong>Operator:</strong> ${data.heatTreatmentOperator || 'N/A'}</p>
                    <p><strong>Status:</strong> Process data recorded</p>
                </div>
                
                <div class="preview-final">
                    <h4>Final Inspection</h4>
                    <p><strong>Operator:</strong> ${data.finalInspectionOperator || 'N/A'}</p>
                    <p><strong>Status:</strong> Inspection data recorded</p>
                </div>
                
                <div class="preview-quality">
                    <p><strong>Remarks:</strong> ${data.remarks || 'N/A'}</p>
                    <p><strong>Q.M. Signature:</strong> ${data.qmSignature || 'N/A'}</p>
                </div>
            </div>
        `;
    }

    renderJobCards() {
        const container = document.getElementById('jobCardsList');
        
        if (this.jobCards.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No job cards created yet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.jobCards.map((jobCard, index) => `
            <div class="job-card">
                <div class="job-card-header">
                    <div>
                        <div class="job-card-title">${jobCard.customerName || 'Customer'}</div>
                        <div class="job-card-company">${jobCard.companyName || 'Company'}</div>
                    </div>
                    <div class="job-card-date">${jobCard.jobDate || 'Date'}</div>
                </div>
                
                <div class="job-card-meta">
                    <div class="meta-item"><i class="fas fa-hashtag"></i> Charge: ${jobCard.chargeNo || 'N/A'}</div>
                    <div class="meta-item"><i class="fas fa-cog"></i> SQF: ${jobCard.sqfNo || 'N/A'}</div>
                    <div class="meta-item"><i class="fas fa-weight-hanging"></i> Total Weight: ${this.calculateTotalWeight(jobCard.parts)} KGS</div>
                    <div class="meta-item"><i class="fas fa-boxes"></i> Parts: ${jobCard.parts?.length || 0}</div>
                </div>
                
                <div class="job-card-parts">
                    <strong>Parts:</strong>
                    ${jobCard.parts?.map(part => `${part.partName} (${part.quantity})`).join(', ') || 'No parts specified'}
                </div>
                
                <div class="job-card-actions">
                    <button class="btn-edit" onclick="jobCardApp.editJobCard(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="jobCardApp.deleteJobCard(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    calculateTotalWeight(parts) {
        if (!parts || !Array.isArray(parts)) return 0;
        return parts.reduce((sum, part) => sum + (part.totalWeight || 0), 0).toFixed(3);
    }

    editJobCard(index) {
        this.currentEditIndex = index;
        const jobCard = this.jobCards[index];
        
        // Populate form with job card data
        this.populateForm(jobCard);
        
        // Update button text
        const submitBtn = document.querySelector('.btn-primary');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Job Card';
        
        this.showNotification('Editing job card...', 'info');
    }

    populateForm(jobCard) {
        // Company Information (static header - no need to populate)
        document.getElementById('chargeNo').value = jobCard.chargeNo || '';
        
        // Parts Information
        document.getElementById('jobDate').value = jobCard.jobDate || '';
        document.getElementById('customerName').value = jobCard.customerName || '';
        document.getElementById('sqfNo').value = jobCard.sqfNo || '';
        
        // Clear existing parts and add the ones from job card
        const partsContainer = document.getElementById('partsContainer');
        partsContainer.innerHTML = '';
        
        if (jobCard.parts && jobCard.parts.length > 0) {
            jobCard.parts.forEach((part, index) => {
                this.addPartEntry();
                const partNumber = index + 1;
                document.getElementById(`partName${partNumber}`).value = part.partName || '';
                document.getElementById(`weight${partNumber}`).value = part.weight || '';
                document.getElementById(`quantity${partNumber}`).value = part.quantity || '';
                document.getElementById(`totalWeight${partNumber}`).value = part.totalWeight || '';
            });
        } else {
            // Add at least one empty part entry
            this.addPartEntry();
        }
        
        // Incoming Inspection
        document.getElementById('incomingOperator').value = jobCard.incomingOperator || '';
        if (jobCard.incomingInspection) {
            this.populateInspectionData(jobCard.incomingInspection);
        }
        
        // Heat Treatment Process
        document.getElementById('heatTreatmentOperator').value = jobCard.heatTreatmentOperator || '';
        if (jobCard.heatTreatmentProcess) {
            this.populateProcessData(jobCard.heatTreatmentProcess);
        }
        
        // Final Inspection
        document.getElementById('finalInspectionOperator').value = jobCard.finalInspectionOperator || '';
        if (jobCard.finalInspection) {
            this.populateFinalInspectionData(jobCard.finalInspection);
        }
        
        // Quality Management
        document.getElementById('remarks').value = jobCard.remarks || '';
        document.getElementById('qmSignature').value = jobCard.qmSignature || '';
        
        this.updatePreview();
    }

    populateInspectionData(inspection) {
        // Populate radio buttons and remarks for incoming inspection
        Object.keys(inspection).forEach(key => {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'radio') {
                    const radio = document.querySelector(`[name="${key}"][value="${inspection[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    element.value = inspection[key] || '';
                }
            }
        });
    }

    populateProcessData(process) {
        // Populate process timing and remarks
        Object.keys(process).forEach(key => {
            const processData = process[key];
            if (processData) {
                const inElement = document.querySelector(`[name="${key}In"]`);
                const outElement = document.querySelector(`[name="${key}Out"]`);
                const remarksElement = document.querySelector(`[name="${key}Remarks"]`);
                
                if (inElement) inElement.value = processData.in || '';
                if (outElement) outElement.value = processData.out || '';
                if (remarksElement) remarksElement.value = processData.remarks || '';
            }
        });
    }

    populateFinalInspectionData(inspection) {
        // Populate final inspection data
        Object.keys(inspection).forEach(key => {
            const inspectionData = inspection[key];
            if (inspectionData) {
                const specElement = document.querySelector(`[name="${key}Spec"]`);
                const actualElement = document.querySelector(`[name="${key}Actual"]`);
                
                if (specElement) specElement.value = inspectionData.specified || '';
                if (actualElement) actualElement.value = inspectionData.actual || '';
            }
        });
    }

    deleteJobCard(index) {
        if (confirm('Are you sure you want to delete this job card?')) {
            this.jobCards.splice(index, 1);
            this.saveToLocalStorage();
            this.renderJobCards();
            this.showNotification('Job card deleted successfully!', 'success');
        }
    }

    clearForm() {
        document.getElementById('jobCardForm').reset();
        this.currentEditIndex = null;
        
        // Reset parts container to single entry
        const partsContainer = document.getElementById('partsContainer');
        partsContainer.innerHTML = `
            <div class="part-entry">
                <h4>Part 1</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label for="partName1">Part Name/No *</label>
                        <input type="text" id="partName1" name="partName1" placeholder="e.g., Sprocket B04082L" required>
                    </div>
                    <div class="form-group">
                        <label for="weight1">Weight (KGS)</label>
                        <input type="number" id="weight1" name="weight1" step="0.001" placeholder="e.g., 3.142">
                    </div>
                    <div class="form-group">
                        <label for="quantity1">Quantity</label>
                        <input type="text" id="quantity1" name="quantity1" placeholder="e.g., 56 NOS">
                    </div>
                    <div class="form-group">
                        <label for="totalWeight1">Total Weight (KGS)</label>
                        <input type="number" id="totalWeight1" name="totalWeight1" step="0.001" readonly>
                    </div>
                </div>
            </div>
        `;
        
        this.partCounter = 1;
        this.setupPartWeightCalculation(1);
        this.setDefaultDate();
        
        // Reset button text
        const submitBtn = document.querySelector('.btn-primary');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Create Job Card';
        
        this.updatePreview();
    }

    saveToLocalStorage() {
        localStorage.setItem('manufacturingJobCards', JSON.stringify(this.jobCards));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    exportJobCards() {
        const dataStr = JSON.stringify(this.jobCards, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'manufacturing-job-cards.json';
        link.click();
        
        this.showNotification('Job cards exported successfully!', 'success');
    }

    importJobCards(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    this.jobCards = importedData;
                    this.saveToLocalStorage();
                    this.renderJobCards();
                    this.showNotification('Job cards imported successfully!', 'success');
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                this.showNotification('Error importing job cards. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Global functions for HTML onclick handlers
function clearForm() {
    jobCardApp.clearForm();
}

function addPartEntry() {
    jobCardApp.addPartEntry();
}

// Initialize the application
let jobCardApp;
document.addEventListener('DOMContentLoaded', () => {
    jobCardApp = new ManufacturingJobCardApp();
    
    // Add export/import functionality to the header
    const header = document.querySelector('.header');
    
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-secondary';
    exportBtn.innerHTML = '<i class="fas fa-download"></i> Export';
    exportBtn.onclick = () => jobCardApp.exportJobCards();
    
    const importBtn = document.createElement('button');
    importBtn.className = 'btn btn-secondary';
    importBtn.innerHTML = '<i class="fas fa-upload"></i> Import';
    importBtn.onclick = () => document.getElementById('importFile').click();
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'importFile';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => {
        if (e.target.files.length > 0) {
            jobCardApp.importJobCards(e.target.files[0]);
        }
    };
    
    header.appendChild(exportBtn);
    header.appendChild(importBtn);
    document.body.appendChild(fileInput);
});
