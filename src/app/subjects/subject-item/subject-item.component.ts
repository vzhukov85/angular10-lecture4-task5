import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { SubjectTableComponent } from '../subject-table/subject-table.component';
import { SubjectElement, SubjectService } from '../../services/subject.service';

@Component({
  selector: 'subject-item',
  templateUrl: './subject-item.component.html',
  styleUrls: ['./subject-item.component.css'],
})
export class SubjectItemComponent implements OnInit {
  position = new FormControl('', [Validators.required]);
  dateSubject = new FormControl('', [Validators.required]);
  topic = new FormControl('', [Validators.required]);
  homework = new FormControl('', [Validators.required]);
  notice = new FormControl('');

  @Input() parent: SubjectTableComponent;

  elementExist = false;
  buttonText = '';

  constructor(
    private dateAdapter: DateAdapter<any>,
    private subjectSrv: SubjectService
  ) {
    this.dateAdapter.setLocale('ru');
    this.updateButtonText();
  }

  addElement(): void {
    const element: SubjectElement = {
      position: this.position.value,
      dateSubject: this.dateSubject.value,
      topic: this.topic.value,
      homework: this.homework.value,
      notice: this.notice.value,
    };
    console.log('add element', element);
    this.subjectSrv.addElement(element);
    this.parent.reloadSubjects();
    this.elementExist = true;
    this.updateButtonText();
  }

  checkExist(): void {
    this.elementExist = false;
    this.subjectSrv.subjects.forEach(item => {
      if (item.position === this.position.value) {
        this.elementExist = true;
        return;
      }
    });
    this.updateButtonText();
  }

  private updateButtonText(): void {
    if (this.elementExist) {
      this.buttonText = 'Изменить';
    } else {
      this.buttonText = 'Добавить';
    }
  }

  selectElement(element: SubjectElement): void {
    this.position.setValue(element.position);
    this.dateSubject.setValue(element.dateSubject);
    this.topic.setValue(element.topic);
    this.homework.setValue(element.homework);
    this.notice.setValue(element.notice);
    this.elementExist = true;
    this.updateButtonText();
  }

  clean(): void {
    this.position.setValue(null);
    this.dateSubject.setValue(null);
    this.topic.setValue(null);
    this.homework.setValue(null);
    this.notice.setValue(null);
    this.elementExist = false;
    this.updateButtonText();
  }

  ngOnInit(): void {}
}
