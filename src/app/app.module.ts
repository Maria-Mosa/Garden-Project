import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { RouterModule, Routes } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DropDownListComponent, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';



import { AppComponent } from './app.component';
import { CanvasComponent } from './canvans/canvans.component';
import { ShapeFormComponent } from './shape-form/shape-form.component';
import { ShapeService } from './shape.service';
import { ShapeTypeComponent } from './shape-type/shape-type.component';
import { RootComponent } from './root.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RsetDataComponent } from './rset-data/rset-data.component';

const appRoutes: Routes = [
  { path: 'usser',      component: LoginPageComponent  },
  {path:'rest',       component:RsetDataComponent},
  { path: 'shape/:id',      component: AppComponent },
  { path: '',
    redirectTo: '/usser',
    pathMatch: 'full'
  }
 

];

@NgModule({
  declarations: [
    AppComponent,
    ShapeFormComponent,
    CanvasComponent,
    ShapeTypeComponent,
    RootComponent,
    LoginPageComponent,
    RsetDataComponent
  ],
  imports: [
    // MatFormFieldModule,
    // MatInputModule,
    BrowserModule,
    DropDownListModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { /*enableTracing: true */ } // <-- debugging purposes only
    )
  ],
  providers: [ShapeService],
  bootstrap: [RootComponent]
})
export class AppModule { }
