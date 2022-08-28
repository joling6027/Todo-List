const addButton = document.querySelector(".addButton");
var input = document.querySelector(".input");
const container = document.querySelector(".container");

class item{

  constructor(itemName){
    this.createDiv(itemName);
  }

  createDiv(itemName){
    let input = document.createElement("input");
    input.value = itemName;
    input.disabled = true;
    input.classList.add("item_input");
    input.type = "text";

    let itemBox = document.createElement("div");
    itemBox.classList.add("item");

    let editButton = document.createElement("button");
    editButton.innerHTML = "EDIT";
    editButton.classList.add("editButton");

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "DEL";
    deleteButton.classList.add("removeButton");
    // let deleteIcon = document.createElementNS("http://www.w3.org/2000/svg",)


    container.appendChild(itemBox);

    itemBox.appendChild(input);
    itemBox.appendChild(editButton);
    itemBox.appendChild(deleteButton);

    editButton.addEventListener("click", () => this.edit(input));

    deleteButton.addEventListener("click", () => 
      this.remove(itemBox, input.value)
    );
  }

  async edit(input) {
    const newInput = prompt("Enter new msg:", input.value);
    // input.value = newInput;
    if(!newInput){
      newInput = input.value;
    }
    await fetch("/api/modify", {
      method: "POST",
      body: JSON.stringify({ old: input.value, new: newInput }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    input.value = newInput;
  }

  async remove(item, value){
    const answer = confirm("Are you sure you want to delete this task? ");
    if(answer){
      container.removeChild(item);
      await fetch("/api/delete", {
        method: "POST",
        body: JSON.stringify({ record: value }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    
  }

}

async function check(){
  if(input.value != ""){
    new item(input.value);

    await fetch("/api/create",{
      method: "POST",
      body: JSON.stringify({record: input.value}),
      headers:{
        "Content-Type": "application/json",
      },
    });

    input.value = "";
  }
}


async function boot(){
  const records = await fetch("/api/get")
  .then((r) => r.json());
  records.forEach(({record}) => {
    new item(record)
  });
}

boot();

addButton.addEventListener("click", check);

window.addEventListener("keydown",(e) => {
  if(e.code == "Enter"){
    check();
  }
});