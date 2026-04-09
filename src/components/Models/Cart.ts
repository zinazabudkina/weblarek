import { IProduct } from "../../types/index.ts";

export class Cart {
  private purchasedProductList: IProduct[];

  constructor() {
    this.purchasedProductList = [];
  }

  getPurchasedProductList(): IProduct[] {
    return this.purchasedProductList;
  }

  setPurchasedProduct(item: IProduct): void {
    this.purchasedProductList.push(item);
  }

  deletePurchasedProduct(item: IProduct): void {
    this.purchasedProductList = this.purchasedProductList.filter(
      (product) => product.id !== item.id,
    );
  }

  deleteAllPurchasedProducts(): void {
    this.purchasedProductList = [];
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
