import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

//Components
import { GameCardComponent } from '../../components/cards/game-card/game-card.component';
import { GamesListService } from '../../services/games/games-list.service';

@Component({
    selector: 'app-home',
    imports: [NgClass, ReactiveFormsModule, GameCardComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  protected search!: FormGroup;
  protected gameList!: Array<{ name: string; size: string; href: string }>;
  protected isShow!: boolean;
  protected query!: string;
  protected prevPage!: number | undefined;
  protected nextPage!: number | undefined;
  protected totalDocs!: number;
  protected currentPage!: number;
  private gameName!: string;
  private token!: string;

  constructor(
    private formBuilder: FormBuilder,
    private gamesListService: GamesListService
  ) {
    this.search = this.formBuilder.group({
      game: '',
    });

    this.isShow = false;
    this.query = '';
    this.currentPage = 1;
  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');

    if (!token) {
      token = sessionStorage.getItem('token');

      if (!token) {
        this.token = '';
        return;
      }
    } else {
      this.token = token;
    }

    this.token = token;

    this.searchGame();
  }

  public searchFocus() {
    this.isShow = true;
  }

  public searchBlur() {
    this.isShow = false;
  }

  protected searchGame() {
    this.gameName = this.search.get('game')?.value as string;
    this.currentPage = 1;

    if (!this.gameName) this.gameName = ' ';

    this.query = `?name=${this.gameName}&page=${this.currentPage}`;

    this.gamesListService
      .getGamesList(this.token, this.query)
      .subscribe((res) => {
        this.gameList = res.gameList;
        this.prevPage = res.prevPage;
        this.nextPage = res.nextPage;
        this.totalDocs = res.totalDocs;
      });
  }

  protected togglePage(page: number) {
    this.currentPage = page;

    this.query = `?name=${this.gameName}&page=${this.currentPage}`;

    this.gamesListService
      .getGamesList(this.token, this.query)
      .subscribe((res) => {
        this.gameList = res.gameList;
        this.prevPage = res.prevPage;
        this.nextPage = res.nextPage;
        this.totalDocs = res.totalDocs;
      });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected pagination(): number[] {
    if (this.totalDocs <= 20) {
      return Array.from({ length: 1 }, (_) => 1);
    }

    const totalPages = Math.ceil(this.totalDocs / 20);
    const startPage = Math.max(this.currentPage - 2, 1);
    const endPage = Math.min(startPage + 2, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }
}
