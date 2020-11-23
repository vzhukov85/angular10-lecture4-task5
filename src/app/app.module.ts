import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SubjectsModule } from './subjects/subjects.module';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, SubjectsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
