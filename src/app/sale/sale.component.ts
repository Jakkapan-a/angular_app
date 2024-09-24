import {Component, OnInit} from '@angular/core';
import {MyModalComponent} from "../my-modal/my-modal.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {HttpClient} from "@angular/common/http";
import config from "../config";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [
    MyModalComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent implements OnInit {
  constructor(private http: HttpClient) {
  }

  foods: any[] = [];
  apiPath: string = '';
  tableNo: number = 1;
  userId: number = 0;
  saleTemps: any[] = [];
  amount: number = 0;
  foodSizes: any[] = [];
  saleTempId: number = 0;
  foodName: string = '';
  saleTempDetail: any[] = [];

  ngOnInit() {
    this.apiPath = config.apiUrl;
    this.userId = parseInt(localStorage.getItem('angular_id') || '0');
    this.fetchData();
    this.fetchSaleTemp();
  }

  fetchData() {
    try {
      this.http.get(config.apiUrl + '/api/food').subscribe((res: any) => {
        this.foods = res.results;
      });
    } catch
      (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message
      })
    }
  }

  async filter(type: string = '') {
    if (type == 'all' || type == '') {
      await this.fetchData();
    } else {
      this.http.get(config.apiUrl + '/api/food/filter/' + type).subscribe((res: any) => {
        this.foods = res.results;
      });
    }
  }

  saveSaleTemp(item: any) {
    const body = {
      qty: 1,
      foodId: item.id,
      tableNo: this.tableNo,
      userId: this.userId
    }
    this.http.post(config.apiUrl + '/api/sale-temp', body).subscribe((res: any) => {
      this.fetchSaleTemp();
    });
  }

  fetchSaleTemp() {
    this.http.get(config.apiUrl + '/api/sale-temp/' + this.userId).subscribe((res: any) => {
      this.saleTemps = res.results;
      this.computeAmount();
    });
  }

  changeQty(id: number, style: string){
    try {
      const body = {
        id: id,
        style: style
      }
      console.log(body);
      this.http.put(config.apiUrl + '/api/sale-temp-qty', body).subscribe((res: any) => {
        this.fetchSaleTemp();
      });

    }catch (e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message
      });
    }
  }
   async removeItem(item: any){
    try{
      const btn = await Swal.fire({
        title: 'คุณต้องการลบรายการนี้ใช่หรือไม่',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: `ใช่`,
        denyButtonText: `ไม่ใช่`,
      });

      if(!btn.isConfirmed){
        return;
      }

      const body ={
        foodId: item.food_id,
        userId: this.userId
      }

      this.http.delete(config.apiUrl + '/api/sale-temp-remove/'+item.foodId+"/"+this.userId).subscribe((res: any) => {
        this.fetchSaleTemp();
      });
    }catch (e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message
      });
    }
  }

  chooseFoodSize(item: any) {
    try {
      let foodTypeId: number = item.Food.FoodTypeId;
      this.saleTempId = item.id;
      this.foodName = item.Food.name;

      this.http.get(config.apiUrl + '/api/food-size/filter/' + foodTypeId).subscribe((res: any) => {
        this.foodSizes = res.results;
      });

      const body = {
        foodId: item.Food.id,
        qty: item.qty,
        saleTempId: item.id
      }

      this.http.post(config.apiUrl + '/api/sale-temp-detail', body).subscribe((res: any) => {
        this.fetchSaleTempDetail();
      });
      console.log(body);
    }catch (e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message
      });
    }
  }

  fetchSaleTempDetail(){
    this.http.get(config.apiUrl + '/api/sale-temp-detail/'+this.saleTempId).subscribe((res: any) => {
      this.saleTempDetail = res.results;
      this.computeAmount();
    });
  }

  computeAmount(){
    try {
      this.amount = 0;
      for (let i = 0; i < this.saleTemps.length; i++) {
        const item = this.saleTemps[i];
        const totalPerRow = item.price * item.qty;
        console.log({item});
        for (let j = 0; j < item.SaleTempDetail.length; j++) {
          this.amount += item.SaleTempDetail[j].addedMoney;
        }
        this.amount += totalPerRow;
      }
    }catch (e:any){
      console.log(e.message);
    }
    console.log(this.amount);
  }
  async clearSaleTemp(){
    try {
      const btn = await Swal.fire({
        title: 'คุณต้องการล้างรายการทั้งหมดใช่หรือไม่',
        showDenyButton: true,
        confirmButtonText: `ใช่`,
        denyButtonText: `ไม่ใช่`,
      });

      if(btn.isConfirmed){
        this.http.delete(config.apiUrl + '/api/sale-temp-clear/' + this.userId).subscribe((res: any) => {
          this.fetchSaleTemp();
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

  selectFoodSize(saleTempId: number, foodSizeId: number){
    try {
        const body = {
            saleTempId: saleTempId,
            foodSizeId: foodSizeId
        }
        this.http.put(config.apiUrl + '/api/sale-temp-detail', body).subscribe((res: any) => {
          this.fetchSaleTemp();
          this.fetchSaleTempDetail();
        });
    }catch (e:any){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.message
      });
    }
  }
}
