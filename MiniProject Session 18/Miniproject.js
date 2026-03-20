const STORAGE_KEY = "products_data";

let products = [];
let idCounter = 1;
let editingId = null;

const productForm = document.getElementById("productForm");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");
const productQuantity = document.getElementById("productQuantity");
const productDescription = document.getElementById("productDescription");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

const tableContainer = document.getElementById("table-container");

const totalProducts = document.getElementById("totalProducts");
const totalValue = document.getElementById("totalValue");
const totalQuantity = document.getElementById("totalQuantity");

function saveData() {
  let data = {
    products: products,
    idCounter: idCounter,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
  let data = localStorage.getItem(STORAGE_KEY);

  if (data) {
    try {
      let parsedData = JSON.parse(data);
      products = parsedData.products || [];
      idCounter = parsedData.idCounter || 1;
    } catch (error) {
      console.log("Lỗi đọc dữ liệu");
      products = [];
      idCounter = 1;
    }
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function renderProducts(list = products) {
  if (list.length === 0) {
    tableContainer.innerHTML = `
      <div class="empty-state">
        <p>Chưa có sản phẩm nào</p>
      </div>
    `;
    return;
  }

  let html = `
    <table class="product-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên sản phẩm</th>
          <th>Danh mục</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Mô tả</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < list.length; i++) {
    let p = list[i];
    let moTa = p.description ? p.description : "Không có mô tả";
    let quantityClass = "";

    if (p.quantity < 10) {
      quantityClass = "low-stock";
    }

    html += `
      <tr>
        <td>${p.id}</td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td>${formatPrice(p.price)}</td>
        <td class="${quantityClass}">${p.quantity}</td>
        <td>${moTa}</td>
        <td>
          <button onclick="editProduct(${p.id})">Sửa</button>
          <button onclick="deleteProduct(${p.id})">Xóa</button>
        </td>
      </tr>
    `;
  }

  html += `
      </tbody>
    </table>
  `;

  tableContainer.innerHTML = html;
}

function updateStats() {
  totalProducts.textContent = products.length;

  let tongGiaTri = 0;
  let tongSoLuong = 0;

  for (let i = 0; i < products.length; i++) {
    tongGiaTri += products[i].price * products[i].quantity;
    tongSoLuong += products[i].quantity;
  }

  totalValue.textContent = formatPrice(tongGiaTri);
  totalQuantity.textContent = tongSoLuong;
}

function resetForm() {
  productForm.reset();
  editingId = null;
  formTitle.textContent = "Thêm Sản Phẩm Mới";
  submitBtn.innerHTML = "➕ Thêm Sản Phẩm";
  cancelBtn.style.display = "none";
}

productForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let name = productName.value.trim();
  let category = productCategory.value;
  let price = parseFloat(productPrice.value);
  let quantity = parseInt(productQuantity.value);
  let description = productDescription.value.trim();

  if (name === "" || category === "" || isNaN(price) || isNaN(quantity)) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  if (price < 0) {
    alert("Giá không được âm");
    return;
  }

  if (quantity < 0) {
    alert("Số lượng không được âm");
    return;
  }

  if (editingId === null) {
    let newProduct = {
      id: idCounter,
      name: name,
      category: category,
      price: price,
      quantity: quantity,
      description: description,
    };

    products.push(newProduct);
    idCounter++;
    alert("Thêm sản phẩm thành công");
  } else {
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === editingId) {
        products[i].name = name;
        products[i].category = category;
        products[i].price = price;
        products[i].quantity = quantity;
        products[i].description = description;
        break;
      }
    }
    alert("Cập nhật sản phẩm thành công");
  }

  saveData();
  renderProducts();
  updateStats();
  resetForm();
});

function editProduct(id) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      productName.value = products[i].name;
      productCategory.value = products[i].category;
      productPrice.value = products[i].price;
      productQuantity.value = products[i].quantity;
      productDescription.value = products[i].description;

      editingId = id;

      formTitle.textContent = "Chỉnh Sửa Sản Phẩm";
      submitBtn.innerHTML = "💾 Cập Nhật";
      cancelBtn.style.display = "inline-block";

      document
        .querySelector(".form-section")
        .scrollIntoView({ behavior: "smooth" });

      break;
    }
  }
}

function deleteProduct(id) {
  let index = -1;

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    return;
  }

  let check = confirm(
    `Bạn có chắc chắn muốn xóa sản phẩm "${products[index].name}" không?`
  );

  if (check) {
    products.splice(index, 1);

    if (editingId === id) {
      resetForm();
    }

    saveData();
    renderProducts();
    updateStats();
    alert("Xóa sản phẩm thành công");
  }
}

function clearAllData() {
  let check = confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm không?");

  if (check) {
    products = [];
    idCounter = 1;
    editingId = null;

    localStorage.removeItem(STORAGE_KEY);

    renderProducts();
    updateStats();
    resetForm();

    alert("Đã xóa toàn bộ sản phẩm");
  }
}

function searchAndFilter() {
  let keyword = searchInput.value.toLowerCase().trim();
  let category = filterCategory.value;

  let result = [];

  for (let i = 0; i < products.length; i++) {
    let matchName = true;
    let matchCategory = true;

    if (keyword !== "") {
      if (!products[i].name.toLowerCase().includes(keyword)) {
        matchName = false;
      }
    }

    if (category !== "") {
      if (products[i].category !== category) {
        matchCategory = false;
      }
    }

    if (matchName && matchCategory) {
      result.push(products[i]);
    }
  }

  renderProducts(result);
}

cancelBtn.addEventListener("click", resetForm);
clearAllBtn.addEventListener("click", clearAllData);
searchInput.addEventListener("input", searchAndFilter);
filterCategory.addEventListener("change", searchAndFilter);

function init() {
  loadData();
  renderProducts();
  updateStats();
}

init();