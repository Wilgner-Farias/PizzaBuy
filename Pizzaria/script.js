let modalQT = 1;
let cart = [];
let modalKey = 0;

const q = (e) => document.querySelector(e);
const qa = (e) => document.querySelectorAll(e);


pizzaJson.map((item, index) => {
    // Clonando 
    let pizzaItem = q('.models .pizza-item').cloneNode(true);
    
    // Colocando a informação de key na pizza
    pizzaItem.setAttribute('data-key', index);

    // Preechendo informações da pizza na tela principal
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    
    // Abrindo o menu
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        modalQT = 1;
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;
        
        // Preechendo informações das pizzas no modal 
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        q('.pizzaBig img').src = pizzaJson[key].img;
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        q('.pizzaInfo--size.selected').classList.remove('selected');

        qa('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        q('.pizzaInfo--qt').innerHTML = modalQT;
        q('.pizzaWindowArea').style.opacity = 0;
        q('.pizzaWindowArea').style.display = 'flex';

        setTimeout(() => {
            q('.pizzaWindowArea').style.opacity = 1;
        },200)
        
    });

    q('.pizza-area').append(pizzaItem);
});


function closeModal() {
    q('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        q('.pizzaWindowArea').style.display = 'none';
    },200);
}

qa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

q('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQT > 1) {
        modalQT--;
        q('.pizzaInfo--qt').innerHTML = modalQT;

    }
})

q('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQT++;
    q('.pizzaInfo--qt').innerHTML = modalQT;
})

qa('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// Adicionando pedido ao carrinho

q('.pizzaInfo--addButton').addEventListener('click', () => {
    let pizzaSize = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));
    let indentifier = pizzaJson[modalKey].id+'@'+pizzaSize;
    let key = cart.findIndex((item) => item.indentifier == indentifier);

    if(key > -1) {
        cart[key].qt += modalQT;
    } else {
            cart.push({
                indentifier,
                id: pizzaJson[modalKey].id,
                pizzaSize,
                qt: modalQT
            });
    }
    
    closeModal();
    showNotify();
    updateCart();

    setTimeout(() => {
        q('.notifyAdd').style.opacity = 0;
    }, 5000);

    setTimeout(() => {
        q('.notifyAdd').style.display = 'none'; 
    },6500)
});

function showNotify() {
    q('.notifyAdd').style.opacity = 0;
    q('.notifyAdd').style.display = 'flex';

    setTimeout(() => {
    q('.notifyAdd').style.opacity = 1;
    },500);
}

q('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        q('aside').style.left = '0';
    }
});

q('.menu-closer').addEventListener('click', () => {
    q('aside').style.left = '100vw';
});

function updateCart() {
    q('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        q('aside').classList.add('show');
        q('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id)
            subtotal += pizzaItem.price * cart[i].qt;
        
            let cartItem = q('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].pizzaSize) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })
            
            q('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        q('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        q('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
    } else {
        q('aside').classList.remove('show');
        q('aside').style.left = '100vw';
    }
}