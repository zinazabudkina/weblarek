import "./scss/styles.scss";
import { ProductList } from "./components/Models/ProductList.ts";
import { Cart } from "./components/Models/Cart.ts";
import { Customer } from "./components/Models/Customer.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { ServerCommunication } from "./components/ServerCommunication.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { CardCatalog } from "./components/View/CardCatalog.ts";
import { cloneTemplate } from "./utils/utils.ts";
import { Gallery } from "./components/View/Gallery.ts";
import { ensureElement } from "./utils/utils.ts";
import { CardPreview } from "./components/View/CardPreview.ts";
import { Modal } from "./components/View/Modal.ts";
import { Basket } from "./components/View/Basket.ts";
import { CardBasket } from "./components/View/CardBasket.ts";
import { Header } from "./components/View/Header.ts";
import { IProduct } from "./types/index.ts";
import { FormOrder } from "./components/View/FormOrder.ts";
import { FormContacts } from "./components/View/FormContacts.ts";
import { OrderSuccess } from "./components/View/OrderSuccess.ts";

const events = new EventEmitter();

const products = new ProductList(events);
const cart = new Cart(events);
const customer = new Customer(events);

const cardCatalogTemplate = ensureElement(
  "#card-catalog",
) as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement(
  "#card-preview",
) as HTMLTemplateElement;
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const formOrderTemplate = ensureElement<HTMLTemplateElement>("#order");
const formContactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const ordersuccessTemplate = ensureElement<HTMLTemplateElement>("#success");

const header = new Header(events, ensureElement(".header"));
const gallery = new Gallery(ensureElement(".gallery"));
const cardpreview = new CardPreview(events, cloneTemplate(cardPreviewTemplate));
const modal = new Modal(ensureElement("#modal-container"));
const basket = new Basket(events, cloneTemplate(basketTemplate));
const formorder = new FormOrder(events, cloneTemplate(formOrderTemplate));
const formcontacts = new FormContacts(
  events,
  cloneTemplate(formContactsTemplate),
);
const ordersuccess = new OrderSuccess(
  events,
  cloneTemplate(ordersuccessTemplate),
);

const api = new Api(API_URL);
const server = new ServerCommunication(api);
server
  .getProducts()
  .then((result) => {
    const res = result.items;
    products.setProductList(res);
  })
  .catch((err) => console.log(err));

events.on("productlist:changed", () => {
  const itemCards = products.getProductList().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });
    return card.render(item);
  });

  gallery.render({ catalog: itemCards });
});

events.on("basket:open", () => {
  modal.render({
    content: basket.render(),
  });
  if (cart.getPurchasedProductList().length === 0) {
    basket.makeButtonDisabled(true);
  } else {
    basket.makeButtonDisabled(false);
  }
  modal.open();
});

events.on("card:select", (e: IProduct) => {
  products.setSelectedProduct(e);
});

events.on("selectedproduct:changed", () => {
  const item = products.getSelectedProduct();
  if (item) {
    modal.render({
      content: cardpreview.render(item),
    });
    if (cart.getItemAvailability(item.id)) {
      cardpreview.makeButtonDelete();
    } else {
      cardpreview.makeButtonOrder();
    }
    if (!item.price) {
      cardpreview.makeButtonDisabled(true);
      cardpreview.makeButtonUnpriced();
    } else {
      cardpreview.makeButtonDisabled(false);
    }
  }
  modal.open();
});

events.on("cardbutton:click", () => {
  const item = products.getSelectedProduct();
  if (item && !cart.getItemAvailability(item.id)) {
    cart.setPurchasedProduct(item);
  } else if (item && cart.getItemAvailability(item.id)) {
    cart.deletePurchasedProduct(item);
  }
  modal.close();
});

events.on("basket:changed", () => {
  let index = 0;

  header.render({
    counter: cart.getItemsNumber(),
  });
  const basketCards = cart.getPurchasedProductList().map((item) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit("cardbasket:delete", item),
    });
    index += 1;
    return card.render({
      index: index,
      title: item.title,
      price: item.price,
    });
  });
  basket.render({
    basket: basketCards,
    totalprice: cart.getTotalCost(),
  });
  if (cart.getPurchasedProductList().length === 0) {
    basket.makeButtonDisabled(true);
  } else {
    basket.makeButtonDisabled(false);
  }
});

events.on("cardbasket:delete", (e: IProduct) => {
  cart.deletePurchasedProduct(e);
});

events.on("form:open", () => {
  modal.render({
    content: formorder.render({
      error: "",
    }),
  });
  modal.open();
});

events.on("pay:card", () => {
  customer.setPaymentType("card");
});

events.on("pay:cash", () => {
  customer.setPaymentType("cash");
});

events.on("input:address", (e: string[]) => {
  customer.setAddress(e[0]);
});

events.on("input:email", (e: string[]) => {
  customer.setEmail(e[0]);
});

events.on("input:phone", (e: string[]) => {
  customer.setPhone(e[0]);
});

events.on("customerdata:changed", () => {
  const validate = customer.validateCustomerData();

  const orderErrors = [validate.address, validate.payment]
    .filter(Boolean)
    .join("; ");
  if (orderErrors.length === 0) {
    formorder.makeButtonDisabled(false);
  } else {
    formorder.makeButtonDisabled(true);
  }

  const contactsErrors = [validate.email, validate.phone]
    .filter(Boolean)
    .join("; ");
  if (contactsErrors.length === 0) {
    formcontacts.makeButtonDisabled(false);
  } else {
    formcontacts.makeButtonDisabled(true);
  }

  formorder.render({
    payment: customer.getCustomerData().payment,
    address: customer.getCustomerData().address,
    error: orderErrors,
  });

  formcontacts.render({
    email: customer.getCustomerData().email,
    phone: customer.getCustomerData().phone,
    error: contactsErrors,
  });
});

events.on("order:submit", () => {
  modal.render({
    content: formcontacts.render({
      error: "",
    }),
  });
  modal.open();
});

events.on("contacts:submit", () => {
  const buyed: string[] = [];

  cart.getPurchasedProductList().forEach((item) => {
    buyed.push(item.id);
  });

  server
    .postOrderData({
      payment: customer.getCustomerData().payment,
      email: customer.getCustomerData().email,
      phone: customer.getCustomerData().phone,
      address: customer.getCustomerData().address,
      total: cart.getTotalCost(),
      items: buyed,
    })
    .then((result) => {
      const total = result.total;
      modal.render({
        content: ordersuccess.render({
          totalprice: total,
        }),
      });
      modal.open();
    })
    .catch((err) => console.log(err));

  cart.deleteAllPurchasedProducts();
  customer.deleteCustomerData();
  formorder.makeButtonUnclicked();
});

events.on("success:close", () => {
  modal.close();
});
