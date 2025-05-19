import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { GroupService } from '../../services/group.service';
import { SmsModelService } from '../../services/model.service';
import { SmsService } from '../../services/sms.service';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';
import { PhonesService } from '../../services/phones.service';

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
  originalMessage: string;
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
    private phonesService: PhonesService,
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
      
      // Convert to JSON with raw values to preserve number formats
      this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log('Excel data loaded:', this.excelData);
    };
    
    reader.readAsArrayBuffer(file);
  }

  // Find variables in a string (like {{variable}})
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

  // Get matricule value from row data, handling both string and numeric formats
  getMatriculeFromRow(row: any): string | null {
    // Check for both capitalized and lowercase variants
    const matriculeValue = row['Matricule'] !== undefined ? row['Matricule'] : row['matricule'];
    
    // Return null if matricule is not found or empty
    if (matriculeValue === undefined || matriculeValue === null || matriculeValue === '') {
      return null;
    }
    
    // Convert to string to handle numeric matricules
    return matriculeValue.toString();
  }

  // Get telephone value from row data
  getTelephoneFromRow(row: any): string {
    // Check for both capitalized and lowercase variants
    const telephoneValue = row['Telephone'] !== undefined ? row['Telephone'] : row['telephone'];
    
    // Return empty string if telephone is not found or empty
    if (telephoneValue === undefined || telephoneValue === null || telephoneValue === '') {
      return '';
    }
    
    // Convert to string to ensure proper handling
    return telephoneValue.toString();
  }

  // Generate messages locally based on loaded Excel data
  generateMessagesLocally() {
    if (!this.selectedModelContent || this.excelData.length === 0) {
      return [];
    }
    
    const messages: GeneratedMessage[] = [];
    const missingMatricules: string[] = [];
    
    this.excelData.forEach((row, index) => {
      const matricule = this.getMatriculeFromRow(row);
      
      // Check if row has matricule
      if (!matricule) {
        missingMatricules.push(`Row ${index + 1}`);
        return;
      }
      
      const telephone = this.getTelephoneFromRow(row);
      
      // Replace variables in the template to create the original message
      const originalMessage = this.replaceVariables(this.selectedModelContent || '', row);
      
      // Create a modified message with salary information hidden
      let message = originalMessage;
      
      // Check if the message contains salary information
      // Look for patterns that might indicate salary values by looking for "Salaire" in the template
      const variables = this.findVariables(this.selectedModelContent || '');
      if (variables.some(v => v.toLowerCase().includes('salaire'))) {
        // Find the salary variable name
        const salaryVar = variables.find(v => v.toLowerCase().includes('salaire'));
        if (salaryVar && row[salaryVar]) {
          // Create a regex to find the salary value in the message
          const salaryValue = row[salaryVar].toString();
          const salaryPattern = new RegExp(salaryValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          
          // Replace the salary value with asterisks
          const asterisks = '*'.repeat(salaryValue.length);
          message = message.replace(salaryPattern, asterisks);
        }
      }
      
      messages.push({
        matricule,
        telephone,
        message,
        originalMessage, // Store the original message for sending
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
                // Apply the mapping to ensure we get the preferred phone number
                const mappedResponse = this.phonesService.mapPhoneResponse(response);
                
                // Map the fetched phone numbers to the corresponding messages
                mappedResponse.data.forEach((contact: any) => {
                  // Convert contact's matricule to string for safe comparison
                  const contactMatricule = contact.matricule.toString();
                  
                  // Find message with matching matricule (also as string)
                  const message = localMessages.find(msg => msg.matricule === contactMatricule);
                  if (message) {
                    // Use the telephone field which already contains the prioritized phone number
                    message.telephone = contact.telephone || '';
                  }
                });
  
                // After updating the phone numbers, set the messages
                this.generatedMessages = localMessages;
                this.isLoading = false;
                
                // Check and alert if any messages still don't have phone numbers
                const stillMissingPhones = localMessages.filter(msg => !msg.telephone);
                if (stillMissingPhones.length > 0) {
                  const missingMatricules = stillMissingPhones.map(msg => msg.matricule).join(', ');
                  alert(`Note: Certains numéros n'ont pas été trouvés pour les matricules: ${missingMatricules}`);
                }
              },
              error: (error) => {
                console.error('Error fetching phone numbers:', error);
                this.isLoading = false;
                this.handleApiError(error, 'Erreur lors de la récupération des numéros de téléphone');
              }
            });
          }
        } else {
          this.isLoading = false;
          alert('Aucun message n\'a pu être généré. Vérifiez vos données Excel.');
        }
      } catch (error) {
        console.error('Error generating messages locally:', error);
        this.isLoading = false;
        alert('Erreur lors de la génération des messages localement. Réessayez avec un autre fichier.');
        // Fall back to server-side generation if there's an error
        this.generateServerSideMessages();
      }
    } else {
      // If no Excel data loaded, use server-side generation
      this.generateServerSideMessages();
    }
  }
  
  // Server-side message generation
  generateServerSideMessages() {
    if (!this.excelFile) {
      this.isLoading = false;
      alert('Veuillez charger un fichier Excel');
      return;
    }
    
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
          // Process the returned messages to hide salary values
          const processedMessages = response.messages.map((msg: any) => {
            // Create a regex to find salary pattern (e.g., "900 D €", "850 D €")
            const salaryRegex = /(\d+(\.\d+)?\s*[^\s,\.]+\s*€)/g;
            const originalMessage = msg.message;
            const message = originalMessage.replace(salaryRegex, (match: string) => '*'.repeat(match.length));
            
            // Ensure matricule is treated as string
            const matricule = msg.matricule ? msg.matricule.toString() : '';
            
            return {
              ...msg,
              matricule,
              message: message,
              originalMessage: originalMessage
            };
          });
          
          this.generatedMessages = processedMessages;
          
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

    // Verify all messages have phone numbers
    const missingPhones = this.generatedMessages.filter(msg => !msg.telephone);
    if (missingPhones.length > 0) {
      const missingCount = missingPhones.length;
      const totalCount = this.generatedMessages.length;
      
      if (!confirm(`${missingCount} sur ${totalCount} messages n'ont pas de numéro de téléphone. Voulez-vous continuer à envoyer uniquement les messages avec numéros?`)) {
        return;
      }
      
      // Filter out messages without phone numbers
      const validMessages = this.generatedMessages.filter(msg => msg.telephone);
      this.generatedMessages = validMessages;
      
      if (this.generatedMessages.length === 0) {
        alert('Aucun message avec numéro de téléphone valide à envoyer');
        return;
      }
    }

    this.sending = true;
    this.responseMessage = '';

    try {
      let successCount = 0;
      let failCount = 0;
      
      for (const msg of this.generatedMessages) {
        if (!msg.telephone) continue; // Skip messages without phone numbers
        
        try {
          // Use originalMessage for sending instead of the displayed message with hidden salary
          await this.smsService.sendSMS(msg.telephone, msg.originalMessage, senderID, this.selectedModelId);
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
        // Keep the generated messages but mark them as sent
        this.generatedMessages = this.generatedMessages.map(msg => ({
          ...msg,
          sent: true
        }));
      } else {
        // Mark only the successfully sent messages
        this.generatedMessages = this.generatedMessages.map((msg, index) => ({
          ...msg,
          sent: index < successCount // Assuming messages are processed in order
        }));
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