import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IForm {
  error: string;
}

export class Form<T> extends Component<IForm & T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
    this.submitButton = ensureElement<HTMLButtonElement>(
      ".button[type='submit']",
      this.container,
    );

    this.submitButton.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.getAttribute("name")}:submit`);
      /*console.log(`${this.container.getAttribute('name')}:submit`)*/
    });
  }
  set error(value: string) {
    this.errorElement.textContent = value;
  }

  makeButtonDisabled(value: boolean) {
    this.submitButton.disabled = value;
  }
}
