import { Injectable } from '@angular/core';
import { SubjectElement, SubjectService } from './subject.service';

export interface StudentsGrades {
  fio: string;
  lectureGrades: Array<number>;
  absenceRate: number;
  homeworkGrades: Array<number>;
  totalCountHomeworks: number;
  totalGrades: number;
  interview: number;
  interviewTotalGrades: number;
  percentLecture: number;
  percentHomework: number;
  finalExam: number;
  result: Result;
}

export enum Result {
  PASS = 'Зачет',
  NOT_PASS = 'Не зачет',
  DISMISS = 'Отчислен',
}

const GRADES: StudentsGrades[] = [
  {
    fio: 'Иванов Иван Иванович',
    lectureGrades: [1, 1, 1, 1, 0, 0],
    absenceRate: 4,
    homeworkGrades: [4, 5, 5, 5, 0, 0],
    totalCountHomeworks: 4,
    totalGrades: 19,
    interview: 60,
    interviewTotalGrades: 38,
    percentLecture: 0.6,
    percentHomework: 0.6,
    finalExam: 0,
    result: Result.PASS,
  },
];

export const SUBJECTS = [
  {
    position: 1,
    dateSubject: new Date('2020-11-07'),
    topic: 'Урок 1',
    homework: '',
    notice: '',
  },
  {
    position: 2,
    dateSubject: new Date('2020-11-07'),
    topic: 'Урок 2',
    homework: '',
    notice: '',
  },
  {
    position: 3,
    dateSubject: new Date('2020-11-14'),
    topic: 'Урок 3',
    homework: '',
    notice: '',
  },
  {
    position: 4,
    dateSubject: new Date('2020-11-14'),
    topic: 'Урок 4',
    homework: '',
    notice: '',
  },
  {
    position: 5,
    dateSubject: new Date('2020-11-21'),
    topic: 'Урок 5',
    homework: '',
    notice: '',
  },
  {
    position: 6,
    dateSubject: new Date('2020-11-21'),
    topic: 'Урок 6',
    homework: '',
    notice: '',
  },
];

@Injectable({
  providedIn: 'root',
})
export class StudentGradesService {

  studentsGrades: Array<StudentsGrades> = [];

  constructor(private subjectSrv: SubjectService) {
    this.studentsGrades = GRADES;
    this.addStudent();
    if (this.studentsGrades === [] || this.studentsGrades) {
      console.log('empty studentsGrades');
      localStorage.setItem('studentsGrades', JSON.stringify(GRADES));
    } else {
      console.log(' studentsGrades = ', this.studentsGrades);
    }
    this.studentsGrades.forEach((item) => {
      this.recalcByElem(item);
    });
  }

  // get studentsGrades(): StudentsGrades[] {
  //   // const res = JSON.parse(localStorage.getItem('studentsGrades'));
  //   // console.log(res);
  //   // return res;
  //   return GRADES;
  // }

  addStudent(): void {

    const lectureGrades: number[] = [];
    const homeworkGrades: number[] = [];

    SUBJECTS.forEach(element => {
      lectureGrades.push(0);
      homeworkGrades.push(0);
    });

    const student: StudentsGrades = {
      fio: '',
      lectureGrades,
      absenceRate: 0,
      homeworkGrades,
      totalCountHomeworks: 0,
      totalGrades: 0,
      interview: 0,
      interviewTotalGrades: 0,
      percentLecture: 0,
      percentHomework: 0,
      finalExam: 0,
      result: null,
    };

    this.recalcByElem(student);
    this.studentsGrades.push(student);
    console.log('addStudent: ', this.studentsGrades);
  }

  addSubject(subject: SubjectElement, index: number): void {}

  deleteSubject(subject: SubjectElement): void {}

  get subjectColumns(): Array<string> {
    const lessonNames = [];
    SUBJECTS.forEach(element => {
      lessonNames.push(element.topic);
    });
    return lessonNames;
  }

  recalc(index: number): void {
    const grades: StudentsGrades = this.studentsGrades[index];
    this.recalcByElem(grades);
  }

  recalcByElem(grades: StudentsGrades): void {
    this.recalcAbsentRate(grades);
    this.recalcHomeworks(grades);
    this.recalcInteview(grades);
    this.recalcFinal(grades);
  }

  delete(index: number): void {
    console.log('before delete.studentsGrades: ', this.studentsGrades);
    this.studentsGrades.splice(index, 1);
    console.log('after delete.studentsGrades: ', this.studentsGrades);
  }

  private recalcAbsentRate(grades: StudentsGrades): void {
    grades.absenceRate = 0;
    grades.lectureGrades.forEach((val) => {
      if (val > 0) {
        ++grades.absenceRate;
      }
    });
    grades.percentLecture = grades.absenceRate / grades.lectureGrades.length;
  }

  private recalcHomeworks(grades: StudentsGrades): void {
    grades.totalCountHomeworks = 0;
    grades.totalGrades = 0;
    grades.homeworkGrades.forEach((val) => {
      if (val > 0) {
        ++grades.totalCountHomeworks;
        grades.totalGrades += val;
      }
    });
    grades.percentHomework = grades.totalCountHomeworks / grades.homeworkGrades.length;
  }

  private recalcInteview(grades: StudentsGrades): void {
    grades.interviewTotalGrades = grades.totalGrades;
    if (grades.interview >= 60) {
      grades.interviewTotalGrades *= 2;
    }
  }

  private recalcFinal(grades: StudentsGrades): void {
    grades.finalExam = grades.interviewTotalGrades / 100;
  }



}
