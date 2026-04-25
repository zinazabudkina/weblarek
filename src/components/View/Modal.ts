import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected modalElement: HTMLElement;
  protected modal: HTMLElement;
  protected modalCloseButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.modal = this.container;
    this.modalElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.modalCloseButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this.modalCloseButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  open() {
    this.modal.classList.add("modal_active");
  }

  close() {
    this.modal.classList.remove("modal_active");
  }

  set content(value: HTMLElement) {
    this.modalElement.replaceChildren(value);
  }
}
