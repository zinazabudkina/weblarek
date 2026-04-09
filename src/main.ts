import "./scss/styles.scss";
import { ProductList } from "./components/Models/ProductList.ts";
import { apiProducts } from "./utils/data.ts";
import { Cart } from "./components/Models/Cart.ts";
import { Customer } from "./components/Models/Customer.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { ServerCommunication } from "./components/ServerCommunication.ts";

const products = new ProductList();
products.setProductList(apiProducts.items);
console.log("Массив товаров из каталога: ", products.getProductList());
console.log(
  "Товар по id: ",
  products.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"),
);
const productbyid = products.getProductById(
  "854cef69-976d-4c2a-a18c-2aa45046c390",
);
if (productbyid) {
  products.setSelectedProduct(productbyid);
}
console.log(
  "Товар для подробного отображения: ",
  products.getSelectedProduct(),
);

const cart = new Cart();
const exampleItem1 = products.getProductById(
  "854cef69-976d-4c2a-a18c-2aa45046c390",
);
const exampleItem2 = products.getProductById(
  "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
);
if (exampleItem1) {
  cart.setPurchasedProduct(exampleItem1);
}
console.log("Товары в корзине: ", cart.getPurchasedProductList());
if (exampleItem2) {
  cart.setPurchasedProduct(exampleItem2);
}
console.log("Товары в корзине: ", cart.getPurchasedProductList());
if (exampleItem1) {
  cart.deletePurchasedProduct(exampleItem1);
}
console.log("Товары в корзине: ", cart.getPurchasedProductList());
cart.deleteAllPurchasedProducts();
console.log("Товары в корзине: ", cart.getPurchasedProductList());
if (exampleItem1) {
  cart.setPurchasedProduct(exampleItem1);
}
console.log("Товары в корзине: ", cart.getPurchasedProductList());
if (exampleItem2) {
  cart.setPurchasedProduct(exampleItem2);
}
console.log("Суммарная цена: ", cart.getTotalCost());
console.log("Кол-во товаров в корзине: ", cart.getItemsNumber());
console.log(
  "Наличие товара в корзине: ",
  cart.getItemAvailability("c101ab44-ed99-4a54-990d-47aa2bb4e7d"),
);

const customer = new Customer();
customer.setPaymentType("cash");
customer.setEmail("zinaidzabudkina@mail.ru");
customer.setPhone("+7(985)333-33-33");
customer.setAddress("ksksdka;ka");
console.log("Данные пользователя: ", customer.getCustomerData());
customer.deleteCustomerData();
console.log("Данные пользователя: ", customer.getCustomerData());
console.log("Валидация данных: ", customer.validateCustomerData());
customer.setPaymentType("cash");
customer.setEmail("zinaidzabudkina@mail.ru");
console.log("Валидация данных: ", customer.validateCustomerData());
customer.setPhone("+7(985)333-33-33");
customer.setAddress("ksksdka;ka");
console.log("Валидация данных: ", customer.validateCustomerData());

const api = new Api(API_URL);
const server = new ServerCommunication(api);
server
  .getProducts()
  .then((result) => {
    const res = result.items;
    products.setProductList(res);
    console.log("Массив товаров из каталога: ", products.getProductList());
  })
  .catch((err) => console.log(err));
