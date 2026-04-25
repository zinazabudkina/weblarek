import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  basket: HTMLElement[];
  totalprice: number;
}

export class Basket extends Component<IBasket> {
  protected basketListElement: HTMLElement;
  protected orderButtonElement: HTMLButtonElement;
  protected totalPriceElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.basketListElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.orderButtonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.totalPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );

    this.orderButtonElement.addEventListener("click", () => {
      this.events.emit("form:open");
    });
  }

  set basket(items: HTMLElement[]) {
    this.basketListElement.replaceChildren(...items);
  }

  set totalprice(value: number) {
    this.totalPriceElement.textContent = `${value} синапсов`;
  }

  buttonDisabled(value: boolean) {
    this.orderButtonElement.disabled = value;
  }
}
