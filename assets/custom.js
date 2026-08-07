document.addEventListener("DOMContentLoaded", (event) => {
    function renderPopup(product) {
        document.querySelector('.popup-image').innerHTML = `
            <img src="${product.featured_image}" alt="${product.title}">
        `;
        document.querySelector('.popup-title').textContent = product.title;
        document.querySelector('.popup-price').innerHTML = Shopify.formatMoney(product.price);
        document.querySelector('.popup-description').innerHTML =  product.description;
        let html = '';
        product.options.forEach((optionName, index) => {
            html += `<label>${optionName}</label><select class="variant-option" data-index="${index}">`;
            [...new Set(product.variants.map(v => v.options[index]))].forEach(value => {
                html += `<option value="${value}">${value}</option>`;
            });
            html += `</select>`;
        });

        document.querySelector('.popup-variants').innerHTML = html;
        updateVariant(product);
        document.querySelectorAll('.variant-option').forEach(select => {
            select.addEventListener('change', () => updateVariant(product));
        });
    }
    function updateVariant(product) {
        const values = [];
        document.querySelectorAll('.variant-option').forEach(select => {
            values.push(select.value);
        });
        const variant = product.variants.find(v =>JSON.stringify(v.options) === JSON.stringify(values));
        if (!variant) return;
        document.querySelector('input[name="id"]').value = variant.id;
        document.querySelector('.popup-price').innerHTML = Shopify.formatMoney(variant.price);
    }
    document.querySelectorAll('.look-icon').forEach((icon) => {
        icon.addEventListener('click', async function () {
            const handle = this.dataset.handle;
            const response = await fetch(`/products/${handle}.js`);
            // const product = await response.json();
            console.log(response)
            // renderPopup(product);
            document.getElementById('shop-look-popup').classList.add('active');
        });
    });

    document.getElementById('popup-product-form') .addEventListener('submit', function(e){
            e.preventDefault();
            fetch('/cart/add.js',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    id:this.id.value,
                    quantity:1
                })
            })
            .then(r=>r.json())
            .then(item=>{
                document.getElementById('shop-look-popup').classList.remove('active');
            });
        });
});