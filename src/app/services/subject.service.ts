import { Injectable } from '@angular/core';

export interface SubjectElement {
  position: number;
  dateSubject: Date;
  topic: string;
  homework: string;
  notice: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  constructor() {
    if (this.subjects === null) {
      localStorage.setItem('subjects', JSON.stringify([]));
    }
  }

  addElement(element: SubjectElement): void {
    const subjects: SubjectElement[] = this.subjects;
    this.updateSubjects(subjects, element);
    this.sortSubjects(subjects);
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }

  private sortSubjects(subjects: SubjectElement[]): void {
    subjects.sort((t1, t2) => {
      if (t1.position > t2.position) {
        return 1;
      }
      if (t1.position < t2.position) {
        return -1;
      }
      return 0;
    });
  }

  private updateSubjects(subjects: SubjectElement[], element: SubjectElement): void {
    let isExist = false;
    subjects.forEach((item, index) => {
      if (item.position === element.position) {
        subjects[index] = element;
        isExist = true;
      }
    });
    if (!isExist) {
      subjects.push(element);
    }
  }

  get subjects(): SubjectElement[] {
    return JSON.parse(localStorage.getItem('subjects'));
  }

  delete(element: SubjectElement): void {
    const subjects = JSON.parse(localStorage.getItem('subjects'));
    const filteredSubjects = subjects.filter((item) => {
      return item.position !== element.position;
    });
    console.log(filteredSubjects);
    localStorage.setItem('subjects', JSON.stringify(filteredSubjects));
  }

}
