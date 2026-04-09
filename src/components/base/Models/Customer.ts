import { IBuyer, ValidationErrors, TPayment } from "../../../types/index.ts";

export class Customer {
  customer: IBuyer;

  constructor() {
    this.customer = { payment: "", email: "", phone: "", address: "" };
  }

  setPaymentType(type: TPayment): void {
    this.customer.payment = type;
  }

  setEmail(email: string): void {
    this.customer.email = email;
  }

  setPhone(phone: string): void {
    this.customer.phone = phone;
  }

  setAddress(address: string): void {
    this.customer.address = address;
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
