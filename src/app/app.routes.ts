import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { FoodTypeComponent } from './food-type/food-type.component';
import { FoodSizeComponent } from './food-size/food-size.component';

export const routes: Routes = [
    {
        path: '',
        component: SignInComponent
    },
    {
        path: 'food-type',
        component: FoodTypeComponent,
    },
    {
        path: 'food-size',
        component: FoodSizeComponent,
    }
];
