function init() {
    fetch("https://kea-alt-del.dk/t5/api/categories").then(r => r.json()).then(
        function (data) {
            categoriesRecieved(data)
        }
    )
}
init();

function categoriesRecieved(categ) {
    createNavigation(categ);
    createSections(categ);
    fetchProducts();
}

function createSections(categories) {
    categories.forEach(category => {
        const section = document.createElement("section");
        section.setAttribute("id", category);
        const h2 = document.createElement("h2");
        h2.textContent = category;
        section.appendChild(h2);
        document.querySelector(".productlist").appendChild(section);

    })
}

function createNavigation(categories) {
    categories.forEach(categ => {
        console.log(categ)
        const a = document.createElement("a");
        a.textContent = categ;
        a.setAttribute("href", `#${categ}`)
        document.querySelector("nav").appendChild(a);
    })
}

function fetchProducts() {
    fetch("https://kea-alt-del.dk/t5/api/productlist")
        .then(function (response) {
            console.log(response)
            return response.json();
        })
        .then(function (data) {

            dataReceived(data);
        })
}

function dataReceived(products) {
    products.forEach(showProduct)
}

function showProduct(myProduct) {
    console.log(myProduct)
    const temp = document.querySelector("#productTemplate").content;
    const myCopy = temp.cloneNode(true);

    const img = myCopy.querySelector(".product_image");
    img.setAttribute("src", `https://kea-alt-del.dk/t5/site/imgs/medium/${myProduct.image}-md.jpg`)
    if (!myProduct.discount) {
        myCopy.querySelector(".discount").classList.add("hidden")
    }
    if (myProduct.vegetarian) {
        myCopy.querySelector(".vegetarian").classList.remove("hidden");
    }
    if (myProduct.soldout) {
        const p = document.createElement("p");
        p.textContent = "Sold Out";
        p.classList.add("soldout")
        myCopy.querySelector("article").appendChild(p)

    }

    const article = myCopy.querySelector("article");

    if (myProduct.vegetarian) {
        article.classList.add("vegetarian")
    }
    if (myProduct.alcohol) {
        article.classList.add("alcoholic")
    }
    myCopy.querySelector(".data_name").textContent = myProduct.name;
    myCopy.querySelector(".data_description").textContent = myProduct.shortdescription;   myCopy.querySelector(".price").textContent = myProduct.price;
    myCopy.querySelector(".discount").textContent = myProduct.discount;



    myCopy.querySelector("button").addEventListener("click", () => {
        fetch(`https://kea-alt-del.dk/t5/api/product?id=` + myProduct.id)
            .then(res => res.json())
            .then(showDetails);
    });
    const parentElem = document.querySelector("section#" + myProduct.category);
    parentElem.appendChild(myCopy)
}

const modal = document.querySelector(".modal-background");
function showDetails(data) {
    console.log(data)
    modal.querySelector(".modal-name").textContent = data.name;
    modal.querySelector(".modal-description").textContent = data.longdescription;
    modal.querySelector(".modal-price").textContent = data.price;
    modal.classList.remove("hide");
}


modal.addEventListener("click", () => {
    modal.classList.add("hide");
});

const vegfilter = document.querySelector("#vegfilter");
vegfilter.addEventListener("click", vegFilterClicked);

function vegFilterClicked() {
    vegfilter.classList.toggle("active")
    const articles = document.querySelectorAll("article:not(.vegetarian)");
    articles.forEach(elem => {
        elem.classList.toggle("hidden")
    })
}

const alcfilter = document.querySelector("#alcfilter");
alcfilter.addEventListener("click", alcFilterClicked);

function alcFilterClicked() {
    alcfilter.classList.toggle("active")
    const articles = document.querySelectorAll("article.alcoholic");
    articles.forEach(elem => {
        elem.classList.toggle("hidden")
    })
}
