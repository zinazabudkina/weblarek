import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { TPayment } from "../../types";

interface IFormOrder {
  payment: TPayment;
  address: string;
}

export class FormOrder extends Form<IFormOrder> {
  protected payCardButton: HTMLButtonElement;
  protected payCashButton: HTMLButtonElement;
  protected addressElement: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(events, container);

    this.addressElement = ensureElement<HTMLInputElement>(
      ".form__input",
      this.container,
    );
    this.payCardButton = ensureElement<HTMLButtonElement>(
      ".button[name = 'card']",
      this.container,
    );
    this.payCashButton = ensureElement<HTMLButtonElement>(
      ".button[name = 'cash']",
      this.container,
    );

    this.payCardButton.addEventListener("click", () => {
      this.events.emit("pay:card");
    });
    this.payCashButton.addEventListener("click", () => {
      this.events.emit("pay:cash");
    });

    this.addressElement.addEventListener("input", (e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      this.events.emit("input:address", [target.value]);
    });
  }

  set payment(payment: Exclude<TPayment, "">) {
    if (payment === "card") {
      this.payCardButton.classList.add("button_alt-active");
      this.payCashButton.classList.remove("button_alt-active");
    } else if (payment === "cash") {
      this.payCashButton.classList.add("button_alt-active");
      this.payCardButton.classList.remove("button_alt-active");
    }
  }

  set address(address: string) {
    this.addressElement.value = address;
  }

  makeButtonUnclicked() {
    this.payCashButton.classList.remove("button_alt-active");
    this.payCardButton.classList.remove("button_alt-active");
  }
}
