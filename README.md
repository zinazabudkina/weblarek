https://github.com/zinazabudkina/weblarek

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

Товар:

interface IProduct {
id: string; - id продукта
description: string; - описание продукта
image: string; - изображение продукта
title: string; - название продукта
category: string; - категория продукта
price: number | null; - цена продукта
}

Покупатель:

interface IBuyer {
payment: TPayment; - тип платежа
email: string; - емейл покупателя
phone: string; - телефон покупателя
address: string; - адрес доставки
}

### Модели данных

#### Класс ProductList

Хранит массив всех товаров и товар, выбранный для подробного отображения.

Конструктор:
Конструктор класса не принимает параметров.

Поля класса:  
`productList: IProduct[]` - каталог всех товаров  
`productItem: IProduct | null` - карточка выбранного для просмотра товара.

Методы:  
`setProductList(list: IProduct[]): void` - сохраняет массив товаров, полученный в параметрах метода.
`getProductList(): IProduct[]` - возвращает массив товаров из модели.  
`getProductById(id: string): IProduct | undefined` - возвращает один товар по его id.
`setSelectedProduct(item: IProduct): void` - сохраняет товар для подробного отображения.
`getSelectedProduct(): IProduct | null` - возвращает товар, выбранный для подробного отображения.

#### Класс Cart

Хранит массив товаров, выбранных покупателем для покупки.

Конструктор:  
Конструктор класса не принимает параметров.

Поля класса:  
`purchasedProductList: IProduct[]` - массив товаров, выбранных покупателем для покупки

Методы:  
`getPurchasedProductList(): IProduct[]` - возвращает массив товаров, выбранных покупателем для покупки.
`setPurchasedProduct(item : IProduct): void` - добавляет товар, который был получен в параметре, в массив корзины.
`deletePurchasedProduct(item : IProduct): void` - удаляет товар, полученный в параметре из массива корзины.
`deleteAllPurchasedProducts(): void` - очистка корзины.
`getTotalCost(): number` - возвращает суммарную стоимость товаров в корзине.
`getItemsNumber(): number` - возвращает количество товаров в корзине.
`getItemAvailability(id: string): boolean` - проверяет наличие товара в корзине по его id, полученного в параметр метода.

#### Класс Customer

Хранит данные клиента.

Конструктор:  
Конструктор класса не принимает параметров.

Поля класса:  
`customer: IBuyer` - массив данных о клиенте

Методы:  
`setPaymentType(type: TPayment): void` - сохраняет выбранный клиентом тип оплаты.
`setEmail(email: string): void` - сохраняет емейл клиента.
`setPhone(phone: string): void` - сохраняет телефон клиента.
`setAddress(address: string): void` - сохраняет адрес доставки.
`getCustomerData(): IBuyer` - возвращает все данные клиента.
`deleteCustomerData(): void` - очищает данные клиента.
`validateCustomerData(): object` - валидирует данные клиента.

### Слой коммуникации

#### Класс ServerCommunication

Класс выполняет обмен информацией с сервером.

Конструктор:
`constructor(api : IApi)` - В конструктор передается экземпляр класса Api.

Поля класса:
`api: IApi` - экземпляр класса Api

Методы:
`getProducts(): Promise<IServer>` - получает с сервера данные о товарах.
`postOrderData(data : IOrder): Promise<IOrderResponce>` - отправляет на сервер данные о заказе.

### Слой представления

#### Класс Header

Класс отвечает за отображение шапки сайта.

Конструктор:
`constructor(protected events : IEvents, container: HTMLElement)` - принимает ссылку на DOM-элемент и брокер событий

Поля класса:
`cartButton : HTMLButtonElement` - кнопка корзины заказов
`counterElement : HTMLElement` - счетчик заказов корзины

Методы:
`set counter(value : number)` - меняет счетчик заказов корзины.

#### Класс Gallery

Класс отвечает за отображение галереи товаров.

Конструктор:
`constructor(container: HTMLElement)` - принимает ссылку на DOM-элемент и брокер событий

Поля класса:
`catalogElement : HTMLElement` - каталог товаров

Методы:
`set catalog(items : HTMLElement[])` - получает массив карточек товаров.

#### Класс Modal

Класс отвечает за отображение модального окна.

Конструктор:
`constructor(container: HTMLElement)` - принимает ссылку на DOM-элемент и брокер событий

Поля класса:
`modal : HTMLElement` - модальное окно
`modalElement : HTMLElement` - содержимое модального окна
`modalCloseButton : HTMLButtonElement` - кнопка закрытия модального окна

Методы:
`set content(value : HTMLElement)` - получает контент модального окна.
`close() : void` - закрывает модальное окно.
`open() : void` - открывает модальное окно.

#### Класс Card

Является родительским классом для всех карточек товаров.

Конструктор:
`constructor(container: HTMLElement)` - принимает ссылку на DOM-элемент и брокер событий

Поля класса:
`titleElement : HTMLElement` - название товара
`priceElement : HTMLElement` - цена товара

Методы:

`set title(value : string)` - отображает название товара.
`set price(value : number)` - отображает цену товара.

#### Класс OrderSuccess

Конструктор:
`constructor(protected events : IEvents, container: HTMLElement)` - принимает ссылку на DOM-элемент и брокер событий

Поля класса:
`orderDescriptionElement : HTMLElement` - показывает общую сумму сделанной покупки
`orderSuccessCloseButton : HTMLButtonElement` - кнопка возврата к каталогу товаров

Методы:
`set price(value : number)` - получает общую сумму сделанной покупки.

#### Класс CardCatalog

Конструктор:
`constructor(actions? : ICardActions, container: HTMLElement)` - принимает ссылку на DOM-элемент и функцию обработки событий

Поля класса:
`imageElement : HTMLImageElement` - картинка товара
`categoryElement : HTMLElement` - категория товара

Методы:
`set image(value : string)` - отображает картинку товара.
`set category(value : string)` - отображает категорию товара.

#### Класс CardPreview

Конструктор:
`constructor(protected events : IEvents, container: HTMLElement)` - принимает ссылку на DOM-элемент и функцию обработки событий

Поля класса:
`imageElement : HTMLImageElement` - картинка товара
`categoryElement : HTMLElement` - категория товара
`descriptionElement : HTMLElement` - описание товара
`orderButtonElement : HTMLButtonElement` - кнопка добавления товара в корзину

Методы:
`set image(value : string)` - отображает картинку товара.
`set category(value : string)` - отображает категорию товара.
`set description(value : string)` - отображает описание товара.
`unpricedButton() : void` - меняет отображение кнопки заказа для карточки без цены.
`deleteButton() : void` - меняет отображение кнопки заказа после добавления карточки в корзину.
`orderButton() : void` - меняет отображение кнопки заказа после удаления карточки из корзины.
`buttonDisabled(value: boolean) : void` - делает кнопку неактивной

#### Класс CardBasket

Конструктор:
`constructor(actions? : ICardActions, container: HTMLElement)` - принимает ссылку на DOM-элемент и функцию обработки событий

Поля класса:
`indexElement : HTMLElement` - индекс товара
`deleteButtonElement : HTMLButtonElement` - кнопка удаления товара из корзины

Методы:
`set index(value : number)` - отображает индекс товара.

#### Класс Basket

Конструктор:
`constructor(protected events : IEvents, container: HTMLElement)` - принимает ссылку на DOM-элемент и брокер событий

Поля класса:
`bascetListElement : HTMLElement` - список товаров в корзине
`orderButtonElement : HTMLButtonElement` - кнопка перехода к оформлению заказа
`totalPriceElement : HTMLElement` - суммарная цена товаров в корзине

Методы:
`set basketlist(basket : HTMLElement[])` - отображает список товаров в корзине.
`set totalprice(value : number)` - отображает суммарную цену товаров в корзине.
`buttonDisabled(value: boolean) : void` - делает кнопку заказа неактивной

#### Класс Form

Является родительским классом всех форм.

Конструктор:
`constructor(protected events : IEvents, container: HTMLElement)` - принимает ссылку на DOM-элемент и брокер событий

Поля класса:
`submitButton : HTMLButtonElement` - кнопка перехода на следующую форму
`errorElement : HTMLElement` - поле для вывода ошибок

Методы:
`set error(value: string)` - отображает ошибку формы.

#### Класс FormOrder

Конструктор:
`constructor(protected events : IEvents, container: HTMLElement)` - принимает ссылку на DOM-элемент и брокер событий

Поля класса:
`payCardButton : HTMLButtonElement` - кнопка оплаты картой
`payCashButton : HTMLButtonElement` - кнопка оплаты наличными
`addressElement : HTMLInputElement` - адрес доставки

Методы:
`set address(address : string)` - отображает введенный адрес.
`buttonDisabled(value: boolean)` - делает кнопку заказа неактивной.
`buttonUnclicked()` - убирает класс выбора кнопки типа оплаты.

#### Класс FormContacts

Конструктор:
`constructor(protected events : IEvents, container: HTMLElement)` - принимает ссылку на DOM-элемент и брокер событий

Поля класса:
`emailElement : HTMLInputElement` - почта клиента
`phoneElement : HTMLInputElement` - телефон клиента

Методы:
`set email(email : string)` - отображает введенный емейл.
`set phone(phone : string)` - отображает введенный номер.
`buttonDisabled(value: boolean)` - делает кнопку заказа неактивной.

### События

#### События слоя Представления

"basket:open" - нажатие кнопки открытия корзины
"card:select" - выбор карточки для просмотра
"cardbutton:click" - клик на кнопку в превью карточки (добавить или удалить товар из корзины)
"cardbasket:delete" - клик по кнопке удаления товара в открытой корзине
"form:open" - клик на кнопку Оформить в корзине
"pay:card" - клик по кнопке оплаты онлайн
"pay:cash" - клик по кнопке оплаты наличными
"input:address" - ввод адреса
"input:email" - ввод емейла
"input:phone" - ввод номера
"order:submit" - клик по кнопке перехода с первой формы на вторую
"contacts:submit" - клик отправки второй формы
"success:close" - клик по кнопке на экране успешного заказа

#### События Модели данных

"basket:changed" - изменение корзины
"productlist:changed" - изменение каталога товаров
"selectedproduct:changed" - изменение выбранного для просмотра товара
"customerdata:changed" - изменение данных клиента

#### Presenter

Код презентера осуществлен в файле main.ts и представляет собой обработчик событий.
