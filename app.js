let section = document.querySelector("section");
let add = document.querySelector("form button");

// Set default date and time of inputs
document.querySelector("form input[type='date']").value = new Date()
  .toLocaleString("zh-tw", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  .replaceAll("/", "-");

document.querySelector("form input[type='time']").value =
  new Date().toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "numeric",
  });

// Create, complete, and remove todo tasks
add.addEventListener("click", (e) => {
  // prevent form from being submtting
  e.preventDefault();

  // get the input values
  let form = e.target.parentElement;
  let todoText = form[0].value;
  let todoDate = form[1].value;
  let todoTime = form[2].value;

  if (todoText === "") {
    alert("Please enter your task");
    return;
  }
  if (todoDate === "" || todoTime === "") {
    alert("Please enter due date and time");
    return;
  }

  //create a todo
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoDate + " " + todoTime;
  todo.appendChild(text);
  todo.appendChild(time);
  todo.setAttribute("done", false);

  // create complete buttons
  let todoButton = document.createElement("div");
  todoButton.classList.add("todo-btn");
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  todoButton.appendChild(completeButton);
  todoButton.appendChild(trashButton);
  todo.appendChild(todoButton);
  todo.style.animation = "scaleUp 0.25s frowards";

  // create an object
  let todoItem = {
    todoDate: todoDate,
    todoTime: todoTime,
    todoText: todoText,
    todoDone: todo.classList.contains("done"),
  };

  // store data into an array of objects
  let list = localStorage.getItem("list");
  if (list == null || list == "" || list == "undefined") {
    localStorage.setItem("list", JSON.stringify([todoItem]));
  } else {
    let listAry = JSON.parse(list);
    listAry.push(todoItem);
    localStorage.setItem("list", JSON.stringify(listAry));
  }

  // complete list-items
  completeButton.addEventListener("click", (e) => {
    todo.classList.toggle("done");
    todo.setAttribute("done", todo.classList.contains("done"));
  });

  // remove list-items
  trashButton.addEventListener("click", (e) => {
    let removeItem = e.target.parentElement.parentElement; // get todo div
    removeItem.style.animation = "scaleDown 0.25s forwards";
    removeItem.addEventListener("animationend", () => {
      removeItem.remove();
      // remove from local storage
      let removeText = removeItem.querySelector(".todo-text").innerText; // get todo-text
      let listAry = JSON.parse(localStorage.getItem("list"));
      listAry.forEach((item, index) => {
        if (item.todoText == removeText) {
          listAry.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(listAry));
        }
      });
    });
    // todoItem.remove();   // remove instantly and cannot "see" the animation
  });

  section.appendChild(todo);

  // clear the input if added item in the list
  form.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
});

// load data before use
loadData();

// load local storage
function loadData() {
  let list = localStorage.getItem("list");
  if (list !== "undefined" && list !== "" && list != null) {
    let listAry = JSON.parse(list);
    listAry.forEach((item) => {
      //create a todo
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let todoText = document.createElement("p");
      todoText.classList.add("todo-text");
      todoText.innerText = item.todoText;
      let todoTime = document.createElement("p");
      todoTime.classList.add("todo-time");
      todoTime.innerText = item.todoDate + " " + item.todoTime;
      todo.appendChild(todoText);
      todo.appendChild(todoTime);
      if (item.todoDone === true) {
        todo.classList.add("done");
        todo.setAttribute("done", true);
      } else {
        todo.setAttribute("done", false);
      }

      // create buttons
      let todoButton = document.createElement("div");
      todoButton.classList.add("todo-btn");
      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      todoButton.appendChild(completeButton);
      todoButton.appendChild(trashButton);
      todo.appendChild(todoButton);
      todo.style.animation = "scaleUp 0.25s frowards";

      // complete list-items
      completeButton.addEventListener("click", (e) => {
        todo.classList.toggle("done");
        todo.setAttribute("done", todo.classList.contains("done"));
        let completeText =
          e.target.parentElement.parentElement.querySelector(
            ".todo-text"
          ).innerText;
        let listAry = JSON.parse(localStorage.getItem("list"));
        listAry.forEach((item) => {
          if (item.todoText == completeText) {
            item.todoDone = todo.classList.contains("done");
            localStorage.setItem("list", JSON.stringify(listAry));
          }
        });
      });

      // remove list-items
      trashButton.addEventListener("click", (e) => {
        let removeItem = e.target.parentElement.parentElement; // get todo div
        removeItem.style.animation = "scaleDown 0.25s forwards";
        removeItem.addEventListener("animationend", () => {
          removeItem.remove();
          // remove from local storage
          let removeText = removeItem.querySelector(".todo-text").innerText; // get todo-text
          let listAry = JSON.parse(localStorage.getItem("list"));
          listAry.forEach((item, index) => {
            if (item.todoText == removeText) {
              listAry.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(listAry));
            }
          });
        });
      });

      section.appendChild(todo);
    });
  }
}

// sort list by time
function mergeTime(arr1, arr2) {
  let results = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    let dateTime1 = Number(new Date(arr1[i].todoDate + " " + arr1[i].todoTime));
    let dateTime2 = Number(new Date(arr2[j].todoDate + " " + arr2[j].todoTime));
    if (dateTime1 < dateTime2) {
      results.push(arr1[i]);
      i++;
    } else if (dateTime1 > dateTime2) {
      results.push(arr2[j]);
      j++;
    }
  }
  while (i < arr1.length) {
    results.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    results.push(arr2[j]);
    j++;
  }
  return results;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

// sortByTime button
let sortButton = document.querySelector("div.sort");
sortButton.addEventListener("click", () => {
  // sort data
  let mergedList = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(mergedList));

  // remove current list
  document.querySelectorAll(".todo").forEach((item) => {
    item.remove();
  });

  // add sorted list
  loadData();
});
