import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-contact',
  templateUrl: './manage-contact.component.html',
  styleUrls: ['./manage-contact.component.css']
})
export class ManageContactComponent {
  contactForm = new FormGroup({
    id: new FormControl(0, Validators.required),
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.email),  
  });

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<ManageContactComponent>,
    @Inject(MAT_DIALOG_DATA)public contactData:any,
   
  ) {}

  ngOnInit(): void {
    if (this.contactData) {
        this.contactForm.controls.id.setValue(this.contactData.id);
        this.contactForm.controls.firstName.setValue(this.contactData.firstName);
        this.contactForm.controls.lastName.setValue(this.contactData.lastName);
        this.contactForm.controls.email.setValue(this.contactData.email);
    }
  }

  get getContactControls() {
    let form: any = this.contactForm.controls;
    return form;
  }

  submit() {
    if (this.contactForm.valid === true) {
      const url: string =
        this.contactForm.value.id == 0
          ? 'https://localhost:7169/Contact/Add'
          : 'https://localhost:7169/Contact/Update';
      this.http.post(url, this.contactForm.value).subscribe((res) => {
        this.dialogRef.close();
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
