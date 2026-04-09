import { IApi, IServer, IOrderResponce, IOrder } from "../../types/index.ts";

export class ServerCommunication {
  api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IServer> {
    return this.api.get("/product/");
  }

  postOrderData(data: IOrder): Promise<IOrderResponce> {
    return this.api.post("/order/", data);
  }
}
