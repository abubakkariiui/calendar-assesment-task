import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { AppointmentService } from '../shared/appointment.service';
import { Appointment } from '../shared/appointment.model';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, AppointmentFormComponent],
  template: `
    <div class="calendar-container">
      <div class="form-container">
        <app-appointment-form></app-appointment-form>
      </div>
      <div class="calendar-wrapper">
        <full-calendar #calendar [options]="calendarOptions"></full-calendar>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      display: flex;
      flex-direction: row;
      padding: 20px;
      gap: 20px;
      justify-content: center;
    }
    .form-container {
      flex: 0 0 300px;
    }
    .calendar-wrapper {
      flex: 0 1 800px;
      max-width: 800px;
    }
    ::ng-deep .fc {
      max-width: 100%;
      font-size: 0.9em;
    }
  `]
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    editable: true,
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    events: []
  };

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.appointmentService.appointments$.subscribe(appointments => {
      this.updateEvents(appointments);
    });
  }

  updateEvents(appointments: Appointment[]) {
    if (this.calendarComponent && this.calendarComponent.getApi()) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      appointments.forEach(appointment => {
        calendarApi.addEvent({
          id: appointment.id,
          title: appointment.title,
          start: appointment.date,
          description: appointment.description
        });
      });
    }
  }

  handleEventClick(info: { event: EventApi }) {
    if (confirm(`Are you sure you want to delete the event '${info.event.title}'`)) {
      this.appointmentService.deleteAppointment(info.event.id);
    }
  }

  handleEventDrop(info: { event: EventApi, oldEvent: EventApi }) {
    const updatedAppointment: Appointment = {
      id: info.event.id,
      title: info.event.title,
      date: info.event.start as Date,
      description: info.event.extendedProps['description'] as string
    };
    this.appointmentService.updateAppointment(updatedAppointment);
  }
}