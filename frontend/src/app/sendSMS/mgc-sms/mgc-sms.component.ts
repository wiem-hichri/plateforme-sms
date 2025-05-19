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
  telephone_personnel?: string;
  telephone_professionnel?: string;
  message: string;
  originalMessage: string;
  [key: string]: any;
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
  isGroupSelected = true;
  isLoading = false;
  missingPhoneContacts: string[] = [];

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

  readExcelFile(file: File) {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.excelData = XLSX.utils.sheet_to_json(worksheet);
      console.log('Excel data loaded:', this.excelData);
    };
    
    reader.readAsArrayBuffer(file);
  }

  findVariables(text: string): string[] {
    const regex = /{{([^{}]+)}}/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].trim());
    }
    
    return matches;
  }

  replaceVariables(template: string, rowData: any): string {
    let result = template;
    const variables = this.findVariables(template);
    
    variables.forEach(variable => {
      const variablePattern = new RegExp(`{{\\s*${variable}\\s*}}`, 'g');
      if (rowData.hasOwnProperty(variable)) {
        result = result.replace(variablePattern, rowData[variable].toString());
      }
    });
    
    return result;
  }

  getPhoneNumber(row: any): { telephone: string, telephone_professionnel: string, telephone_personnel: string } {
    // Extract phone numbers with various possible field names
    const telephone_professionnel = row['Telephone_professionnel'] || row['telephone_professionnel'] || row['TelephoneProfessionnel'] || '';
    const telephone_personnel = row['Telephone_personnel'] || row['telephone_personnel'] || row['TelephonePersonnel'] || '';
    const generic_telephone = row['Telephone'] || row['telephone'] || '';
    
    // Set the primary telephone to use (prioritize professional, then personal, then generic)
    const telephone = telephone_professionnel || telephone_personnel || generic_telephone || '';
    
    return {
      telephone,
      telephone_professionnel,
      telephone_personnel
    };
  }

  generateMessagesLocally() {
    if (!this.selectedModelContent || this.excelData.length === 0) {
      return [];
    }
    
    const messages: GeneratedMessage[] = [];
    const missingMatricules: string[] = [];
    this.missingPhoneContacts = [];
    
    this.excelData.forEach((row, index) => {
      if (!row['Matricule'] && !row['matricule']) {
        missingMatricules.push(`Row ${index + 1}`);
        return;
      }
      
      const matricule = row['Matricule'] || row['matricule'];
      const { telephone, telephone_professionnel, telephone_personnel } = this.getPhoneNumber(row);
      
      if (!telephone) {
        this.missingPhoneContacts.push(matricule);
      }
      
      const originalMessage = this.replaceVariables(this.selectedModelContent || '', row);
      let message = originalMessage;
      
      const variables = this.findVariables(this.selectedModelContent || '');
      if (variables.some(v => v.toLowerCase().includes('salaire'))) {
        const salaryVar = variables.find(v => v.toLowerCase().includes('salaire'));
        if (salaryVar && row[salaryVar]) {
          const salaryValue = row[salaryVar].toString();
          const salaryPattern = new RegExp(salaryValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          const asterisks = '*'.repeat(salaryValue.length);
          message = message.replace(salaryPattern, asterisks);
        }
      }
      
      messages.push({
        matricule,
        telephone,
        telephone_professionnel,
        telephone_personnel,
        message,
        originalMessage,
        ...row
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
  
    if (this.excelData.length > 0) {
      try {
        const localMessages = this.generateMessagesLocally();
        if (localMessages.length > 0) {
          const missingPhoneNumbers = localMessages.filter(msg => !msg.telephone);
  
          if (missingPhoneNumbers.length === 0 || !this.isGroupSelected) {
            // No missing phone numbers or group selection is not required, return local messages
            setTimeout(() => {
              this.generatedMessages = localMessages;
              this.isLoading = false;
            }, 500);
            return;
          } else {
            // If phone numbers are missing and group selection is required, fetch from service
            const matricules = missingPhoneNumbers.map(msg => msg.matricule);
  
            this.phonesService.getPhoneNumbersByMatricules(matricules).subscribe({
              next: (response) => {
                response.data.forEach((contact: any) => {
                  const message = localMessages.find(msg => msg.matricule === contact.matricule);
                  if (message) {
                    // Update the phone numbers based on what was fetched
                    message.telephone_professionnel = contact.telephone_professionnel || '';
                    message.telephone_personnel = contact.telephone_personnel || '';
                    // Set the primary telephone (with fallback to personal number)
                    message.telephone = contact.telephone_professionnel || contact.telephone_personnel || '';
                  }
                });
  
                this.generatedMessages = localMessages;
                
                const stillMissingPhones = localMessages.filter(msg => !msg.telephone);
                if (stillMissingPhones.length > 0) {
                  const missingMatricules = stillMissingPhones.map(msg => msg.matricule).join(', ');
                  alert(`Attention: Certains contacts n'ont pas de numéro de téléphone: ${missingMatricules}`);
                }
                
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
        this.isLoading = false;
      }
      // Don't continue with the HTTP request if we've already handled things locally
      return;
    }
  
    // Below is the fallback to server-side processing if needed
    const formData = new FormData();
    formData.append('file', this.excelFile);
    
    const url = this.selectedGroupId 
      ? `http://localhost:3000/api/models/messageConfidentiel/${this.selectedModelId}/${this.selectedGroupId}`
      : `http://localhost:3000/api/models/messageConfidentiel/${this.selectedModelId}`;

    this.http.post<any>(url, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'success') {
          const processedMessages = response.messages.map((msg: any) => {
            const salaryRegex = /(\d+(\.\d+)?\s*[^\s,\.]+\s*€)/g;
            const originalMessage = msg.message;
            const message = originalMessage.replace(salaryRegex, (match: string) => '*'.repeat(match.length));
            
            // Ensure phone number fallback logic is applied
            const telephone = msg.telephone_professionnel || msg.telephone_personnel || msg.telephone || '';
            
            return {
              ...msg,
              telephone,
              message: message,
              originalMessage: originalMessage
            };
          });
          
          this.generatedMessages = processedMessages;
          
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
        if (!msg.telephone) {
          failCount++;
          console.error(`Missing phone number for matricule: ${msg.matricule}`);
          continue;
        }
        
        try {
          await this.smsService.sendSMS(msg.telephone, msg.originalMessage, senderID, this.selectedModelId);
          successCount++;
        } catch (error) {
          failCount++;
          console.error('Error sending SMS:', error);
        }
      }

      this.responseMessage = failCount === 0
        ? `Tous les messages (${successCount}) ont été envoyés avec succès !`
        : `${successCount} messages envoyés avec succès. ${failCount} messages ont échoué.`;
      
      if (successCount === this.generatedMessages.length) {
        this.generatedMessages = [];
      }
    } catch (error) {
      this.responseMessage = "Erreur lors de l'envoi de certains messages.";
    } finally {
      this.sending = false;
    }
  }

  private handleApiError(error: any, defaultMessage: string): void {
    let errorMessage = defaultMessage;
    
    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        errorMessage += ': Endpoint non trouvé. Vérifiez la configuration du serveur.';
      }
      else if (error.error instanceof SyntaxError && error.error.message.includes('JSON')) {
        errorMessage += ': Réponse invalide du serveur. La route API peut être incorrecte.';
      }
      else if (error.error && error.error.message) {
        errorMessage += `: ${error.error.message}`;
      } else if (typeof error.error === 'string') {
        errorMessage += `: ${error.error}`;
      }
    }
    
    alert(errorMessage);
  }
}