const todos = [
    { id: 1, task: "Mua bánh chưng", done: false },
    { id: 2, task: "Dọn nhà đón tết", done: false },
    { id: 3, task: "Gói bánh chưng", done: false },
    { id: 4, task: "Trang trí nhà cửa bằng hoa mai, hoa đào", done: false },
    { id: 5, task: "Mua phong bao lì xì", done: false },
    { id: 6, task: "Chuẩn bị mâm ngũ quả", done: false }
];
let nextId = 7;
let list = document.getElementById("todoList");
let input = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let data = JSON.parse(localStorage.getItem("myTodos"));
//baitap 2
function render() {
    list.innerHTML = "";
    for (let i = 0; i < todos.length; i++) {
        let li = document.createElement("li");
        li.innerHTML = `
            <span class="icon"></span>
            <span>${todos[i].task}</span>
            <span class="delete">🗑️</span>`;
        if (todos[i].done) {
            li.classList.add("done");
        }
        li.onclick = function () {
            todos[i].done = !todos[i].done;
            localStorage.setItem("myTodos", JSON.stringify(todos));
            render();
        }
        //gọi xoa bai tap 4
        deleteTask(li, i);
        list.appendChild(li);
    }
}
render();
//baitap3
addBtn.onclick = function () {
    let value = input.value.trim();
    if (value === "") {
        alert("Vui lòng nhập công việc");
        return;
    }
    let newTask = {
        id: nextId++,
        task: value,
        done: false
    };
    todos.push(newTask);
    localStorage.setItem("myTodos", JSON.stringify(todos));
    input.value = "";
    render();
}
input.addEventListener("keypress", function (hihihi) {
    if (hihihi.key === "Enter") {
        addBtn.click();
    }
});
// baitap 4
function deleteTask(li, index){
    let del = li.querySelector(".delete");
    del.onclick = function(e){
        let check = confirm("Bạn có chắc muốn xóa không?");
        if(check){
            todos.splice(index,1);
            localStorage.setItem("myTodos", JSON.stringify(todos));
            render();
        }
    }
}