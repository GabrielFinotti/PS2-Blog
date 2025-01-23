import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GetProfile } from '../../interfaces/response/get-profile';
import { GetProfileService } from '../../services/auth/user/get-profile.service';
import { UpdateFormComponent } from '../../components/forms/update-form/update-form.component';
import { filter } from 'rxjs';
import { UpdateImageService } from '../../services/auth/user/update-image.service';

@Component({
    selector: 'app-account',
    imports: [UpdateFormComponent],
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {
  @ViewChild('input') private imgFile!: ElementRef<HTMLInputElement>;
  private token!: string;
  protected player!: GetProfile;

  constructor(
    private getProfileService: GetProfileService,
    private updateImageService: UpdateImageService
  ) {}

  ngOnInit(): void {
    let verifyToken = localStorage.getItem('token');

    if (!verifyToken) {
      verifyToken = sessionStorage.getItem('token');

      if (!verifyToken) return;
    }

    this.token = verifyToken;

    this.getProfileService.getProfile(this.token).subscribe((res) => {
      this.player = res;
    });
  }

  protected updateProfileImg() {
    if (!this.imgFile.nativeElement.files?.length) return;

    const image = this.imgFile.nativeElement.files[0];
    const formdata = new FormData();

    formdata.append('image', image);
    formdata.append('username', this.player.username);

    this.updateImageService.updateProfileImage(formdata, this.token).subscribe(
      (res) => {},
      (error) => {
        console.error(error);
      }
    );
  }
}
