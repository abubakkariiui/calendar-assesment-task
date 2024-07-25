import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../shared/appointment.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="title">Title</label>
        <input id="title" type="text" formControlName="title" placeholder="Enter title">
        <div *ngIf="appointmentForm.get('title')?.hasError('required') && appointmentForm.get('title')?.touched">
          <small>Title is required</small>
        </div>
      </div>
      
      <div>
        <label for="date">Date</label>
        <input id="date" type="date" formControlName="date">
        <div *ngIf="appointmentForm.get('date')?.hasError('required') && appointmentForm.get('date')?.touched">
          <small>Date is required</small>
        </div>
      </div>

      <div>
        <label for="description">Description</label>
        <textarea id="description" formControlName="description" placeholder="Enter description"></textarea>
      </div>

      <button type="submit" [disabled]="appointmentForm.invalid">Submit</button>
    </form>

  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 300px;
      margin-bottom: 20px;
    }
    label {
      margin-bottom: 4px;
    }
    input, textarea {
      width: 100%;
      padding: 8px;
      margin-bottom: 8px;
      box-sizing: border-box;
    }
    button {
      align-self: flex-start;
      padding: 10px 20px;
    }
    small {
      color: red;
      font-size: 12px;
    }
  `]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit() {
    this.appointmentForm = this.fb.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      description: ['']
    });

    this.appointmentForm.valueChanges.subscribe(value => {
      console.log('Form value changed:', value);
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const appointment = {
        id: uuidv4(),
        ...this.appointmentForm.value,
        date: new Date(this.appointmentForm.value.date)
      };
      this.appointmentService.addAppointment(appointment);
      this.appointmentForm.reset();
    }
  }
}
