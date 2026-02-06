const apiBase = "https://surveys-5jvt.onrender.com/api/cars";
const carContainer = document.getElementById("carsContainer");
const carModal = document.getElementById("carModal");

setup();

async function setup() {
    let cars = await get();
    console.log(cars);
    cars.forEach(c => {
        carContainer.innerHTML += getCarCard(c.id, c.model);
    });
}

function getCarCard(id, model) {
    return `<div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <h2 class="card-title">${model}</h2>
                        <a onclick="showInfo(${id})" class="btn btn-primary">Több információ</a>
                    </div>
                </div>
            </div>`;
}

async function showInfo(id) {
    
}


async function get() {
    const response = await fetch(apiBase);
    const json = await response.json();
    return json;
}

async function getById(id) {
    const respone = await fetch(apiBase+`/${id}`);
    const json = await respone.json();
    return json;
}

function post(model, brand, year) {
    return fetch(apiBase, {
        method: 'POST',
        body: JSON.stringify({
            "model": model,
            "brand": brand,
            "year": year
        }),
        headers: {
            'content-type': "application/json; charset=UTF=8"
        }
    })
    .then((request) => {
        return request.json();
    })
    .then((json) => {
        return json;
    });
}

function put(id, model, brand, year) {
    fetch(apiBase + `/${id}`, JSON.stringify({
        method: "PUT",
        body: {
            'model': model,
            'brand': brand,
            'year': year
        },
        headers: {
            'content-type': "application/json; charset=UTF=8"
        }
    }))
    .then((request) => {
        return request.json();
    })
    .then((json) => {
        return json;
    });
}

function remove(id) {
    fetch(apiBase+`/${id}`, JSON.stringify({
        method: "DELETE"
    }))
    .then((request) => {
        return request.json();
    })
    .then((json) => {
        return json;
    });
}