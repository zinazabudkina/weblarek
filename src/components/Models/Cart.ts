import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class Cart {
  private purchasedProductList: IProduct[];

  constructor(protected events: IEvents) {
    this.purchasedProductList = [];
  }

  getPurchasedProductList(): IProduct[] {
    return this.purchasedProductList;
  }

  setPurchasedProduct(item: IProduct): void {
    this.purchasedProductList.push(item);
    this.events.emit("basket:changed");
  }

  deletePurchasedProduct(item: IProduct): void {
    this.purchasedProductList = this.purchasedProductList.filter(
      (product) => product.id !== item.id,
    );
    this.events.emit("basket:changed");
  }

  deleteAllPurchasedProducts(): void {
    this.purchasedProductList = [];
    this.events.emit("basket:changed");
  }

  getTotalCost(): number {
    return this.purchasedProductList.reduce(
      (total, item) => total + (item.price || 0),
      0,
    );
  }

  getItemsNumber(): number {
    return this.purchasedProductList.length;
  }

  getItemAvailability(id: string): boolean {
    return this.purchasedProductList.some((item) => item.id === id);
  }
}
