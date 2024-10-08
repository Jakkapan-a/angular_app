import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterOutlet, RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  name: string='';

  ngOnInit(): void {
    this.name = localStorage.getItem('angular_name') || '';
  }

  signOut = async () => {
    const button = await Swal.fire({
      title: 'ออกจากระบบ',
      text: 'คุณต้องการออกจากระบบหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่ใช่'
    });

    if(button.isConfirmed){
      localStorage.removeItem('angular_token');
      localStorage.removeItem('angular_name');
      location.reload();
    }
    
  }
}
