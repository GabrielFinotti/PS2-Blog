import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

//Services
import { GetProfileService } from '../../../services/auth/user/get-profile.service';
import { UpdateService } from '../../../services/auth/user/update.service';

//Interfaces
import { UserUpdate } from '../../../interfaces/user/user-update';

@Component({
    selector: 'app-update-form',
    imports: [ReactiveFormsModule, NgClass],
    templateUrl: './update-form.component.html',
    styleUrl: './update-form.component.scss'
})
export class UpdateFormComponent implements OnInit {
  protected updateForm!: FormGroup;
  private token!: string;

  constructor(
    private formBuilder: FormBuilder,
    private getProfileService: GetProfileService,
    private updateService: UpdateService
  ) {
    this.updateForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(16),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    let verifyToken = localStorage.getItem('token');

    if (!verifyToken) {
      verifyToken = sessionStorage.getItem('token');

      if (!verifyToken) return;
    }

    this.token = verifyToken;

    this.getProfileService.getProfile(this.token).subscribe(
      (res) => {
        this.updateForm.patchValue({
          username: res.username,
          email: res.email,
          bio: res.bio,
        });
      },
      (error) => {}
    );
  }

  protected submit() {
    if (this.updateForm.invalid) return;

    const username = this.updateForm.get('username')?.value as string;
    const email = this.updateForm.get('email')?.value as string;
    const bio = this.updateForm.get('bio')?.value as string;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (
      username != username.trim() ||
      email != email.trim() ||
      bio != bio.trim()
    ) {
      return;
    }
    if (!emailRegex.test(email)) return;

    const data: UserUpdate = {
      username,
      email,
      bio,
    };

    this.updateService.userUpdate(data, this.token).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {}
    );
  }
}
