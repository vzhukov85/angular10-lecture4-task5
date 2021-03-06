import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { JournalUpdate, LessonDate, SubjectElement, SubjectService } from 'src/app/services/subject.service';
import {
  Result,
  StudentGradesService,
  StudentsGrades
} from '../../services/student-grades.service';

export interface DateColumns {
  date: Date;
  colDef: string;
  count: number;
}

@Component({
  selector: 'students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.css'],
})
export class StudentsTableComponent implements OnInit, JournalUpdate {
  studentsGrades: MatTableDataSource<StudentsGrades>;
  subjects: SubjectElement[];

  fullColumnDefs: string[] = [];
  startDatesColumnDefs: string[] = [];
  endDatesColumnDefs: string[] = [];
  subjectColumnTitle: string[] = [];
  homeworkColumnDefs: string[] = [];
  lessonColumnDefs: string[] = [];
  lessonDates: DateColumns[] = [];
  startHomeworkDates: DateColumns[] = [];
  endHomeworkDates: DateColumns[] = [];

  lessonStartDate: Date;
  lessonEndDate: Date;
  interviewStartDate: Date;
  interviewEndDate: Date;
  finalExamStartDate: Date;
  finalExamEndDate: Date;

  public ResultEnum = Result;

  constructor(
    private studentsGradesSrv: StudentGradesService,
    private subjectSrv: SubjectService
  ) {
    this.subjectSrv.setJournalCallback(this);
    this.updateColumns();
  }

  ngOnInit(): void {}

  updateColumns(): void {
    this.subjects = this.subjectSrv.subjects;
    this.fillHeaderDates();
    this.subjectColumnTitle = this.getSubjectColumnTitle();
    this.lessonColumnDefs = this.columnDefs('lesson');
    this.homeworkColumnDefs = this.columnDefs('homework');
    this.fullColumnDefs = this.getFullColumnDefs();
    this.startDatesColumnDefs = this.getStartDatesColumnDefs();
    this.endDatesColumnDefs = this.getEndDatesColumnDefs();

    this.reloadStudents();
  }

  private fillHeaderDates(): void {
    const lessonDates = this.subjectSrv.lessonDates;
    const firstDate = lessonDates[0].date;
    const lastDate = lessonDates[lessonDates.length - 1].date;
    this.fillLessonDates(lessonDates);
    this.fillHomeworkDates(lessonDates);

    this.lessonStartDate = firstDate;
    this.lessonEndDate = lastDate;
    this.interviewStartDate = this.addDays(firstDate, 14);
    this.interviewEndDate = this.addDays(lastDate, 7);
    if (this.interviewStartDate.getTime() > this.interviewEndDate.getTime()) {
      this.interviewStartDate = this.interviewEndDate;
    }
    this.finalExamStartDate = this.addDays(lastDate, 7);
    this.finalExamEndDate = this.addDays(lastDate, 7);
  }

  private getSubjectColumnTitle(): Array<string> {
    const lessonNames = [];
    this.subjects.forEach((element) => {
      lessonNames.push(element.topic);
    });
    return lessonNames;
  }

  private getFullColumnDefs(): string[] {
    let columnDefs = [];
    columnDefs.push('fio');
    columnDefs = columnDefs.concat(this.lessonColumnDefs);
    columnDefs.push('absence-rate-info');
    columnDefs = columnDefs.concat(this.homeworkColumnDefs);
    columnDefs.push('total-count-homework');
    columnDefs.push('total-grades');
    columnDefs.push('interview-min-val');
    columnDefs.push('interview-total-grades');
    columnDefs.push('max-total-grades');
    columnDefs.push('percent-lecture');
    columnDefs.push('percent-homework');
    columnDefs.push('final-exam-min');
    columnDefs.push('result');
    columnDefs.push('delete');
    return columnDefs;
  }

  private fillLessonDates(dates: LessonDate[]): void {
    this.lessonDates = [];
    let count = 0;
    dates.forEach((element) => {
      this.lessonDates.push({
        date: element.date,
        colDef: 'lesson-date-' + count++,
        count: element.count,
      });
    });
  }

  private fillHomeworkDates(dates: LessonDate[]): void {
    this.startHomeworkDates = [];
    this.endHomeworkDates = [];
    let count = 0;
    dates.forEach((element) => {
      this.startHomeworkDates.push({
        date: element.date,
        colDef: 'start-homework-date-' + count,
        count: element.count,
      });
      this.endHomeworkDates.push({
        date: this.addDays(element.date, 7),
        colDef: 'end-homework-date-' + count++,
        count: element.count,
      });
    });
  }

  private addDays(date: Date, days: number): Date {
    const nextWeek = new Date(date.valueOf());
    nextWeek.setDate(nextWeek.getDate() + days);
    return nextWeek;
  }

  private getStartDatesColumnDefs(): string[] {
    const columnDefs = [];
    columnDefs.push('fio');
    this.lessonDates.forEach((element) => {
      columnDefs.push('start-' + element.colDef);
    });
    columnDefs.push('absence-rate-start-date');
    this.startHomeworkDates.forEach((element) => {
      columnDefs.push(element.colDef);
    });
    columnDefs.push('interview-start-date');
    columnDefs.push('final-exam-start-date');
    return columnDefs;
  }

  private getEndDatesColumnDefs(): string[] {
    const columnDefs = [];
    columnDefs.push('fio');
    this.lessonDates.forEach((element) => {
      columnDefs.push('end-' + element.colDef);
    });
    columnDefs.push('absence-rate-end-date');
    this.endHomeworkDates.forEach((element) => {
      columnDefs.push(element.colDef);
    });
    columnDefs.push('interview-end-date');
    columnDefs.push('percent-lecture-min');
    columnDefs.push('percent-homework-min');
    columnDefs.push('final-exam-end-date');
    return columnDefs;
  }

  private columnDefs(prefix: string): string[] {
    const columns = [];
    let count = 0;
    this.subjects.forEach((element) => {
      columns.push(prefix + count++);
    });
    return columns;
  }

  recalcGrades(element: StudentsGrades, index: number): void {
    this.studentsGradesSrv.recalc(element, index);
    this.reloadStudents();
  }

  delete(index: number): void {
    this.studentsGradesSrv.delete(index);
    this.reloadStudents();
  }

  addItem(): void {
    this.studentsGradesSrv.addStudent();
    this.reloadStudents();
  }

  reloadStudents(): void {
    this.studentsGrades = new MatTableDataSource(this.studentsGradesSrv.studentsGrades);
  }

  changeValue(element: StudentsGrades, index: number): void {
    this.studentsGradesSrv.updateItem(element, index);
  }
}
