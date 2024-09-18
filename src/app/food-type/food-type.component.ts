import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import config from '../config';
import { FormsModule } from '@angular/forms';
import { MyModalComponent } from '../my-modal/my-modal.component';

@Component({
  selector: 'app-food-type',
  standalone: true,
  imports: [FormsModule, MyModalComponent],
  templateUrl: './food-type.component.html',
  styleUrl: './food-type.component.css'
})
export class FoodTypeComponent implements OnInit {
  name: string = '';
  remark: string = '';
  foodTypes: any = [];
  id: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();
  }

  save() {
    try {
      const body = {
        name: this.name,
        remark: this.remark,
        id: 0
      };
      // Validate input
      if (this.name === '') {
        Swal.fire({
          icon: 'error',
          title: 'ตรวจสอบข้อมูล',
          text: 'กรุณากรอกข้อมูล ชื่อประเภทอาหาร ให้ครบถ้วน'
        });
        return;
      }

      if (this.id > 0) {
        body.id = this.id;
        this.http.put(config.apiUrl + '/api/food-type/' + this.id, body)
          .subscribe((res) => {
            this.fetchData();
          });
          
      } else {

        this.http.post(config.apiUrl + '/api/food-type', body)
          .subscribe((res) => {
            this.fetchData();
          });
      }

      document.getElementById('myModal_close')?.click();
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'บันทึกข้อมูลไม่สำเร็จ',
        text: 'กรุณาลองใหม่อีกครั้ง'
      });
    }
  }

  fetchData() {
    try {
      this.http.get(config.apiUrl + '/api/food-type')
        .subscribe((res: any) => {
          this.foodTypes = res.results;
        });
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณาลองใหม่อีกครั้ง'
      });
    }
  }

  async remove(item: any) {
    try {
      const btn = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?',
        text: 'คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ฉันต้องการลบ!',
        cancelButtonText: 'ไม่, ยกเลิก'
      });
      if (btn.isConfirmed) {
        this.http.delete(config.apiUrl + '/api/food-type/' + item.id)
          .subscribe((res) => {
            this.fetchData();
          });
      }

    } catch (e: any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message
      });
    }
  }

  edit(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.remark = item.remark;
  }

  clearForm() {
    this.id = 0;
    this.name = '';
    this.remark = '';
  }
}
