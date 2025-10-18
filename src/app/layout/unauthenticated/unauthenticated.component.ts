import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-unauthenticated',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './unauthenticated.component.html',
  styleUrls: ['./unauthenticated.component.scss'],
})
export class UnauthenticatedComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
