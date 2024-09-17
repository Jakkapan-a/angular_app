import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  name: string='';

  ngOnInit(): void {
    this.name = localStorage.getItem('angular_name') || '';
  }

  signOut = () => {
    localStorage.removeItem('angular_token');
    localStorage.removeItem('angular_name');
    // window.location.reload();
  }
}
