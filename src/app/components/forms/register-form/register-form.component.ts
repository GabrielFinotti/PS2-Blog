import {
  Component,
  ElementRef,
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
import { UserRegister } from '../../../interfaces/user/user-register';
import { RegisterService } from '../../../services/auth/user/register.service';

@Component({
    selector: 'app-register-form',
    imports: [ReactiveFormsModule, NgClass],
    templateUrl: './register-form.component.html',
    styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  @ViewChildren('input') private inputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;
  @ViewChildren('label') private labels!: QueryList<
    ElementRef<HTMLLabelElement>
  >;
  protected registerForm!: FormGroup;
  public isShowPass!: boolean;
  public imgShowPass!: string;

  constructor(
    private formBuilder: FormBuilder,
    private render: Renderer2,
    private registerService: RegisterService
  ) {
    this.registerForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(16),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      confPassword: ['', Validators.required],
    });

    this.isShowPass = false;
    this.imgShowPass = ShowPass.showPass;
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
    if (this.registerForm.invalid) return;

    const username = this.registerForm.get('username')?.value as string;
    const email = this.registerForm.get('email')?.value as string;
    const password = this.registerForm.get('password')?.value as string;
    const confPassword = this.registerForm.get('confPassword')?.value as string;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (
      username != username.trim() ||
      password != password.trim() ||
      confPassword != confPassword.trim() ||
      email != email.trim()
    ) {
      return;
    }
    if (confPassword != password) return;
    if (!emailRegex.test(email)) return;

    const data: UserRegister = {
      username,
      email,
      password,
    };

    this.registerService.userRegister(data).subscribe(
      (res) => {
        console.log(res.message, res.data);

        this.registerForm.reset();
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }
}
