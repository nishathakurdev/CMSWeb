import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { ManageContactComponent } from '../manage-contact/manage-contact.component';
import { MatPaginator } from '@angular/material/paginator';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName','email','select','edit','delete'];
  contactDataSource: any = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) customPaginator: MatPaginator | undefined;
  @ViewChild(MatSort) customSort: MatSort | undefined;
  currentSelectedRow: any;
  contactList: any;

  constructor(private http: HttpClient, private dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) {
    this.bind();
  }
  ngAfterViewInit() {
    this.contactDataSource.paginator = this.customPaginator;
  }

  bind() {
    this.http.get('https://localhost:7169/Contact/GetAll').subscribe((res:any)=>{  
      this.contactList = res.value.data.result;
    this.contactDataSource.data= this.contactList 
    this.contactDataSource.sort = this.customSort
    this.contactDataSource.paginator = this.customPaginator;
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
      width: '30%',
      height:'20%',
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
      if(res.value.data.result)
        {
          this.contactList = res.value.data.result;
          this.contactDataSource.data= this.contactList 
        }
      else
      { 
        this.contactList = res.value.data;
        this.contactDataSource.data= this.contactList 
      }
        this.contactDataSource.sort = this.customSort
        this.contactDataSource.paginator = this.customPaginator;
    });
  }

  selectedRow(rowData: any) {
    this.contactList.forEach((el: any) => {
      el.isSlected = false;
    });
    rowData.isSlected = true;
    this.currentSelectedRow = rowData;    
    const dialogRef = this.dialog.open(DetailsComponent, {
      width: '30%',
      height:'45%',
      data: rowData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.bind();
    });
  }

}
