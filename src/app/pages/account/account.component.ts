import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { UserDataService } from './../../shared/services/user-data.service';
import { ActivatedRoute } from '@angular/router';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { UpdateFormComponent } from '../../components/update-form/update-form.component';
import { UserDataResponse } from '../../interfaces/user-data-response';
import { UserDataFormComponent } from '../../components/user-data-form/user-data-form.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    NavBarComponent,
    FooterComponent,
    UpdateFormComponent,
    UserDataFormComponent,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  @ViewChildren('div') private divs!: QueryList<ElementRef<HTMLDivElement>>;
  protected userName!: UserDataResponse;
  private userId!: string;
  protected formEdit!: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userDataService: UserDataService,
    private render: Renderer2
  ) {
    this.formEdit = false;
  }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params['id'];
    this.userDataService.getUserName(this.userId).subscribe(
      (res) => {
        this.userName = res;
      },
      (err) => {
        console.error(err.message);
      }
    );
  }

  public editFormData() {
    if (this.formEdit) {
      this.formEdit = false;
      setTimeout(() => {
        this.render.setStyle(
          this.divs.get(0)?.nativeElement,
          'height',
          '129px'
        );
      }, 800);
      this.render.setStyle(this.divs.get(1)?.nativeElement, 'height', '0');
    } else {
      this.formEdit = true;
      this.render.setStyle(this.divs.get(0)?.nativeElement, 'height', '0');
      setTimeout(() => {
        this.render.setStyle(
          this.divs.get(1)?.nativeElement,
          'height',
          '275px'
        );
      }, 800);
    }
  }
}
