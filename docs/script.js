document.addEventListener('DOMContentLoaded', () => {
    // Cart Management System
    class Cart {
        constructor() {
            this.items = JSON.parse(localStorage.getItem('novaCart')) || [];
            this.cartElement = document.querySelector('.cyber-cart');
            this.cartCount = document.querySelector('.cart-count');
            this.totalPrice = document.querySelector('.total-price');
            this.init();
        }

        init() {
            this.renderCart();
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => this.addItem(e));
            });
            
            document.querySelector('.cart-counter').addEventListener('click', () => 
                this.toggleCart());
            document.querySelector('.close-cart').addEventListener('click', () => 
                this.toggleCart());
        }

        addItem(e) {
            const product = e.target.closest('.product-card');
            const productId = product.dataset.id;
            const productName = product.querySelector('.product-title').textContent;
            const productPrice = parseFloat(product.querySelector('.price').textContent.replace('$', ''));
            
            const existingItem = this.items.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.items.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            
            this.saveCart();
            this.renderCart();
            this.animateAddToCart(product);
        }

        animateAddToCart(product) {
            const clone = product.cloneNode(true);
            const rect = product.getBoundingClientRect();
            
            clone.style.position = 'fixed';
            clone.style.width = `${rect.width}px`;
            clone.style.height = `${rect.height}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.left = `${rect.left}px`;
            clone.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            document.body.appendChild(clone);

            requestAnimationFrame(() => {
                const cartPos = document.querySelector('.cart-counter').getBoundingClientRect();
                clone.style.top = `${cartPos.top}px`;
                clone.style.left = `${cartPos.left}px`;
                clone.style.opacity = '0.5';
                clone.style.transform = 'scale(0.2)';
            });

            setTimeout(() => clone.remove(), 600);
        }

        saveCart() {
            localStorage.setItem('novaCart', JSON.stringify(this.items));
            this.updateCartCounter();
        }

        updateCartCounter() {
            this.cartCount.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
        }

        toggleCart() {
            this.cartElement.classList.toggle('active');
        }

        renderCart() {
            const cartItems = document.querySelector('.cart-items');
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <h4>${item.name}</h4>
                    <div class="item-details">
                        <span>Qty: ${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            `).join('');

            this.totalPrice.textContent = `$${this.items.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0).toFixed(2)}`;
        }
    }

    // Initialize Cart
    let novaCart;
    setTimeout(() => {
        novaCart = new Cart();
        novaCart.renderCart();
    }, 100);

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Product Filtering
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.filter-chip').forEach(c => 
                c.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent.toLowerCase().replace(' ', '-');
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.display = filter === 'all-products' ? 'block' : 
                    card.dataset.category === filter ? 'block' : 'none';
            });
        });
    });

    // Hologram Viewer Initialization
    function initHologramViewer() {
        const viewer = document.querySelector('.hologram-viewer');
        viewer.innerHTML = `
            <div class="hologram-placeholder">
                <div class="hologram-loader"></div>
                <p>Hologram Viewer Initializing...</p>
            </div>
        `;
    }
    initHologramViewer();

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 100;
                const targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});