import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { v1 as uuid } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  providers: []
})
export class AppComponent {
  // title = 'crud-client';
  customers: any[] = [];
  titles: any = ['MR', 'MRS', 'SIR', 'TUN', 'CIK', 'ENCIK'];
  customerDetailForm = this.fb.group({
    id: null,
    name: ['', [Validators.required, Validators.maxLength(45)]],
    title: [''],
    ic: [
      '',
      [
        Validators.maxLength(14),
        Validators.required,
        Validators.pattern(/^\d{6}-\d{2}-\d{4}$/gi),
      ],
    ],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    const url: string = '/assets/customers.json';
    this.http.get(url)
      .pipe(
        map(
          (jsonData: any) => (
            {
              data: jsonData
            }
          )
        )
      ).subscribe((response) => {
        this.customers = response.data;
      });
  }

  updateProfile() {
    this.customerDetailForm.patchValue({});
  }

  changeTitle(e: any) {
    console.log(e.value);
    this.title?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get name() {
    return this.customerDetailForm.get('name');
  }

  get ic() {
    return this.customerDetailForm.get('ic');
  }

  get title() {
    return this.customerDetailForm.get('title');
  }

  get dob() {
    return this.customerDetailForm.get('ic')?.valid ? (
      this.customerDetailForm.get('ic')?.value?.substring(4, 6) +
      '/' +
      this.customerDetailForm.get('ic')?.value?.substring(2, 4) +
      '/' +
      this.customerDetailForm.get('ic')?.value?.substring(0, 2)
    ) : '';
  }

  editCustomer(item: any) {
    this.clearForm()
    this.customerDetailForm.patchValue(item);
    console.log(this.customerDetailForm.value)
  }

  deleteCustomer(item: any) {
    let index = this.customers.findIndex(val => val.id == item.id)
    if (index > -1) this.customers.splice(index, 1)
  }

  clearForm(){
    this.customerDetailForm.reset();
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.customerDetailForm.value);
    if(this.customerDetailForm.value.id) {
      let index = this.customers.findIndex(val => val.id == this.customerDetailForm.value.id)
      if (index > -1) this.customers[index] = this.customerDetailForm.value
    }
    else this.customers.push({ id: uuid(), ...this.customerDetailForm.value });
  }
}
