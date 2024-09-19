import { Component } from '@angular/core';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import config from '../config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taste',
  standalone: true,
  imports: [MyModalComponent,FormsModule],
  templateUrl: './taste.component.html',
  styleUrl: './taste.component.css'
})
export class TasteComponent {

  constructor(private http:HttpClient) { }
  id: number = 0;
  FoodTypeId: number = 0;
  name: string = '';
  remark: string = '';
  tastes: any[] = [];
  FoodTypes: any[] = [];
  ngOnInit(): void {
    this.fetchDataFoodType();
    this.fetchData();
  }

  fetchDataFoodType(){
    try{
      this.http.get(config.apiUrl + '/api/food-type')
      .subscribe((res: any) => {
        this.FoodTypes = res.results;
        this.FoodTypeId = this.FoodTypes[0].id;
      });
    }catch(e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message,
      });
    }
  };
  fetchData(){
    try{
      this.http.get(config.apiUrl + '/api/taste')
      .subscribe((res: any) => {
        this.tastes = res.results;
        this.FoodTypeId = this.FoodTypes[0].id;
      });
    }catch(e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message,
      });
    }
  };
  save(){
    if(this.id == 0){
      this.create();
    }else{
      this.update();
    }
    document.getElementById('modelTaste_close')?.click();
  };
  create(){
    try{
      const body = {
        name: this.name,
        remark: this.remark,
        FoodTypeId: this.FoodTypeId
      }
      this.http.post(config.apiUrl + '/api/taste', body)
      .subscribe((res: any) => {
        this.fetchData();
        this.name = '';
        this.remark = '';
        this.FoodTypeId = this.FoodTypes[0].id;
      });

    }catch(e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message,
      });
    }
  }

  update(){
    try{
      const body = {
        name: this.name,
        remark: this.remark,
        FoodTypeId: this.FoodTypeId
      }
      this.http.put(config.apiUrl + '/api/taste/' + this.id, body)
      .subscribe((res: any) => {
        this.fetchData();
        this.name = '';
        this.remark = '';
        this.FoodTypeId = this.FoodTypes[0].id;
      });
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
    this.remark = item.remark;
    this.FoodTypeId = item.FoodTypeId;
  }
  async remove(item:any){
    this.id = item.id;
    try{
      const button = await Swal.fire({
        title: 'คุณต้องการลบข้อมูลใช่หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      });

      if (button.isConfirmed) {
        this.http.delete(config.apiUrl + '/api/taste/' + this.id)
        .subscribe((res: any) => {
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

  clear(){
    this.id = 0;
    this.name = '';
    this.remark = '';
  }

}
