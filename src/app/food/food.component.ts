import {Component} from '@angular/core';
import {MyModalComponent} from "../my-modal/my-modal.component";
import {HttpClient} from "@angular/common/http";
import Swal from "sweetalert2";
import config from "../config";
import {FormsModule} from "@angular/forms";
import {firstValueFrom} from "rxjs";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [
    MyModalComponent, FormsModule, NgOptimizedImage
  ],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})
export class FoodComponent {
  constructor(private http:HttpClient) {}

  foodTypes: any[] = [];
  foods: any[] = [];
  name: string = '';
  fileName: string = '';
  price: number = 0;
  remark: string = '';
  foodType: string = 'food';
  id: number = 0;
  FoodTypeId: number = 0;
  file: File | undefined = undefined;
  imgSrc: string = '';
  serverUrl: string = config.apiUrl;
  async ngOnInit() {
    this.fetchFoodTypes();
    await this.fetchData();

    this.serverUrl = config.apiUrl;
  }

  fetchFoodTypes() {
    try {
      this.http.get(config.apiUrl + '/api/food-type').subscribe((res: any) => {
        this.foodTypes = res.results;
        this.FoodTypeId = this.foodTypes[0].id;
      });
    }catch (e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message
      })
    }
  }
  async fetchData() {
    try {
      const res: any = await firstValueFrom(this.http.get(config.apiUrl + '/api/food'));
      this.foods = res.results;
    }catch (e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message
      });
    }
  }

  async save() {
    try {
      const body ={
        name: this.name,
        fileName: this.fileName,
        price: this.price,
        foodType: this.foodType,
        remark: this.remark,
        FoodTypeId: this.FoodTypeId,
      };

      if(this.id > 0){

        const newFileName = await this.uploadFile();
        if(newFileName !== null){
          body.fileName = newFileName;
        }
        this.http.put(config.apiUrl + '/api/food/' + this.id, body).subscribe((res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลสำเร็จ',
            timer: 2000
          });
          this.fetchData();
          document.getElementById('modelFood_close')?.click();
        });
      } else {
        body.fileName = await this.uploadFile();
        this.http.post(config.apiUrl + '/api/food', body).subscribe((res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลสำเร็จ',
            timer: 2000
          });
          this.fetchData();
          document.getElementById('modelFood_close')?.click();
        });
      }
    }catch (e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message
      });
    }
  }

  fileSelected(file: any) {
    if (file.files && file.files.length > 0) {
      this.file = file.files[0];

      // Image review
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const preview = document.getElementById('preview') as HTMLImageElement;
        preview.src = e.target.result;
        preview.parentElement?.classList.remove('d-none');
      };
      reader.readAsDataURL(this.file? this.file : new Blob());
    }
  }
  async uploadFile(){
    if(this.file != undefined){
      const formData = new FormData();
      formData.append('img',this.file);
      const res: any = await firstValueFrom(this.http.post(config.apiUrl + '/api/food/upload',formData));
      return res.fileName;
    }
    return null;
  }

  clear(){
    this.id = 0;
    this.name = '';
    this.fileName = '';
    this.price = 0;
    this.remark = '';
    this.FoodTypeId = this.foodTypes[0].id;
    this.file = undefined;
    this.foodType = 'food';
    this.imgSrc = '';
    const preview = document.getElementById('preview') as HTMLImageElement;
    preview.src = '';
    preview.parentElement?.classList.add('d-none');
  }

  edit(item: any){
    this.id = item.id;
    this.name = item.name;
    this.fileName = item.img;
    this.price = item.price;
    this.remark = item.remark;
    this.foodType = item.foodType;
    this.FoodTypeId = item.FoodTypeId;
    if(item.img != null && item.img != '') {
      this.imgSrc = config.apiUrl + '/uploads/' + item.img;
      // Image review
      const preview = document.getElementById('preview') as HTMLImageElement;
      preview.src = this.imgSrc;
      preview.parentElement?.classList.remove('d-none');
    }else{
      this.imgSrc = '';
      const preview = document.getElementById('preview') as HTMLImageElement;
      preview.src = '';
      preview.parentElement?.classList.add('d-none');
    }
  }

  async remove(item: any){
    try {
      const button = await Swal.fire({
        title: 'คุณต้องการลบข้อมูลใช่หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      });

      if(button.isConfirmed){
        this.http.delete(config.apiUrl + '/api/food/' + item.id).subscribe((res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'ลบข้อมูลสำเร็จ'
          });
          this.fetchData();
        });
      }

    }catch (e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message
      });
    }
  }

  async filter(type: string = ''){
    if(type == 'all' || type == ''){
      await this.fetchData();
    }else{
      this.http.get(config.apiUrl + '/api/food/filter/' + type).subscribe((res: any) => {
        this.foods = res.results;
      });
    }
  }

}
