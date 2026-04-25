import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { CategoryKey } from "./CardCatalog";
import { CDN_URL } from "../../utils/constants";
import { IEvents } from "../base/Events";

export interface ICardPreview {
  description: string;
  image: string;
  category: string;
}

export class CardPreview extends Card<ICardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected orderButtonElement: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.orderButtonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.orderButtonElement.addEventListener("click", () => {
      this.events.emit("cardbutton:click");
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set image(value: string) {
    const src = `${CDN_URL}${value}`;
    this.setImage(
      this.imageElement,
      src.slice(0, -3).concat("png"),
      this.title,
    );
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  unpricedButton() {
    this.orderButtonElement.textContent = "Недоступно";
  }

  deleteButton() {
    this.orderButtonElement.textContent = "Удалить из корзины";
  }

  orderButton() {
    this.orderButtonElement.textContent = "Купить";
  }

  buttonDisabled(value: boolean) {
    this.orderButtonElement.disabled = value;
  }
}
