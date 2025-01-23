import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navbar',
    imports: [RouterModule, NgClass],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  protected isShowNav!: boolean;
  protected playerName!: string | undefined;

  constructor() {
    this.isShowNav = false;
  }

  ngOnInit(): void {
    let player = localStorage.getItem('player');

    if (!player) {
      player = sessionStorage.getItem('player');

      if (player) {
        this.playerName = player;
        return;
      }
    } else {
      this.playerName = player;
      return;
    }

    this.playerName = undefined;
  }

  public showNav() {
    this.isShowNav = !this.isShowNav;
  }
}
