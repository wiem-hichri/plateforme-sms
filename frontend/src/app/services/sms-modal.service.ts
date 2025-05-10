import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SmsModalService {
  private showModalSubject = new BehaviorSubject<boolean>(false);
  public showModal$ = this.showModalSubject.asObservable();

  constructor(private router: Router) {}

  openModal() {
    this.showModalSubject.next(true);
  }

  closeModal() {
    this.showModalSubject.next(false);
  }

  goTo(method: 'direct' | 'advanced') {
    this.closeModal();
    const path = method === 'direct' ? '/send-message' : '/mgc-sms';
    this.router.navigateByUrl(path);
  }
}