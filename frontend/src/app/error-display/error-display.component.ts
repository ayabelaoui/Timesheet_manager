import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.css'
})
export class ErrorDisplayComponent {
  @Input() errors: Record<string, string> | null = null;

}
