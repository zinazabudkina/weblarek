import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IFormContacts {
  email: string;
  phone: string;
}

export class FormContacts extends Form<IFormContacts> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(events, container);

    this.emailElement = ensureElement<HTMLInputElement>(
      ".form__input[name='email']",
      this.container,
    );
    this.phoneElement = ensureElement<HTMLInputElement>(
      ".form__input[name='phone']",
      this.container,
    );

    this.emailElement.addEventListener("input", (e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      this.events.emit("input:email", [target.value]);
    });
    this.phoneElement.addEventListener("input", (e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      this.events.emit("input:phone", [target.value]);
    });
  }

  set email(email: string) {
    this.emailElement.value = email;
  }

  set phone(phone: string) {
    this.phoneElement.value = phone;
  }
}
