import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome-container">
      <!-- Background decorative elements -->
      <div class="bg-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
      
      <!-- Main content -->
      <div class="content">
        <div class="logo-section">
          <div class="logo-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4L3 11L10 13M20 4L13 21L10 13M20 4L10 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <h1 class="main-title">Bienvenue</h1>
        <h2 class="sub-title">À Lumière Messagerie</h2>
        
        <div class="description">
          <p>Découvrez une nouvelle façon de communiquer avec élégance et simplicité</p>
        </div>
        
        
      </div>
      
      <!-- Bottom wave decoration -->
      <div class="wave-decoration">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="rgba(255, 165, 0, 0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,186.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&family=Inter:wght@400;500;600&display=swap');
    
    .welcome-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #fff5f0 0%, #ffffff 50%, #fff8f0 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .bg-decoration {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
    
    .circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(45deg, rgba(255, 165, 0, 0.1), rgba(255, 140, 0, 0.05));
      animation: float 6s ease-in-out infinite;
    }
    
    .circle-1 {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -100px;
      animation-delay: 0s;
    }
    
    .circle-2 {
      width: 200px;
      height: 200px;
      bottom: -100px;
      left: -50px;
      animation-delay: 2s;
    }
    
    .circle-3 {
      width: 150px;
      height: 150px;
      top: 50%;
      right: 10%;
      animation-delay: 4s;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    .content {
      text-align: center;
      z-index: 2;
      max-width: 800px;
      padding: 2rem;
      position: relative;
    }
    
    .logo-section {
      margin-bottom: 2rem;
    }
    
    .logo-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #ff6b35, #ff8c42);
      border-radius: 50%;
      color: white;
      box-shadow: 0 20px 40px rgba(255, 107, 53, 0.3);
      margin-bottom: 1rem;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 20px 40px rgba(255, 107, 53, 0.3); }
      50% { transform: scale(1.05); box-shadow: 0 25px 50px rgba(255, 107, 53, 0.4); }
      100% { transform: scale(1); box-shadow: 0 20px 40px rgba(255, 107, 53, 0.3); }
    }
    
    .main-title {
      font-family: 'Poppins', sans-serif;
      font-size: clamp(3.5rem, 8vw, 7rem);
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #ff6b35, #ff8c42, #ffa726);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 8px rgba(255, 107, 53, 0.1);
      letter-spacing: -0.02em;
      line-height: 0.9;
      margin-bottom: 0.5rem;
      animation: slideInUp 1s ease-out;
    }
    
    .sub-title {
      font-family: 'Inter', sans-serif;
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      font-weight: 500;
      color: #666;
      margin: 0 0 2rem 0;
      letter-spacing: 0.5px;
      animation: slideInUp 1s ease-out 0.2s both;
    }
    
    .description {
      margin-bottom: 3rem;
      animation: slideInUp 1s ease-out 0.4s both;
    }
    
    .description p {
      font-family: 'Inter', sans-serif;
      font-size: 1.2rem;
      color: #777;
      line-height: 1.6;
      margin: 0;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      animation: slideInUp 1s ease-out 0.6s both;
    }
    
    .btn-primary, .btn-secondary {
      font-family: 'Inter', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      padding: 1rem 2.5rem;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      min-width: 160px;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #ff6b35, #ff8c42);
      color: white;
      box-shadow: 0 15px 30px rgba(255, 107, 53, 0.3);
    }
    
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 20px 40px rgba(255, 107, 53, 0.4);
      background: linear-gradient(135deg, #ff5722, #ff7043);
    }
    
    .btn-secondary {
      background: white;
      color: #ff6b35;
      border: 2px solid #ff6b35;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .btn-secondary:hover {
      transform: translateY(-3px);
      background: #ff6b35;
      color: white;
      box-shadow: 0 15px 30px rgba(255, 107, 53, 0.3);
    }
    
    .wave-decoration {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      overflow: hidden;
    }
    
    .wave-decoration svg {
      width: 100%;
      height: 100%;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .content {
        padding: 1rem;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .btn-primary, .btn-secondary {
        width: 100%;
        max-width: 280px;
      }
      
      .circle-1, .circle-2, .circle-3 {
        opacity: 0.5;
      }
    }
    
    @media (max-width: 480px) {
      .logo-icon {
        width: 80px;
        height: 80px;
      }
      
      .logo-icon svg {
        width: 40px;
        height: 40px;
      }
    }
  `]
})
export class WelcomeComponent {
  constructor() {}
}