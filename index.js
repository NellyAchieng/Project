document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('productForm');
    const productIdField = document.getElementById('productId');
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    const productQuantity = document.getElementById('productQuantity');
    const formHeading = document.getElementById('formHeading');
    const submitBtn = document.getElementById('submitBtn');
    const productsSection = document.getElementById('products');

    function fetchProducts() {
        fetch('http://localhost:3000/products')
            .then(response => response.json())
            .then(products => displayProducts(products))
            .catch(error => console.error('Error fetching products:', error));
    }

    function displayProducts(products) {
        productsSection.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p>Price: Ksh ${product.price}</p>
                    <p>Quantity: ${product.quantity}</p>
                </div>
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            `;
            productsSection.appendChild(productDiv);
        });
    }

    productsSection.addEventListener('click', function(e) {
        //  Edit button
        if (e.target.classList.contains('edit-btn')) {
            const productId = e.target.getAttribute('data-id');
            editProduct(productId);
        }
    
        //  Delete button
        else if (e.target.classList.contains('delete-btn')) {
            const productId = e.target.getAttribute('data-id');
            deleteProduct(productId);
        }
    });
    
    

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const productData = {
            name: productName.value,
            price: parseInt(productPrice.value, 10),
            quantity: parseInt(productQuantity.value, 10),
        };

        const method = productIdField.value ? 'PUT' : 'POST';
        const url = productIdField.value ? `http://localhost:3000/products/${productIdField.value}` : 'http://localhost:3000/products';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        })
            .then(() => {
                resetForm();
                fetchProducts();
            })
            .catch(error => console.error('Error:', error));
    });

    window.editProduct = function (productId) {
        fetch(`http://localhost:3000/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                productName.value = product.name;
                productPrice.value = product.price;
                productQuantity.value = product.quantity;
                productIdField.value = product.id;
                formHeading.textContent = 'Edit Product';
                submitBtn.textContent = 'Save Changes';
            })
            .catch(error => console.error('Error fetching product:', error));
    };

    window.deleteProduct = function (productId) {
        fetch(`http://localhost:3000/products/${productId}`, { method: 'DELETE' })
            .then(() => {
                console.log('Product deleted');
                fetchProducts(); 
            })
            .catch(error => console.error('Error deleting product:', error));
    };


    function resetForm() {
        formHeading.textContent = 'Add New Product';
        submitBtn.textContent = 'Add Product';
        form.reset();
        productIdField.value = '';
    }

    fetchProducts();
});
