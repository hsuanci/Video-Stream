import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  @ViewChild('fileInput', { static: false })
  inputfile: ElementRef;

  title = 'front';
  progress: number = 0;
  videoLink: string;
  file: File;

  constructor(private http: HttpClient) { }

  onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    if (element.files.length > 0) {
      if (this.isMP4(element.files[0])) {
        this.file = element.files[0];

        return
      }

      this.inputfile.nativeElement.value = "";
      alert('Only MP4 Input !');
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('file', this.file, this.file.name);

    this.http
      .post('https://localhost:5001/video', formData, {
        reportProgress: true,
        observe: 'events'
      })
      .subscribe((data: any) => {
        if (data.type === HttpEventType.UploadProgress) {
          this.progress = (data.loaded / data.total) * 100;
        }
        if (data.type === HttpEventType.Response) {
          this.videoLink = data.body['videoPath'];
        }
      });

  }

  isMP4(file: File): boolean {
    return file.name.split('.')[file.name.split('.').length - 1] == 'mp4'
  }
}
