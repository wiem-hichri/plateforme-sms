import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { GroupService } from '../../services/group.service';
import { SmsModelService } from '../../services/model.service';
import { SmsService } from '../../services/sms.service';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';
import { PhonesService } from '../../services/phones.service';  // Import the service

interface SmsModel {
  id: number;
  nom: string;
  contenu: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface GeneratedMessage {
  matricule: string;
  telephone: string;
  message: string;
  [key: string]: any; // For dynamic Excel columns
}

@Component({
  selector: 'app-mgc',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mgc-sms.component.html',
  styleUrls: ['./mgc-sms.component.scss']
})
export class MgcComponent implements OnInit {
  groups: any[] = [];
  models: SmsModel[] = [];
  selectedGroupId: number | null = null;
  selectedModelId: number | null = null;
  selectedModelContent: string | null = null;
  excelFile: File | null = null;
  excelData: any[] = [];
  generatedMessages: GeneratedMessage[] = [];
  sending = false;
  responseMessage = '';
  isGroupSelected = true; // Track if group is selected or "all contacts" option
  isLoading = false;

  constructor(
    private phonesService:PhonesService,
    private groupService: GroupService,
    private smsmodelService: SmsModelService,
    private smsService: SmsService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadModels();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe({
      next: (response) => {
        this.groups = Array.isArray(response) ? response : response.data ?? [];
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.handleApiError(error, 'Erreur lors du chargement des groupes');
      }
    });
  }

  loadModels() {
    this.smsmodelService.getAll().subscribe({
      next: (models) => {
        this.models = models;
      },
      error: (error) => {
        console.error('Error loading models:', error);
        this.handleApiError(error, 'Erreur lors du chargement des modèles');
      }
    });
  }

  onGroupChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'all') {
      this.selectedGroupId = null;
      this.isGroupSelected = false;
    } else {
      this.selectedGroupId = Number(value);
      this.isGroupSelected = true;
    }
  }

  onModelChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.selectedModelId = Number(value);
      // Find the selected model to display its content
      const selectedModel = this.models.find(model => model.id === this.selectedModelId);
      this.selectedModelContent = selectedModel?.contenu || null;
    } else {
      this.selectedModelId = null;
      this.selectedModelContent = null;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.excelFile = file;
      this.readExcelFile(file);
    }
  }

  // Process Excel file locally
  readExcelFile(file: File) {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      this.excelData = XLSX.utils.sheet_to_json(worksheet);
      console.log('Excel data loaded:', this.excelData);
    };
    
    reader.readAsArrayBuffer(file);
  }

  // Find variable pattern in a string (like {{variable}})
  findVariables(text: string): string[] {
    const regex = /{{([^{}]+)}}/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].trim());
    }
    
    return matches;
  }

  // Replace variables in a template with values from Excel data
  replaceVariables(template: string, rowData: any): string {
    let result = template;
    
    // Find all variables in the template
    const variables = this.findVariables(template);
    
    // Replace each variable with its value from Excel if available
    variables.forEach(variable => {
      const variablePattern = new RegExp(`{{\\s*${variable}\\s*}}`, 'g');
      
      // Check if the variable exists in the Excel data
      if (rowData.hasOwnProperty(variable)) {
        result = result.replace(variablePattern, rowData[variable].toString());
      }
    });
    
    return result;
  }

  // Generate messages locally based on loaded Excel data
  generateMessagesLocally() {
    if (!this.selectedModelContent || this.excelData.length === 0) {
      return [];
    }
    
    const messages: GeneratedMessage[] = [];
    const missingMatricules: string[] = [];
    
    this.excelData.forEach((row, index) => {
      // Check if row has matricule
      if (!row['Matricule'] && !row['matricule']) {
        missingMatricules.push(`Row ${index + 1}`);
        return;
      }
      
      const matricule = row['Matricule'] || row['matricule'];
      let telephone = row['Telephone'] || row['telephone'] || '';
      
      // Replace variables in the template
      const message = this.replaceVariables(this.selectedModelContent || '', row);
      
      messages.push({
        matricule,
        telephone,
        message,
        ...row // Keep all original data
      });
    });
    
    if (missingMatricules.length > 0) {
      alert(`Attention: Certaines lignes n'ont pas de matricule: ${missingMatricules.join(', ')}`);
    }
    
    return messages;
  }

  generateMessages() {
    if (!this.selectedModelId || !this.excelFile) {
      alert('Veuillez sélectionner un modèle et charger un fichier Excel');
      return;
    }
  
    this.isLoading = true;
  
    // Try local generation first if Excel data is loaded
    if (this.excelData.length > 0) {
      try {
        const localMessages = this.generateMessagesLocally();
        if (localMessages.length > 0) {
          // Check if any message is missing a phone number
          const missingPhoneNumbers = localMessages.filter(msg => !msg.telephone);
  
          if (missingPhoneNumbers.length === 0 || !this.isGroupSelected) {
            // No missing phone numbers, or we're in "all contacts" mode
            setTimeout(() => {
              this.generatedMessages = localMessages;
              this.isLoading = false;
            }, 500);
            return;
          } else {
            // Fetch missing phone numbers using matricule
            const matricules = missingPhoneNumbers.map(msg => msg.matricule);
  
            this.phonesService.getPhoneNumbersByMatricules(matricules).subscribe({
              next: (response) => {
                // Map the fetched phone numbers to the corresponding messages
                response.data.forEach((contact: any) => {
                  const message = localMessages.find(msg => msg.matricule === contact.matricule);
                  if (message) {
                    message.telephone = contact.telephone_professionnel; // Assign the phone number
                  }
                });
  
                // After updating the phone numbers, set the messages
                this.generatedMessages = localMessages;
                this.isLoading = false;
              },
              error: (error) => {
                console.error('Error fetching phone numbers:', error);
                this.isLoading = false;
                this.handleApiError(error, 'Erreur lors de la récupération des numéros de téléphone');
              }
            });
          }
        }
      } catch (error) {
        console.error('Error generating messages locally:', error);
        // Fall back to server-side generation if there's an error
      }
    }
  

    // Server-side generation (fallback)
    const formData = new FormData();
    formData.append('file', this.excelFile);
    
    // If group is not selected, pass only the model ID
    const url = this.selectedGroupId 
      ? `http://localhost:3000/api/models/messageConfidentiel/${this.selectedModelId}/${this.selectedGroupId}`
      : `http://localhost:3000/api/models/messageConfidentiel/${this.selectedModelId}`;

    this.http.post<any>(url, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'success') {
          this.generatedMessages = response.messages;
          
          // Display warnings about any errors with matricules
          if (response.erreursMatricules && response.erreursMatricules.length > 0) {
            const errorMsg = `Note: Certains matricules n'ont pas été trouvés: ${response.erreursMatricules.join(', ')}`;
            alert(errorMsg);
          }
        } else {
          alert('Erreur lors de la génération des messages: ' + response.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.handleApiError(error, 'Erreur lors de la génération des messages');
      }
    });
  }

  async sendMessages() {
    if (this.generatedMessages.length === 0) {
      alert('Aucun message à envoyer');
      return;
    }

    const senderID = this.authService.getCurrentUserId();
    if (!senderID) {
      this.responseMessage = "Utilisateur non authentifié.";
      return;
    }

    this.sending = true;
    this.responseMessage = '';

    try {
      let successCount = 0;
      let failCount = 0;
      
      for (const msg of this.generatedMessages) {
        try {
          await this.smsService.sendSMS(msg.telephone, msg.message, senderID, this.selectedModelId);
          successCount++;
        } catch (error) {
          failCount++;
          console.error('Error sending SMS:', error);
        }
      }

      if (failCount === 0) {
        this.responseMessage = `Tous les messages (${successCount}) ont été envoyés avec succès !`;
      } else {
        this.responseMessage = `${successCount} messages envoyés avec succès. ${failCount} messages ont échoué.`;
      }
      
      // Optionally clear the list after sending
      if (successCount === this.generatedMessages.length) {
        this.generatedMessages = [];
      }
    } catch (error) {
      this.responseMessage = "Erreur lors de l'envoi de certains messages.";
    } finally {
      this.sending = false;
    }
  }

  // Helper method to handle API errors consistently
  private handleApiError(error: any, defaultMessage: string): void {
    let errorMessage = defaultMessage;
    
    if (error instanceof HttpErrorResponse) {
      // Check if it's a 404
      if (error.status === 404) {
        errorMessage += ': Endpoint non trouvé. Vérifiez la configuration du serveur.';
      }
      // Check if it's a JSON parsing error (which happens when HTML is returned instead of JSON)
      else if (error.error instanceof SyntaxError && error.error.message.includes('JSON')) {
        errorMessage += ': Réponse invalide du serveur. La route API peut être incorrecte.';
      }
      // Try to extract the error message from the response
      else if (error.error && error.error.message) {
        errorMessage += `: ${error.error.message}`;
      } else if (typeof error.error === 'string') {
        errorMessage += `: ${error.error}`;
      }
    }
    
    alert(errorMessage);
  }
}