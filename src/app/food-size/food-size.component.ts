import { Component } from '@angular/core';
import { MyModalComponent } from "../my-modal/my-modal.component";
import { HttpClient } from '@angular/common/http';
import config from '../config';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-food-size',
  standalone: true,
  imports: [MyModalComponent,FormsModule],
  templateUrl: './food-size.component.html',
  styleUrl: './food-size.component.css'
})
export class FoodSizeComponent {
  constructor(private http:HttpClient) { }

  id: number = 0;
  name: string = '';
  price: number = 0;
  remark: string = '';
  foodTypeId: number = 0;
  foodTypes: any = [];
  foodSizes: any = [];

  ngOnInit(): void {
    this.fetchDataFoodType();
    this.fetchData();
  }

  
  fetchDataFoodType() {
    try {
      this.http.get(config.apiUrl + '/api/food-type')
        .subscribe((res: any) => {
          this.foodTypes = res.results;
          this.foodTypeId = this.foodTypes[0].id;
        });
    } catch (e:any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message,
      });
    }
  }
  fetchData(){
    try{
      this.http.get(config.apiUrl + '/api/food-size')
      .subscribe((res: any) => {
        this.foodSizes = res.results;
      });
    }catch(e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message,
      });
    }
  }
  save() {
    try {
      const body = {
        id: 0,
        name: this.name,
        price: this.price,
        remark: this.remark,
        foodTypeId: this.foodTypeId
      };
      if(this.id > 0){
        body.id = this.id;
        this.http.put(config.apiUrl + '/api/food-size/' + this.id,body).subscribe((res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          });
          this.fetchData();
        });
      }else{
        this.http.post(config.apiUrl + '/api/food-size',body).subscribe((res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          });
          this.fetchData();
        });
      }
    } catch (e:any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message,
      });
    }

    document.getElementById('modelFoodSize_close')?.click();
  }

  async remove(item:any){
    try{
      const button = await Swal.fire({
        title: 'คุณต้องการลบข้อมูลใช่หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      });

      if(button.isConfirmed){
        this.http.delete(config.apiUrl + '/api/food-size/' + item.id)
        .subscribe((res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'ลบข้อมูลสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          });
          this.fetchData();
        });
      }
    
    }catch(e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message,
      });
    }
  }

  edit(item:any){
    this.id = item.id;
    this.name = item.name;
    this.price = item.moneyAdded;
    this.remark = item.remark;
    this.foodTypeId = item.foodTypeId;
  }

  clear(){
    this.id = 0;
    this.name = '';
    this.price = 0;
    this.remark = '';
    this.foodTypeId = 0;
  }
}
