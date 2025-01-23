import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/forms/login-form/login-form.component';
import { RegisterFormComponent } from '../../components/forms/register-form/register-form.component';
import { StringForm } from '../../enums/string-form';


@Component({
    selector: 'app-access',
    imports: [LoginFormComponent, RegisterFormComponent],
    templateUrl: './access.component.html',
    styleUrl: './access.component.scss'
})
export class AccessComponent {
  public isToggle!: boolean;
  public textForm!: string;
  public textToggle!: string;

  constructor() {
    this.isToggle = false;
    this.textForm = StringForm.loginForm;
    this.textToggle = StringForm.toggleResgister;
  }

  public toggleForm() {
    if (this.isToggle) {
      this.isToggle = !this.isToggle;
      this.textForm = StringForm.registerForm;
      this.textToggle = StringForm.toggleLogin;
    } else {
      this.isToggle = !this.isToggle;
      this.textForm = StringForm.loginForm;
      this.textToggle = StringForm.toggleResgister;
    }
  }
}
