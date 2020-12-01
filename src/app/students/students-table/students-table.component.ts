import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { SubjectService } from 'src/app/services/subject.service';
import {
  Result,
  StudentGradesService,
  StudentsGrades,
  SUBJECTS,
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
export class StudentsTableComponent implements OnInit {
  studentsGrades: MatTableDataSource<StudentsGrades>;

  fullColumnDefs: string[] = [];
  startDatesColumnDefs: string[] = [];
  endDatesColumnDefs: string[] = [];
  subjectColumnTitle: string[] = [];
  homeworkColumnDefs: string[] = [];
  lessonColumnDefs: string[] = [];
  lessonDates: DateColumns[] = [
    { date: new Date('2020-11-07'), colDef: 'lesson-date-1', count: 2 },
    { date: new Date('2020-11-14'), colDef: 'lesson-date-2', count: 2 },
    { date: new Date('2020-11-21'), colDef: 'lesson-date-3', count: 2 },
  ];
  startHomeworkDates: DateColumns[] = [
    { date: new Date('2020-11-07'), colDef: 'start-homework-date-1', count: 2 },
    { date: new Date('2020-11-14'), colDef: 'start-homework-date-2', count: 2 },
    { date: new Date('2020-11-21'), colDef: 'start-homework-date-3', count: 2 },
  ];
  endHomeworkDates: DateColumns[] = [
    { date: new Date('2020-11-07'), colDef: 'end-homework-date-1', count: 2 },
    { date: new Date('2020-11-14'), colDef: 'end-homework-date-2', count: 2 },
    { date: new Date('2020-11-21'), colDef: 'end-homework-date-3', count: 2 },
  ];

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
    this.reloadStudents();
    console.log('students: ', this.studentsGrades);
    this.resetColumns();
  }

  ngOnInit(): void {}

  private resetColumns(): void {
    //TODO заполнение
    this.lessonStartDate = new Date('2020-11-07');
    this.lessonEndDate = new Date('2020-11-29');
    this.interviewStartDate = new Date('2020-11-07');
    this.interviewEndDate = new Date('2020-12-12');
    this.finalExamStartDate = new Date('2020-11-07');
    this.finalExamEndDate = new Date('2020-11-07');

    this.subjectColumnTitle = this.getSubjectColumnTitle();
    this.lessonColumnDefs = this.columnDefs('lesson');
    this.homeworkColumnDefs = this.columnDefs('homework');
    this.fullColumnDefs = this.getFullColumnDefs();
    this.startDatesColumnDefs = this.getStartDatesColumnDefs();
    this.endDatesColumnDefs = this.getEndDatesColumnDefs();
  }

  private getSubjectColumnTitle(): Array<string> {
    const lessonNames = [];
    SUBJECTS.forEach((element) => {
      lessonNames.push(element.topic);
    });
    console.log('subjectColumnTitle: ', lessonNames);
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
    console.log(columnDefs);
    return columnDefs;
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
    SUBJECTS.forEach((element) => {
      columns.push(prefix + count++);
    });
    return columns;
  }

  recalcGrades(index: number): void {
    this.studentsGradesSrv.recalc(index);
    this.reloadStudents();
  }

  delete(index: number): void {
    console.log('remove index=', index);
    this.studentsGradesSrv.delete(index);
    this.reloadStudents();
  }

  addItem(): void {
    this.studentsGradesSrv.addStudent();
    this.reloadStudents();
    console.log('addItem: ', this.studentsGrades);
  }

  reloadStudents(): void {
    this.studentsGrades = new MatTableDataSource(
      this.studentsGradesSrv.studentsGrades
    );
    this.studentsGrades._updateChangeSubscription();
  }
}
