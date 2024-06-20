import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { ManageContactComponent } from '../manage-contact/manage-contact.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName','email','edit','delete'];
  contactDataSource: any = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private http: HttpClient, private dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) {
    this.bind();
  }
  ngAfterViewInit() {
    this.contactDataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  bind() {
    this.http.get('https://localhost:7169/Contact/GetAll').subscribe((res:any)=>{  
    this.contactDataSource=res.value.data.result;
    })
  }

  addContact() {
    const dialogRef = this.dialog.open(ManageContactComponent, {
      width: '40%',
      height:'45%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.bind();
    });
  }

  updateContact(rowData: any){
    const dialogRef = this.dialog.open(ManageContactComponent, {
      width: '30%',
      height:'45%',
      data: rowData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.bind();
    });
  }

  delete(id: number) {
    
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        title: 'Delete Contact confirmation',
        message: 'Are you sure you want to delete Contact',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      
      if (result == true) {
        this.http
          .delete('https://localhost:7169/Contact/Delete?id=' + id)
          .subscribe((res: any) => {
            this.bind();
          });
      }
    });
  }

  searchContact(data : string) {
    let url = '';
    if(data != '' )
      url = 'https://localhost:7169/Contact/Search?text='+ data;
    else
      url = 'https://localhost:7169/Contact/GetAll';

    this.http.get(url).subscribe((res:any)=> {      
      this.contactDataSource=res.value.data.result;
    });
  }
}
