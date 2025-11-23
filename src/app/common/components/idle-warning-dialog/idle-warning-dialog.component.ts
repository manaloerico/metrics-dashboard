import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-idle-warning-dialog',
  templateUrl: './idle-warning-dialog.component.html',
  styleUrls: ['./idle-warning-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class IdleWarningDialogComponent implements OnInit, AfterViewInit {
  private dialogData = inject(MAT_DIALOG_DATA);
  private dialog = inject(MatDialogRef<IdleWarningDialogComponent>);
  currenCount: number = this.dialogData?.countdown || 10;
  constructor() {}
  ngAfterViewInit(): void {
    const countDownTimer = setInterval(() => {
      console.log(
        this.currenCount + ' seconds remaining before session expires'
      );
      this.currenCount--;

      if (this.currenCount <= 0) {
        clearInterval(countDownTimer);
        this.dialog.close('SESSION_EXPIRED');
      }
    }, 1000);
  }

  ngOnInit() {}

  onResume() {
    this.dialog.close('SESSION_RESUME');
  }
}
