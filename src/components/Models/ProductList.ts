import { IProduct } from "../../types/index.ts";

export class ProductList {
  private productList: IProduct[] = [];
  private productItem: IProduct | null = null;

  /*  constructor(productList: IProduct[], productItem: IProduct | null) {
    this.productList = productList;
    this.productItem = productItem;
  }*/

  setProductList(list: IProduct[]): void {
    this.productList = list;
  }

  getProductList(): IProduct[] {
    return this.productList;
  }

  getProductById(id: string): IProduct | undefined {
    return this.productList.find((item) => item.id === id);
  }

  setSelectedProduct(item: IProduct): void {
    this.productItem = item;
  }

  getSelectedProduct(): IProduct | null {
    return this.productItem;
  }
}
