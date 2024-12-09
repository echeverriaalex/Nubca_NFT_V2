const productsContainer = document.querySelector('.products-container');
const showMoreBtn = document.querySelector(".btn-load");
const categoriesContainer = document.querySelector('.categories');
const categoriesList = document.querySelectorAll('.category');

//const productsCart = document.querySelector('.cart-container');

const cartBtn = document.querySelector('.cart-label');
const cartMenu = document.querySelector('.cart');
const menuBtn = document.querySelector('.menu-label');
const barsMenu = document.querySelector('.navbar-list');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.add-modal');
const total = document.querySelector('.total');

const cartTotal = document.querySelector('.cart-total');
const btnBuy = document.querySelector('.btn-buy');
const btnDelete = document.querySelector('.btn-delete');
const bubble = document.querySelector('.cart-bubble');
const quantity = document.querySelector('.quantity-handler');
const productsCart = document.querySelector('.cart-container');

let cart = JSON.parse(localStorage.getItem("cart")) || []

const saveCart = ()=>{
    localStorage.setItem("cart", JSON.stringify(cart));
}

const createProductTemplate = (product)=>{
    const {id, name, bid, user, cardImg, userImg } = product;
    return `
    <div class="product">
        <img src=${cardImg} alt=${name} />
        <div class="product-info">
            <div class="product-top">
                <h3>${name}</h3>
                <p>Current Bid</p>
            </div>
            <div class="product-mid">
                <div class="product-user">
                    <img src=${userImg} alt=${user}>
                    <p>${user}</p>
                </div>
                <span>${bid} eTH</span>
            </div>
            <div class="product-bot">
                <div class="product-offer">
                    <div class="offer-time">
                        <img src="./assets/img/fire.png" alt="Icono oferta">
                        <p>05:12:07</p>
                    </div>
                    <button 
                        class="btn-add"
                        data-id="${id}"
                        data-name="${name}"
                        data-bid="${bid}"
                        data-img="${cardImg}"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    </div>`;
};

const renderProducts = (productsList) =>{
    productsContainer.innerHTML += productsList
        .map(createProductTemplate)
        .join("");
};

// Logica del boton ver mas
const isLastIndexOf = () =>{
    return appState.currenProductIndex === appState.productsLimit - 1;
};

const showMoreProducts = ()=>{
    appState.currenProductIndex += 1;
    let {products, currenProductIndex} = appState;
    renderProducts(products[currenProductIndex]);

    if(isLastIndexOf()){
        showMoreBtn.classList.add('hidden');
    }
};

const renderFilteredProducts = () =>{
    const filteredProducts = productsData.filter((product) =>{
        return product.category  === appState.activeFilter
    })
    renderProducts(filteredProducts);
};

const setShowMoreVisibiliy = () =>{
    if(!appState.activeFilter){
        showMoreBtn.classList.remove('hidden');
        return
    }
    showMoreBtn.classList.add('hidden');
};

// Logica de los filtros
const isInactiveFilterBtn = (element) =>{
    return (
        element.classList.contains('category') && !element.classList.contains('active')
    )
};

const changeBtnActiveState = (selectedCategory) =>{
    let categories = [... categoriesList]
    categories.forEach((categoryBtn) =>{
        if(categoryBtn.dataset.category === selectedCategory){
            categoryBtn.classList.add('active');
            return;
        }
        categoryBtn.classList.remove('active');
    })
};

const changeFilterState = (btn) =>{
    appState.activeFilter = btn.dataset.category;
    changeBtnActiveState(appState.activeFilter);
    setShowMoreVisibiliy();
};

const applyFilter = ({target}) =>{
    if(!isInactiveFilterBtn(target)) return;
    changeFilterState(target);
    // Reinicio el contenedor de los productos a vacio
    productsContainer.innerHTML = "";
    if(appState.activeFilter){
        renderFilteredProducts();
        appState.currenProductIndex = 0;
        return
    }
    renderProducts(appState.products[0])
}

const toggleCart = () =>{
    cartMenu.classList.toggle("open-cart");
    if(barsMenu.classList.contains("open-menu")){
        barsMenu.classList.remove("open-menu");
        return
    }
    overlay.classList.toggle('show-overlay');
}

const toggleMenu = () =>{
    barsMenu.classList.toggle("open-menu");
    if(cartMenu.classList.contains("open-cart")){
        cartMenu.classList.remove("open-cart");
        return
    }
    overlay.classList.toggle("show-overlay");
}

const closeOnOverlayClick = ()=>{
    cartMenu.classList.remove("open-cart");
    barsMenu.classList.remove("open-menu");
    overlay.classList.remove("show-overlay");
}

const closeOnScroll = ()=>{
    if(barsMenu.classList.contains("open-menu") || cartMenu.classList.contains("open-cart")){
        cartMenu.classList.remove("open-cart");
        barsMenu.classList.remove("open-menu");
        overlay.classList.remove("show-overlay");
    }
}

const closeOnClick = (e)=>{
    if(e.target.classList.contains("navbar-link")) return
    barsMenu.classList.remove("open-menu");
    overlay.classList.remove("show-overlay");
}

const createCartProductTemplate = (item)=>{
    const {name, bid, quantity, img, id} = item;
    return `
        <div class="cart-item">
            <img src=${img} alt="NFT del carrito">
            <div class="item-info">
                <h3 class="item-title">${name}</h3>
                <p class="item-bid">Current bid</p>
                <span class="item-price">${bid}</span>
            </div>
            <div class="item-handler">
                <span class="quantity-handler down" data-id=${id}>-</span>
                <span class="item-quantity">${quantity}</span>
                <span class="quantity-handler up" data-id=${id}>+</span>
            </div>
        </div>
    `;
}

const renderCart = ()=>{
    if(!cart.length){
        productsCart.innerHTML = `<p class="emply-mesg">No hay productos en el carrito</p>`;
        return
    }
    productsCart.innerHTML = cart.map(createCartProductTemplate).join("");
}

const createProductData = (dataset)=>{
    const {bid, img, id, name} = dataset;
    return {bid, img, id, name};
}

const isExistingCartProduct = (productID) =>{
 return cart.find((product) => product.id === productID)
}

const showModelSuccess = (msg) =>{
    modal.classList.add("active-modal");
    modal.textContent = msg
    setTimeout(()=>{
        modal.classList.remove("active-modal");
    }, 3000)
};

const createCartProduct = (product) => {
    cart = [...cart, {...product, quantity: 1}];
}

const getTotalCart = () =>{
    return cart.reduce((acc, value) => {
        return (acc = acc + Number(value.bid) * value.quantity)
    }, 0);
}

const showCartTotal = ()=>{ 
    total.innerHTML = `${getTotalCart().toFixed(2)} eTH`
}

const disabledBtn = (btn) =>{
    if(!cart.length){
        btn.classList.add("disabled");
    }else{
        btn.classList.remove("disabled");
    }
};

const renderCartBubble = () => {
    bubble.textContent = cart.reduce(
        (acc, value) => (acc = acc + value.quantity), 0
    );
}

const updateCartState = ()=>{
    saveCart();
    renderCart();
    showCartTotal();
    disabledBtn(btnBuy);
    disabledBtn(btnDelete);
    renderCartBubble();
}

const addProduct = ({target})=>{
    if(!target.classList.contains("btn-add")) return
    const product = createProductData(target.dataset);

    if(isExistingCartProduct(product.id)){
        // Agrego una anidad al producto
        addUnitToProduct(product.id);
        showModelSuccess(`Agregaste una unidad al producto ${product.name}`);
    }
    else{
        createCartProduct(product);
        showModelSuccess(`Agregaste un producto al carrito: ${product.name}`);
    }
    updateCartState();
}

const removeProductFromCart = (productID) =>{
    cart = cart.filter((product) => product.id !== productID)
}

const addUnitToProduct = (productID) =>{
    cart = cart.map((product) => {
        return product.id === productID ? 
            {...product, quantity: product.quantity + 1}
            : product;
    })
}

const substractProductUnit = (productID) =>{
    cart = cart.map((product) => {
        return product.id === productID ?
            {...product, quantity: product.quantity - 1}
            : product
    })
}

const handleMinusQuantity = (productID) =>{
    const existingProduct = isExistingCartProduct(productID);
    if(existingProduct.quantity === 1 ){
        if(window.confirm("¿Desea eliminar el producto?")){
            removeProductFromCart(productID)
        }
        return
    }
    substractProductUnit(existingProduct.id);
}

const hadleQuantity = (e) =>{
    const {target} = e;
    if(target.classList.contains("up")){
        addUnitToProduct(target.dataset.id)
    }
    else if(target.classList.contains("down")){
        handleMinusQuantity(target.dataset.id)
    }
    updateCartState();
}

const resetCart = () =>{
    cart = [];
    updateCartState();
}

const completeBtnAction = (confirmMsg, successMsg) =>{
    if(!cart.length) return
    if(window.confirm(confirmMsg)){
        resetCart()
        alert(successMsg)
    }
}

const completeBuy = () =>{
    completeBtnAction("¿Desea finalizar la compra?", "¡Gracias por su compra!");
}

const deleteCart = () =>{
    completeBtnAction("¿Desea vaciar el carrito?", "Carrito vacio!");
}


const init = () =>{
    renderProducts(appState.products[0]);
    showMoreBtn.addEventListener("click", showMoreProducts)
    categoriesContainer.addEventListener("click", applyFilter)
    cartBtn.addEventListener("click", toggleCart)
    menuBtn.addEventListener("click", toggleMenu)
    barsMenu.addEventListener("click", closeOnClick);
    overlay.addEventListener("click", closeOnOverlayClick)
    window.addEventListener("scroll", closeOnScroll);
    window.addEventListener("DOMContentLoaded", renderCart);
    window.addEventListener("DOMContentLoaded", showCartTotal);
    productsContainer.addEventListener("click", addProduct)
    productsCart.addEventListener("click", hadleQuantity)
    btnBuy.addEventListener("click", completeBuy)
    btnDelete.addEventListener("click", deleteCart)
    disabledBtn(btnBuy);
    disabledBtn(btnDelete);
    renderCartBubble();
};

init();