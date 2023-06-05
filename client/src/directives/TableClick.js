import { toRefs } from "vue";

const tableClick = {
  mounted(el, bindings) {
    const { userList, status, field, index, socket } = toRefs(bindings.value);

    tableClick.el = el;
    tableClick.userList = userList;
    tableClick.status = status;
    tableClick.field = field;
    tableClick.index = index;
    tableClick.socket = socket.value;

    bindEvent();
  },
};

function bindEvent() {
  tableClick.el.addEventListener("click", handleClick, false);
  window.addEventListener("click", handleWindowClick, false);
}

function handleClick(e) {
  preventBubble(e);
  handleWindowClick(e);
  tableClick.target = getTarget(e);
  const target = tableClick.target;
  const field = target.dataset.field;

  if (field) {
    const index = target.dataset.index;
    const tdText = target.innerText;
    tableClick.oInput = createInput(tdText);
    target.appendChild(tableClick.oInput);
    tableClick.oInput.select();
    tableClick.field.value = field;
    tableClick.index.value = index;
    bindInputEvent();

    tableClick.socket.emit("changeStates", true);
  }
}

function getTarget(e) {
  const tagName = e.target.tagName.toLowerCase();
  switch (tagName) {
    case "span":
      return e.target.parentNode;
    case "td":
      return e.target;
    default:
      return e.target;
  }
}

function handleWindowClick(e) {
  if (tableClick.oInput) {
    updateUserList(tableClick.oInput.value);
    removeInput();
  }
}

function preventBubble(e) {
  //阻止冒泡
  e.stopPropagation();
}

function removeInput() {
  tableClick.target.removeChild(tableClick.oInput);
  unbindInputEvent();
  tableClick.oInput = null;
  tableClick.target = null;
  tableClick.socket.emit("changeStates", false);
}

function handleInput(e) {
  updateUserList(e.target.value);
}

function updateUserList(value) {
  tableClick.socket.emit("changeData", {
    field: tableClick.field.value,
    index: tableClick.index.value,
    value,
  });
}

function bindInputEvent() {
  tableClick.oInput.addEventListener("click", preventBubble, false);
  tableClick.oInput.addEventListener("input", handleInput, false);
}

function unbindInputEvent() {
  tableClick.oInput.removeEventListener("click", preventBubble, false);
  tableClick.oInput.removeEventListener("input", handleInput, false);
}

function createInput(value) {
  const oInput = document.createElement("input");
  oInput.value = value;

  oInput.style.cssText = `
          width: 100%;
          height: 100%;
          border: none;
          box-sizing: border-box;
          position: absolute;
          top: 0;
          left: 0;
      `;

  return oInput;
}

export default tableClick;
