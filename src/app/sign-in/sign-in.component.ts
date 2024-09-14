import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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

  constructor(private http: HttpClient){}
  signIn = () => {
    if(this.username === '' || this.password === ''){
      Swal.fire({
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
      this.http.post('https://api.example.com/auth/sign-in', body).subscribe((res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'ยินดีต้อนรับเข้าสู่ระบบ'
        });
        
        console.log(res);
        
        this.token = res.token; 
        // Save token to local storage
        localStorage.setItem('token', this.token);
        localStorage.setItem('username', this.username);
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.error.message
        });
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
