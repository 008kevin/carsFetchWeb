const apiBase = "https://surveys-5jvt.onrender.com/api/cars";
const carContainer = document.getElementById("carsContainer");
const carModal = new bootstrap.Modal(document.getElementById('carModal'), {
  keyboard: false
});
const carInfoId = document.getElementById("carInfoId");
const carInfoMake = document.getElementById("carInfoMake");
const carInfoModel = document.getElementById("carInfoModel");
const carInfoYear = document.getElementById("carInfoYear");

setup();

async function setup() {
    let cars = await get();
    cars.forEach(c => {
        carContainer.innerHTML += getCarCard(c.id, c.model);
    });
}

function getCarCard(id, model) {
    return `<div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <h2 class="card-title">${model}</h2>
                        <button onclick="showInfo(${id})" class="btn btn-primary">Több információ</button>
                    </div>
                </div>
            </div>`;
}

async function showInfo(id) {
    carInfoId.innerText = "";
    carInfoMake.innerText = "";
    carInfoModel.innerText = "";
    carInfoYear.innerText = "";

    carModal.show();

    let car = await getById(id);
    carInfoId.innerText = car.id;
    carInfoMake.innerText = car.brand;
    carInfoModel.innerText = car.model;
    carInfoYear.innerText = car.year;
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