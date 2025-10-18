import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-add-edit-metric-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './add-edit-metric-detail-dialog.component.html',
  styleUrls: ['./add-edit-metric-detail-dialog.component.scss'],
})
export class AddEditMetricDetailDialogComponent implements OnInit {
  protected readonly fb = inject(FormBuilder);
  protected readonly dialog = inject(MatDialogRef);
  metricForm = this.fb.group({
    date: [new Date(), Validators.required],
    value: ['', [Validators.required, Validators.min(1)]],
  });

  constructor() {}

  ngOnInit() {}

  submitForm() {
    if (this.metricForm.valid) {
      const formData = this.metricForm.value;
      console.log('Form Data:', formData);
      this.dialog.close(formData);
    }
  }
}
