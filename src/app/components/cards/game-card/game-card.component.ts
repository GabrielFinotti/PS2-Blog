import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';

@Component({
    selector: 'app-game-card',
    imports: [],
    templateUrl: './game-card.component.html',
    styleUrl: './game-card.component.scss'
})
export class GameCardComponent implements OnChanges, AfterViewInit {
  @ViewChildren('card') private cards!: QueryList<ElementRef<HTMLDivElement>>;
  @Input() public list!: Array<{ name: string; size: string; href: string }>;

  constructor(private render: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list'].currentValue != changes['list'].previousValue) {
      this.setClass();
    }
  }

  ngAfterViewInit(): void {
    this.cards.changes.subscribe(() => {
      this.setClass();
    });
  }

  private setClass() {
    let delay: number = 0;

    this.cards.forEach((card) => {
      this.render.removeClass(card.nativeElement, 'show-card');

      setTimeout(() => {
        this.render.addClass(card.nativeElement, 'show-card');
      }, delay);

      delay += 220;
    });
  }
}
