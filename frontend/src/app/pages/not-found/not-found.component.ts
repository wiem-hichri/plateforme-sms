import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-not-found',
  template: `
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="text-xl text-gray-600 mt-4">Oops! Page Not Found</p>
      <a routerLink="/" class="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
        Go to Dashboard
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
