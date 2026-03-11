import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'uatz-app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  readonly currentRoleLabel = computed(() => {
    switch (this.currentUser()?.role) {
      case 'ADMIN':
        return 'Administrador';
      case 'OPERATOR':
        return 'Operador';
      case 'VENDOR':
        return 'Fornecedor';
      default:
        return 'Painel';
    }
  });

  logout() {
    this.authService.logout();
  }
}
