(() => {
    const carousel = {
      apiUrl: 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json',
      products: [],
      favorites: [],
      currentIndex: 0,
  
      init() {
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
          console.log('wrong page');
          return;
        }
        this.loadFavorites();
        this.loadProducts();
      },
  
      loadFavorites() {
        const stored = localStorage.getItem('favorites');
        this.favorites = stored ? JSON.parse(stored) : [];
      },
  
      saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      },
  
      async loadProducts() {
        const cached = localStorage.getItem('products');
        
        if (cached) {
          this.products = JSON.parse(cached);
          this.buildCarousel();
        } else {
          try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            this.products = data.products || data;
            localStorage.setItem('products', JSON.stringify(this.products));
            this.buildCarousel();
          } catch (error) {
            console.error('Ürünler yüklenemedi:', error);
          }
        }
      },
  
      buildCarousel() {
        this.renderHTML();
        this.addStyles();
        this.attachEvents();
        this.updateCarousel();
      },
  
       renderHTML() {
         const heroBanner = document.querySelector('.hero.banner') || document.querySelector('.hero-banner') || document.body;
         
         const html = `
           <div class="ebebek-banner">
             <div class="container">
             <h2 class="ebebek-carousel-title">Beğenebileceğinizi düşündüklerimiz</h2>
             <div class="ebebek-carousel-track-container">
               <div class="ebebek-carousel-track">
                 ${this.products.map(p => this.createCard(p)).join('')}
               </div>
             </div>
           </div>
           <button class="ebebek-carousel-btn ebebek-carousel-prev">
             <i class="toys-icon toys-icon-arrow-left"></i>
           </button>
           <button class="ebebek-carousel-btn ebebek-carousel-next">
             <i class="toys-icon toys-icon-arrow-right"></i>
           </button>
         </div>
       `;
         
         heroBanner.insertAdjacentHTML('afterend', html);
       },
  
      createCard(product) {
        const isFavorite = this.favorites.includes(product.id);
        const hasDiscount = product.price !== product.original_price;
        const discount = hasDiscount 
          ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
          : 0;
  
        return `
          <div class="ebebek-product-item" data-id="${product.id}">
            <div class="ebebek-product-link">
              <figure class="ebebek-product-img">
                <img src="${product.img}" alt="${product.name}">
              </figure>
              <div class="ebebek-product-content">
                <h2 class="ebebek-product-title">
                  <b>${product.brand || 'e-bebek'}</b> - ${product.name}
                </h2>
              </div>
              <div class="ebebek-product-price">
                ${hasDiscount ? `
                  <div class="ebebek-old-price">
                    ${product.original_price.toFixed(2).replace('.', ',')} TL
                    <span class="ebebek-discount">%${discount}</span>
                  </div>
                   <div class="ebebek-new-price">
                     ${Math.floor(product.price)}<span class="ebebek-decimal">,${(product.price % 1).toFixed(2).substring(2)}</span> <span class="ebebek-currency">TL</span>
                   </div>
                 ` : `
                   <div class="ebebek-current-price">
                     ${Math.floor(product.price)}<span class="ebebek-decimal">,${(product.price % 1).toFixed(2).substring(2)}</span> <span class="ebebek-currency">TL</span>
                   </div>
                 `}
              </div>
            </div>
            <div class="ebebek-favorite-wrapper">
              <div class="ebebek-heart">
                <div class="ebebek-icon-wrapper">
                  <i class="ebebek-icon ebebek-heart-outline" style="display: ${isFavorite ? 'none' : 'inline-block'}"></i>
                  <i class="ebebek-icon ebebek-heart-filled" style="display: ${isFavorite ? 'inline-block' : 'none'}"></i>
                </div>
              </div>
            </div>
            <button class="ebebek-add-cart">
              <span class="ebebek-plus">+</span>
            </button>
          </div>
        `;
      },
  
      addStyles() {
        const style = document.createElement('style');
        style.textContent = `
          .ebebek-banner {
            max-width: 1140px;
            margin: 40px auto;
            position: relative;
            padding: 0 !important;
          }
          .ebebek-banner .container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            width: 100% !important;
          }
          .ebebek-container {
            background: #fff;
            padding: 0 !important;
            margin: 0 !important;
          }
           .ebebek-carousel-title {
             color: #2b2f33;
             font-size: 24px;
             margin: 0 0 24px 0;
             font-family: Quicksand-SemiBold, sans-serif;
             font-weight: 700;
           }
           .ebebek-carousel-btn {
             position: absolute;
             top: 50%;
             transform: translateY(-50%);
             width: 40px;
             height: 40px;
             border-radius: 50%;
             border: none;
             background: #fff;
             cursor: pointer;
             display: flex;
             align-items: center;
             justify-content: center;
             z-index: 10;
             box-shadow: 0 6px 2px 0 #b0b0b003, 0 2px 9px 0 #b0b0b014, 0 2px 4px 0 #b0b0b024, 0 0 1px 0 #b0b0b03d, 0 0 1px 0 #b0b0b047;
           }
           .ebebek-carousel-prev {
             left: -50px;
           }
           .ebebek-carousel-next {
             right: -50px;
           }
           .ebebek-carousel-btn .toys-icon {
             font-size: 14px;
             width: 14px;
             height: 14px;
           }

          .ebebek-carousel-track-container {
            overflow: hidden;
            width: 100%;
          }
          .ebebek-carousel-track {
            display: flex;
            gap: 8px;
            transition: transform 0.3s ease;
            width: 100%;
          }
          .ebebek-product-item {
            width: 275.5px;
            height: 400px;
            flex-shrink: 0;
            border: 1px solid #f2f5f7;
            border-radius: 8px;
            background: #fff;
            position: relative;
            cursor: pointer;
            font-family: Quicksand-Medium, sans-serif;
          }
          .ebebek-product-link {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          .ebebek-product-img {
            width: 100%;
            padding-top: 100%;
            background: #f7f9fa;
            position: relative;
            margin: 0;
          }
          .ebebek-product-img img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .ebebek-product-content {
            padding: 16px;
            flex: 1;
          }
          .ebebek-product-title {
            font-size: 12px;
            font-weight: 500;
            color: #2b2f33;
            margin: 0 0 10px 0;
            overflow: hidden;
          }
          .ebebek-product-title b {
            font-weight: 600;
          }
          .ebebek-product-price {
            padding: 0 16px 16px;
          }
           .ebebek-old-price {
             font-size: 12px;
             color: #a2b1bc;
             display: flex;
             align-items: center;
             gap: 4px;
             font-family: Quicksand-SemiBold, sans-serif;
           }
           .ebebek-discount {
             background-color: #00a365;
             color: #fff;
             border-radius: 16px;
             padding: 0 4px;
             font-size: 12px;
             font-weight: 600;
           }
           .ebebek-new-price {
             font-weight: 700;
             font-size: 20px;
             line-height: 20px;
             color: #00a365;
             font-family: Quicksand-SemiBold, sans-serif;
           }
           .ebebek-new-price .ebebek-decimal {
             font-size: 14px;
           }
           .ebebek-new-price .ebebek-currency {
             font-size: 14px;
           }
           .ebebek-current-price {
             font-size: 20px;
             line-height: 20px;
             color: #2b2f33;
             margin-right: 8px;
             line-height: normal;
             font-weight: 600;
             font-family: Quicksand-SemiBold, sans-serif;
           }
           .ebebek-current-price .ebebek-decimal {
             font-size: 14px;
           }
           .ebebek-current-price .ebebek-currency {
             font-size: 14px;
           }
          .ebebek-favorite-wrapper {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 3;
          }
          .ebebek-heart {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            border: 1.4px solid #fff;
            border-radius: 100%;
            cursor: pointer;
          }
          .ebebek-icon-wrapper {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            border: 1.4px solid #fff;
            border-radius: 100%;
          }
          .ebebek-icon {
            height: 15px;
            width: 15px;
            display: inline-block;
          }
          .ebebek-heart-outline {
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23a2b1bc" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>') center/contain no-repeat;
          }
          .ebebek-heart-filled {
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b35" stroke="%23ff6b35" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>') center/contain no-repeat;
          }
          .ebebek-add-cart {
            position: absolute;
            bottom: 8px;
            right: 8px;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: none;
            background: #fff;
            color: #0091d5;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .ebebek-plus {
            font-size: 20px;
            font-weight: 300;
            line-height: 1;
          }
          .ebebek-add-cart:hover {
            background: #0091d5;
            color: #fff;
          }
          @media (max-width: 1200px) {
            .ebebek-carousel-prev { left: 0px; }
            .ebebek-carousel-next { right: 0px; }
          }
          @media (max-width: 992px) {
            .ebebek-carousel-prev { left: 0px; }
            .ebebek-carousel-next { right: 0px; }
          }
          @media (max-width: 768px) {
            .ebebek-product-item { width: 200px; }
            .ebebek-carousel-prev { left: 0px; }
            .ebebek-carousel-next { right: 0px; }
            .ebebek-carousel-btn { width: 36px; height: 36px; }
          }
          @media (max-width: 480px) {
            .ebebek-product-item { width: 180px; }
            .ebebek-carousel-prev { left: 0px; }
            .ebebek-carousel-next { right: 0px; }
            .ebebek-carousel-btn { width: 32px; height: 32px; }
            .ebebek-carousel-title { font-size: 20px; }
          }
        `;
        document.head.appendChild(style);
      },
  
      attachEvents() {
        const prevBtn = document.querySelector('.ebebek-carousel-prev');
        const nextBtn = document.querySelector('.ebebek-carousel-next');
  
        prevBtn?.addEventListener('click', () => {
          this.currentIndex = Math.max(0, this.currentIndex - 1);
          this.updateCarousel();
        });
  
        nextBtn?.addEventListener('click', () => {
          const max = Math.max(0, this.products.length - this.getVisibleCount());
          this.currentIndex = Math.min(max, this.currentIndex + 1);
          this.updateCarousel();
        });
  
        document.querySelectorAll('.ebebek-product-item').forEach(item => {
          item.addEventListener('click', (e) => {
            if (e.target.closest('.ebebek-favorite-wrapper, .ebebek-add-cart')) return;
            
            const id = item.dataset.id;
            const product = this.products.find(p => p.id == id);
            if (product?.url) window.open(product.url, '_blank');
          });
        });
  
        document.querySelectorAll('.ebebek-favorite-wrapper').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.closest('.ebebek-product-item').dataset.id);
            this.toggleFavorite(id, btn);
          });
        });
  
        window.addEventListener('resize', () => this.updateCarousel());
      },
  
      toggleFavorite(id, wrapper) {
        const index = this.favorites.indexOf(id);
        const outline = wrapper.querySelector('.ebebek-heart-outline');
        const filled = wrapper.querySelector('.ebebek-heart-filled');
        
        if (index > -1) {
          this.favorites.splice(index, 1);
          outline.style.display = 'inline-block';
          filled.style.display = 'none';
        } else {
          this.favorites.push(id);
          outline.style.display = 'none';
          filled.style.display = 'inline-block';
        }
        
        this.saveFavorites();
      },
  
      getVisibleCount() {
        const width = window.innerWidth;
        if (width <= 480) return 1;
        if (width <= 768) return 2;
        if (width <= 992) return 3;
        if (width <= 1200) return 4;
        return 5;
      },
  
      updateCarousel() {
        const track = document.querySelector('.ebebek-carousel-track');
        const prevBtn = document.querySelector('.ebebek-carousel-prev');
        const nextBtn = document.querySelector('.ebebek-carousel-next');
        
        if (!track) return;

        const visibleCount = this.getVisibleCount();
        const itemWidth = 275.5 + 8;
        const offset = -(this.currentIndex * itemWidth);
        
        track.style.transform = `translateX(${offset}px)`;
        
        track.style.width = `${visibleCount * itemWidth}px`;

      }
    };
  
    carousel.init();
  })();