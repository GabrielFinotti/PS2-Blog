import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ShowPass } from '../../../enums/show-pass';
import { NgClass } from '@angular/common';

//Services
import { LoginService } from '../../../services/auth/user/login.service';

//Interfaces
import { UserLogin } from '../../../interfaces/user/user-login';
import { Login } from '../../../interfaces/response/login';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-form',
    imports: [ReactiveFormsModule, NgClass],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit {
  @ViewChildren('input') private inputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;
  @ViewChildren('label') private labels!: QueryList<
    ElementRef<HTMLLabelElement>
  >;
  protected loginForm!: FormGroup;
  public isShowPass!: boolean;
  public imgShowPass!: string;

  constructor(
    private formBuilder: FormBuilder,
    private render: Renderer2,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false],
    });

    this.isShowPass = false;
    this.imgShowPass = ShowPass.showPass;
  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');

    if (!token) {
      token = sessionStorage.getItem('token');

      if (token) this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl('');
    }
  }

  public onFocus(index: number) {
    if (this.inputs.toArray()[index].nativeElement) {
      this.render.setStyle(
        this.labels.toArray()[index].nativeElement,
        'top',
        '-14px'
      );
    }
  }

  public onBlur(index: number) {
    if (this.inputs.toArray()[index].nativeElement.value === '') {
      this.render.setStyle(
        this.labels.toArray()[index].nativeElement,
        'top',
        '30%'
      );
    }
  }

  public showPass() {
    if (!this.isShowPass) {
      this.imgShowPass = ShowPass.notShowPass;
      this.isShowPass = true;
    } else {
      this.imgShowPass = ShowPass.showPass;
      this.isShowPass = false;
    }
  }

  protected submit() {
    if (this.loginForm.invalid) return;

    const email = this.loginForm.get('email')?.value as string;
    const password = this.loginForm.get('password')?.value as string;
    const isSave = this.loginForm.get('remember')?.value as boolean;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email != email.trim() || password != password.trim()) {
      return;
    }
    if (!emailRegex.test(email)) return;

    const data: UserLogin = {
      email,
      password,
      save: isSave,
    };

    this.loginService.userLogin(data).subscribe(
      (res) => {
        this.saveData(res, isSave);

        this.router.navigateByUrl('');
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }

  private saveData(data: Login, isSave: boolean) {
    if (isSave) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('player', data.username);
    } else {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('player', data.username);
    }
  }
}
