const inputText = document.querySelector(".inputText")
const addBtn = document.querySelector(".btn_add")
const list = document.querySelector(".list")

//新增代辦項目
let addListItem = (e) => {
  const text = inputText.value
  if (e.type == "keyup" && e.key !== "Enter") {
    return
  }

  if (text.trim() == "") {
    alert("🍰請輸入代辦事項✨")
  } else {
    let obj = {
      content: text,
      id: new Date().getTime(),
      checked: "",
    }
    data.push(obj)
    inputText.value = ""

    currentTab = "all"
    const allTabButton = document.getElementById("all")
    if (allTabButton) {
      allTabButton.click()
      updateData()
    }
    saveData()
  }
}
addBtn.addEventListener("click", addListItem)
inputText.addEventListener("keyup", addListItem)

//資料初始化渲染
let data = []
const renderData = (listData) => {
  let str = listData
    .map((item) => {
      return `<li data-index=${item.id}>
              <label class="checkbox">
                <input type="checkbox" ${item.checked} />
                <span>${item.content}</span>
              </label>
              <a href="#" class="delete"></a>
            </li>`
    })
    .join("")
  list.innerHTML = str
}

//切換tab樣式
const changeTabs = (e) => {
  currentTab = e.target.dataset.status
  let tabs = document.querySelectorAll(".tab li")
  tabs.forEach((item) => {
    item.classList.remove("active")
  })
  e.target.classList.add("active")
  updateData()
}

const tab = document.querySelector(".tab")
let currentTab = "all"
tab.addEventListener("click", changeTabs)

//刪除代辦項目、檢查checked狀態
const handleListItemClick = (e) => {
  let id = Number(e.target.closest("li").dataset.index)
  if (e.target.classList.contains("delete")) {
    e.preventDefault()

    let index = data.findIndex((item) => item.id === id)

    if (index !== -1) {
      data.splice(index, 1)
      updateData()
      saveData()
    }
  } else
    data.forEach((i, index) => {
      if (i.id == id) {
        if (data[index].checked == "") {
          data[index].checked = "checked"
        } else {
          data[index].checked = ""
        }
      }
    })
  updateData()
  saveData()
}
list.addEventListener("click", handleListItemClick)

//tab切換更新代辦清單
const filterMapping = {
  all: () => data,
  uncompleted: (item) => item.checked === "",
  completed: (item) => item.checked === "checked",
}

let updateData = () => {
  let listData = data.filter(filterMapping[currentTab])
  const uncompletedNum = data.filter((item) => item.checked === "").length
  document.querySelector(".uncompletedNum").textContent = uncompletedNum
  renderData(listData)
  saveData()
}

//清除已完成的項目
const deleteCompletedBtn = document.querySelector(".deleteCompletedBtn")

deleteCompletedBtn.addEventListener("click", (e) => {
  e.preventDefault()
  data = data.filter((item) => item.checked !== "checked")
  updateData()
  saveData()
})

//localstorage
const Storage = {
  get(key) {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
}

const saveData = () => {
  Storage.set("data", data)
}

const showTask = () => {
  let storedData = Storage.get("data")
  if (storedData) {
    data = storedData
    updateData()
  }
}

showTask()
