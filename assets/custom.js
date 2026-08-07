document.addEventListener("DOMContentLoaded", (event) => {
    function renderPopup(product) {
        document.querySelector('.popup-image').innerHTML = `
            <img src="${product.featured_image}" alt="${product.title}">
        `;
        document.querySelector('.popup-title').textContent = product.title;
        // document.querySelector('.popup-price').innerHTML = Shopify.formatMoney(product.price);
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
    function renderVariants(product) {
        const container = document.querySelector('.popup-variants');
        container.innerHTML = '';

        product.options.forEach((optionName, optionIndex) => {

            const values = [...new Set(product.variants.map(v => v.options[optionIndex]))];

            const isColor =
                optionName.toLowerCase() === 'color' ||
                optionName.toLowerCase() === 'colour';

            if (isColor) {

                let html = `
                    <div class="variant-group">
                        <label>${optionName}</label>
                        <div class="color-swatches">
                `;

                values.forEach((value, index) => {

                    html += `
                        <label class="swatch">
                            <input
                                type="radio"
                                name="option-${optionIndex}"
                                value="${value}"
                                ${index === 0 ? 'checked' : ''}>

                            <span
                                class="swatch-color"
                                style="background:${value.toLowerCase()};"
                                title="${value}">
                            </span>
                        </label>
                    `;

                });

                html += `
                        </div>
                    </div>
                `;

                container.insertAdjacentHTML('beforeend', html);

            } else {

                let html = `
                    <div class="variant-group">
                        <label>${optionName}</label>

                        <select class="variant-select" data-index="${optionIndex}">
                `;

                values.forEach((value) => {

                    html += `<option value="${value}">${value}</option>`;

                });

                html += `
                        </select>
                    </div>
                `;

                container.insertAdjacentHTML('beforeend', html);

            }

        });

        document
            .querySelectorAll('.swatch input, .variant-select')
            .forEach(el => {
                el.addEventListener('change', () => updateVariant(product));
            });

        updateVariant(product);

    }
    function updateVariant(product) {

        const selected = [];
        product.options.forEach((option, index) => {
            const isColor = option.toLowerCase() === 'color' || option.toLowerCase() === 'colour';
            if (isColor) {
                selected.push(document.querySelector(`input[name="option-${index}"]:checked`).value);
            } else {
                selected.push(
                    document.querySelector(
                        `.variant-select[data-index="${index}"]`
                    ).value
                );

            }

        });

        const variant = product.variants.find(v =>
            JSON.stringify(v.options) === JSON.stringify(selected)
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