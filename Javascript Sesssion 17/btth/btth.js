
/* 
    Danh sách sản phẩm: Render theo html
    1. tạo mảng chứa sản phẩm
*/
let products = [
    {
        id: 1,
        name: "sản phẩm 1",
        price: 5000
    },
    {
        id: 2,
        name: "sản phẩm 2",
        price: 5000
    },
    {
        id: 3,
        name: "sản phẩm 3",
        price: 5000
    },
];
localStorage.setItem("product", JSON.stringify(products));
//tạo hàm hiển thị
function render() {
    let str = "";
    for(let i = 0; i < products.length; i++) {
        str += `
            <div class="product-card">
                    <img src="/img/banhchung.webp" alt="">
                    <h3>${products[i].name}</h3>
                    <p class="price">${products[i].price}đ</p>
                    <button class="btn-add" >Thêm vào giỏ</button>
                </div>
        `
    }
    document.getElementById("product-list").innerHTML = str;
};
render();
