import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
  totalprice: number;
}

export class OrderSuccess extends Component<ISuccess> {
  protected orderDescriptionElement: HTMLElement;
  protected orderSuccessCloseButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.orderDescriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.orderSuccessCloseButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.orderSuccessCloseButton.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }
  set totalprice(value: number) {
    this.orderDescriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
