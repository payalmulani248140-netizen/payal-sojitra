document.addEventListener("DOMContentLoaded", (event) => {
    function renderPopup(product) {

        document.querySelector('.popup-image').innerHTML = `
            <img src="${product.featured_image}" alt="${product.title}">
        `;

        document.querySelector('.popup-title').textContent = product.title;
        document.querySelector('.popup-description').innerHTML = product.description;

        let html = '';

        product.options.forEach((optionName, index) => {

            const values = [...new Set(product.variants.map(v => v.options[index]))];

            const isColor = ['color', 'colour'].includes(optionName.toLowerCase());

            html += `<div class="variant-group">`;
            html += `<label>${optionName}</label>`;

            if (isColor) {

                html += `<div class="color-swatches">`;

                values.forEach((value, i) => {

                    html += `
                        <label class="swatch">
                            <input
                                type="radio"
                                name="option-${index}"
                                value="${value}"
                                ${i === 0 ? 'checked' : ''}>

                            <span
                                class="swatch-color"
                                style="background:${value.toLowerCase()};"
                                title="${value}">
                            </span>
                        </label>
                    `;

                });

                html += `</div>`;

            } else {

                html += `<select class="variant-option" data-index="${index}">`;

                values.forEach(value => {

                    html += `
                        <option value="${value}">
                            ${value}
                        </option>
                    `;

                });

                html += `</select>`;

            }

            html += `</div>`;

        });

        document.querySelector('.popup-variants').innerHTML = html;

        document
            .querySelectorAll('.variant-option, .color-swatches input')
            .forEach(el => {

                el.addEventListener('change', () => updateVariant(product));

            });

        updateVariant(product);

    }
    function updateVariant(product) {

        const selectedOptions = [];

        product.options.forEach((optionName, index) => {

            const isColor = ['color', 'colour'].includes(optionName.toLowerCase());

            if (isColor) {

                selectedOptions.push(
                    document.querySelector(`input[name="option-${index}"]:checked`).value
                );

            } else {

                selectedOptions.push(
                    document.querySelector(`select[data-index="${index}"]`).value
                );

            }

        });

        const variant = product.variants.find(v =>
            JSON.stringify(v.options) === JSON.stringify(selectedOptions)
        );

        if (!variant) return;

        document.querySelector('input[name="id"]').value = variant.id;

        document.querySelector('.popup-price').innerHTML =
            Shopify.formatMoney(variant.price);

    }
    document.querySelectorAll('.look-icon').forEach((icon) => {
        icon.addEventListener('click', async function () {
            const handle = this.dataset.handle;
            const response = await fetch(`${handle}.js`);
            const product = await response.json();
            console.log(product)
            renderPopup(product);
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