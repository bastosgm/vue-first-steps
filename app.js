const vm = new Vue({
  el: '#app',
  data: {
    products: [],
    product: false,
    cart: [],
    cartActive: false,
    messageAlert: '',
    alertActive: false,
  },
  //used to do filtering and looks like the methods itself. The parameter is the value itself of what is receiving the filter with pipe(|) and the return modifies and returns
  filters: {
    priceConvert(v) {
      // return `R$ ${v},00`;
      //study more about toLocaleString()
      return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    upper(v) {
      return v.toUpperCase();
    },
  },
  computed: {
    cartTotal() {
      let total = 0;
      if (this.cart.length) {
        this.cart.forEach((item) => {
          total += item.price;
        });
      }
      return total;
    },
  },
  methods: {
    fetchProducts() {
      fetch('./api/products.json')
        .then((r) => r.json())
        .then((r) => (this.products = r));
    },
    fetchProduct(id) {
      fetch(`./api/products/${id}/data.json`)
        .then((r) => r.json())
        .then((r) => (this.product = r));
    },
    showModal(id) {
      this.fetchProduct(id);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    //destructuring the object 'event' and taking the two elements
    hideModal({ target, currentTarget }) {
      //one-line if don't need to open and close braces
      if (target === currentTarget) this.product = false;
    },
    clickOutsideCart({ target, currentTarget }) {
      //one-line if don't need to open and close braces
      if (target === currentTarget) this.cartActive = false;
    },
    addItem() {
      this.product.stock--;
      const { id, name, price } = this.product;
      this.cart.push({ id, name, price });
      this.alert(`${name} has been added to cart`);
    },
    subItem(index) {
      this.cart.splice(index, 1);
    },
    checkLocalStorage() {
      if (window.localStorage.cart) {
        //convert localStorage cart from string to array again
        this.cart = JSON.parse(window.localStorage.cart);
      }
    },
    compareStock() {
      //the filter will return true or false
      const items = this.cart.filter(({ id }) => id === this.product.id);
      this.product.stock -= items.length;
    },
    alert(message) {
      this.messageAlert = message;
      this.alertActive = true;
      setTimeout(() => {
        this.alertActive = false;
      }, 2000);
    },
    router() {
      //'location' means url and seek what come after a hash
      const hash = document.location.hash;
      if (hash) {
        this.fetchProduct(hash.replace('#', ''));
      }
    },
  },
  watch: {
    product() {
      document.title = this.product.name || 'Feira_do_ZÉ!';
      const hash = this.product.id || '';
      //research about, but basically add #something in the url
      history.pushState(null, null, `#${hash}`);
      if (this.product) {
        this.compareStock();
      }
    },
    cart() {
      //creates a cart element in localStorage and as it receives texts/numbers, the JSON.stringify() method is used to convert the object into a string-object
      window.localStorage.cart = JSON.stringify(this.cart);
    },
  },
  created() {
    this.fetchProducts();
    this.router();
    this.checkLocalStorage();
  },
});
