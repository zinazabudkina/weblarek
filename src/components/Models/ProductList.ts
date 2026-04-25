import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class ProductList {
  private productList: IProduct[] = [];
  private productItem: IProduct | null = null;

  /*  constructor(productList: IProduct[], productItem: IProduct | null) {
    this.productList = productList;
    this.productItem = productItem;
  }*/
  constructor(protected events: IEvents) {
    this.events = events;
  }

  setProductList(list: IProduct[]): void {
    this.productList = list;
    this.events.emit("productlist:changed");
  }

  getProductList(): IProduct[] {
    return this.productList;
  }

  getProductById(id: string): IProduct | undefined {
    return this.productList.find((item) => item.id === id);
  }

  setSelectedProduct(item: IProduct): void {
    this.productItem = item;
    this.events.emit("selectedproduct:changed");
  }

  getSelectedProduct(): IProduct | null {
    return this.productItem;
  }
}
