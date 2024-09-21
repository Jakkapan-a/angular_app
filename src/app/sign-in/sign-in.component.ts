import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  token: string = '';
  username: string = '';
  password: string = '';
  name: string ='';

  constructor(private http: HttpClient){}

  @Output() updateToken: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    this.token = localStorage.getItem('angular_token') || '';
  }

   signIn = async () => {
    if(this.username === '' || this.password === ''){
      await Swal.fire({
        icon: 'error',
        title: 'ตรวจสอบข้อมูล',
        text: 'กรุณากรอกข้อมูล ชื่อผู้ใช้งาน และ รหัสผ่าน ให้ครบถ้วน'
      });
      return;
    }

    const body = {
      username: this.username,
      password: this.password
    }

    try{
      this.http.post('http://localhost:3000/api/user/signin', body).subscribe( async (res: any) => {
          if(res.token === undefined){
            await Swal.fire({
              icon: 'error',
              title: 'เข้าสู่ระบบไม่สำเร็จ',
              text: 'กรุณาตรวจสอบชื่อผู้ใช้งาน และ รหัสผ่าน'
            });
            return;
          }
         await Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'ยินดีต้อนรับเข้าสู่ระบบ',
          showConfirmButton: true,
          timer: 1500
        });

        this.token = res.token;
        // Save token to local storage
        localStorage.setItem('angular_token', this.token ?? '');
        localStorage.setItem('angular_name', res.name);
        localStorage.setItem('angular_id', res.id);

        // update token in app component
        this.updateToken.emit(this.token);
      });
    }catch(e)
    {
      const error = e as Error;
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message
      });
    }

  }
}
