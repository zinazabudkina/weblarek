import { IBuyer, ValidationErrors, TPayment } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class Customer {
  private customer: IBuyer;

  constructor(protected events: IEvents) {
    this.customer = { payment: "", email: "", phone: "", address: "" };
  }

  setPaymentType(type: TPayment): void {
    this.customer.payment = type;
    this.events.emit("customerdata:changed");
  }

  setEmail(email: string): void {
    this.customer.email = email;
    this.events.emit("customerdata:changed");
  }

  setPhone(phone: string): void {
    this.customer.phone = phone;
    this.events.emit("customerdata:changed");
  }

  setAddress(address: string): void {
    this.customer.address = address;
    this.events.emit("customerdata:changed");
  }

  getCustomerData(): IBuyer {
    return this.customer;
  }

  deleteCustomerData(): void {
    this.customer = {
      payment: "",
      email: "",
      phone: "",
      address: "",
    };
    this.events.emit("customerdata:changed");
  }

  validateCustomerData(): ValidationErrors {
    const error: ValidationErrors = {};
    if (this.customer.payment === "") {
      error.payment = "Не выбран вид оплаты";
    }
    if (this.customer.email === "") {
      error.email = "Укажите емэйл";
    }
    if (this.customer.phone === "") {
      error.phone = "Укажите номер телефона";
    }
    if (this.customer.address === "") {
      error.address = "Укажите адрес доставки";
    }
    return error;
  }
}
