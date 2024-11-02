const affidavit_table = document.querySelector("#affidavit_table");
const add = document.querySelector("#add_id");
const affidavit_con = document.querySelector("#affidavit_con");
const back = document.querySelector("#back");
const inputs = document.querySelectorAll("input[type='text']");
const ctd_div = document.querySelector("#ctd_div");
const affiant_fields = document.querySelector("#affiant_fields");

//begining: this variable is for affidavit form
const affidavit_form_id = document.querySelector("#affidavit_form_id");
const account_lost = document.querySelector("#account_lost");
const account_hold = document.querySelector("#account_hold");
const account_name = document.querySelector("#account_name");
const civil_status = document.querySelector("#civil_status");
const address = document.querySelector("#address");
const acct_num = document.querySelector("#acct_num");
const control_num = document.querySelector("#control_num");
const acct_open = document.querySelector("#acct_open");
const ctd_maturity = document.querySelector("#ctd_maturity");
const month_lost = document.querySelector("#month_lost");
const year_lost = document.querySelector("#year_lost");
const date_created = document.querySelector("#date_created");
const bank_address = document.querySelector("#bank_address");
//end: this variable is for affidavit form

let edit = false;
let selectedToEdit = "";

const affidavit_data = localStorage.getItem("affidavit_storage")
  ? JSON.parse(localStorage.getItem("affidavit_storage"))
  : [];

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.value = input.value.toUpperCase();
  });
});

const autodash = () => {
  let numStr = acct_num.value.replace(/\D/g, "");

  const part1 = numStr.slice(0, 3);
  const part2 = numStr.slice(3, 7);
  const part3 = numStr.slice(7, 13);
  const part4 = numStr.slice(13);

  let formated_num = part1;
  if (part2) formated_num += `-${part2}`;
  if (part3) formated_num += `-${part3}`;
  if (part4) formated_num += `-${part4}`;

  acct_num.value = formated_num;
};

const loopAffiants = (selected) => {
  let data_selected = selected;

  document.querySelector("#input1_aff").value = data_selected.affiants[0];
  data_selected.affiants.slice(1).forEach((aff) => {
    console.log(aff);
    const div = document.createElement("div");
    div.className = "affiant-input mb";

    const input = document.createElement("input");
    input.value = aff;
    input.type = "text";
    input.name = "affiant_name[]";
    input.className = "form-control";
    input.style.textTransform = "uppercase";
    input.setAttribute("required", "");

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "X";
    button.className = "btn btn-danger";
    button.onclick = () => div.remove(); //remove div element including children

    div.appendChild(input);
    div.appendChild(button);
    affiant_fields.appendChild(div);
  });
};

const addAffiantField = () => {
  const div = document.createElement("div");
  div.className = "affiant-input mb";

  const input = document.createElement("input");
  input.type = "text";
  input.name = "affiant_name[]";
  input.className = "form-control";
  input.style.textTransform = "uppercase";
  input.setAttribute("required", "");

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "X";
  button.className = "btn btn-danger";
  button.onclick = () => div.remove(); //remove div element including children

  div.appendChild(input);
  div.appendChild(button);
  affiant_fields.appendChild(div);
};

const handleAccountLost = () => {
  //change of control number label text to "Pitakard Number"
  control_number();

  //toggle hiding of ctd
  if (account_lost.value === "ctd") {
    ctd_div.style.display = "block";
    ctd_maturity.setAttribute("required", "");
  } else {
    ctd_div.style.display = "none";
    ctd_maturity.removeAttribute("required");
    ctd_maturity.value = "";
  }
};

const viewData = (client_id) => {
  const data_selected = search_selected(client_id);

  if (data_selected) {
    const affidavit_data = {
      id: data_selected.id,
      account_lost: data_selected.account_lost,
      account_hold: data_selected.account_hold,
      account_name: data_selected.account_name,
      civil_status: data_selected.civil_status,
      address: data_selected.address,
      acct_num: data_selected.acct_num,
      control_num: data_selected.control_num,
      acct_open: data_selected.acct_open,
      ctd_maturity: data_selected.ctd_maturity,
      month_lost: data_selected.month_lost,
      year_lost: data_selected.year_lost,
      affiants: data_selected.affiants, //don't forget to use 'affiants' as your key value
      date_created: data_selected.date_created,
      bank_address: data_selected.bank_address,
    };

    const encodedData = encodeURIComponent(JSON.stringify(affidavit_data));
    window.location.href = `./links/print_affidavit.html?data=${encodedData}`;
  }
};

const search_selected = (client_id) => {
  return affidavit_data.find((data) => data.id === client_id);
};

const editData = (client_id) => {
  edit = true;
  selectedToEdit = client_id;
  const data_selected = search_selected(client_id);
  console.log(data_selected);

  if (confirm("Are you sure do you want to edit this data? 😦")) {
    if (data_selected) {
      document.getElementById("ctd_maturity").removeAttribute("required");

      account_lost.value = data_selected.account_lost;
      account_hold.value = data_selected.account_hold;
      account_name.value = data_selected.account_name;
      civil_status.value = data_selected.civil_status;
      address.value = data_selected.address;
      acct_num.value = data_selected.acct_num;
      control_num.value = data_selected.control_num;
      acct_open.value = data_selected.acct_open;

      account_lost.dispatchEvent(new Event("change"));
      if (account_lost.value === "ctd") {
        ctd_div.style.display = "block";
        ctd_maturity.setAttribute("required", "");
        ctd_maturity.value = data_selected.ctd_maturity;
      } else {
        ctd_div.style.display = "none";
        ctd_maturity.value = "";
      }

      month_lost.value = data_selected.month_lost;
      year_lost.value = data_selected.year_lost;
      date_created.value = data_selected.date_created;
      bank_address.value = data_selected.bank_address;

      loopAffiants(data_selected);
      //console.log(data_selected.affiants[0]);
    }
    add.click();
    document.querySelector("#btn").innerText = "Save";
  }
};

const removeData = (client_id) => {
  if (confirm("Are you sure you want to delete this data? 😦")) {
    const remove = affidavit_data.findIndex(
      (client) => client.id === client_id
    );
    affidavit_data.splice(remove, 1);
    localStorage.setItem("affidavit_storage", JSON.stringify(affidavit_data));
    display_lists();
    alert("Successfully Deleted! 😎");
  }
};

const setRequired = () => {
  document
    .querySelectorAll("#affidavit_form_id input, #affidavit_form_id select")
    .forEach((el) => {
      if (el.id !== "ctd_maturity") {
        el.setAttribute("required", "");
      }
    });
};

const removeRequired = () => {
  document
    .querySelectorAll("#affidavit_form_id input, #affidavit_form_id select")
    .forEach((el) => el.removeAttribute("required"));
};

const control_number = () => {
  let ctrl_label = document.getElementById("ctrl_label");
  ctrl_label.textContent =
    account_lost.value === "pitakard" ? "PITAKARD NUMBER:" : "CONTROL NUMBER:";
};

const clearAffiantsFields = () => {
  let affiant_input = affiant_fields.querySelectorAll(".affiant-input");

  Array.from(affiant_input)
    .slice(1)
    .forEach((aff) => affiant_fields.removeChild(aff));
};

const clearFields = () => {
  //clear all specific fields
  affidavit_form_id.reset();

  //automatically run current date
  runDate();

  //change to default name of control number
  document.getElementById("ctrl_label").textContent = "CONTROL NUMBER:";

  ctd_div.style.display = "none";

  clearAffiantsFields();
};

const display_lists = () => {
  const table_lists = document.querySelector("#table_lists");

  table_lists.innerHTML = null;
  if (affidavit_data == "") {
    return (table_lists.innerHTML = `
      <tr>
        <td colspan="7" align="center"><b>NO DATA</b></td>
      </tr>
    `);
  } else {
    table_lists.innerHTML = affidavit_data
      .reverse()
      .map((list, index) => {
        let {
          id,
          account_lost,
          account_name,
          acct_num,
          control_num,
          month_lost,
          year_lost,
        } = list;

        return `
			<tr>
				<td data-label="#">${(index += 1)}</td>
				<td data-label="ACCOUNT LOST">${account_lost}</td>
				<td data-label="ACCOUNT NAME">${(account_name =
          account_name.length >= 35
            ? `${account_name.slice(0, 30)}...`
            : account_name)}</td>
				<td data-label="ACCOUNT NUMBER">${acct_num}</td>
				<td data-label="CONTROL NUMBER">${control_num}</td>
				<td data-label="MONTH AND YEAR LOST">${month_lost} ${year_lost}</td>
				<td data-label="OPERATION" class="arrange_btn">
					<button class="btn btn-warning" onclick="editData('${id}')">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
						  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
						</svg>
					</button>
					
					<button class="btn btn-primary" onclick="viewData('${id}')">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
						  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
						  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
						</svg>
					</button>
					
					<button class="btn btn-danger" onclick="removeData('${id}')">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
						  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
						</svg>
					</button>
				</td>
			</tr>
		`;
      })
      .join("");
  }
};

const getAutoId = () => {
  const id = new Date().getTime();
  return `abu${id}`;
};

const handleSubmit = (e) => {
  e.preventDefault();
  console.log("ACCOUNT LOST: " + account_lost.value);
  console.log("ACCOUNT HOLD: " + account_hold.value);
  console.log("ACCOUNT NAME: " + account_name.value);
  console.log("CIVIL STATUS: " + civil_status.value);
  console.log("COMPLETE ADDRESS: " + address.value);
  console.log("ACCOUNT NUMBER: " + acct_num.value);
  console.log("CONTROL NUMBER:" + control_num.value);
  console.log("ACCOUNT OPENED: " + acct_open.value);
  console.log("MATURITY: " + ctd_maturity.value);
  console.log("MONTH AND YEAR LOST: " + month_lost.value);
  console.log("MONTH AND YEAR LOST: " + year_lost.value);
  console.log("DATE OF AFFIDAVIT CREATED:" + date_created.value);
  console.log("FCB BANK ADDRESS: " + bank_address.value);

  const arr_affiant = Array.from(
    document.querySelectorAll('input[name="affiant_name[]"]')
  ).map((input) => input.value);

  console.log("arr: " + arr_affiant);

  const affidavit_arr = {
    id: edit === true ? selectedToEdit : getAutoId(),
    account_lost: account_lost.value,
    account_hold: account_hold.value,
    account_name: account_name.value,
    civil_status: civil_status.value,
    address: address.value,
    acct_num: acct_num.value,
    control_num: control_num.value,
    acct_open: acct_open.value,
    ctd_maturity: ctd_maturity.value ?? "",
    month_lost: month_lost.value,
    year_lost: year_lost.value,
    affiants: arr_affiant,
    date_created: date_created.value,
    bank_address: bank_address.value,
  };
  console.log(affidavit_arr);

  if (!edit) {
    affidavit_data.push(affidavit_arr);
    localStorage.setItem("affidavit_storage", JSON.stringify(affidavit_data));
    alert("Successfully Added! 😎");
    clearFields();
    display_lists();
    setRequired();
  } else {
    edit = false;

    let update = affidavit_data.map((arr) =>
      arr.id === selectedToEdit ? { ...arr, ...affidavit_arr } : arr
    );

    localStorage.setItem("affidavit_storage", JSON.stringify(update));

    document.querySelector("#btn").innerText = "ADD";
    alert("You successfully updated! 😎");
    clearFields();
    location.reload();
  }
};

const generateYear = () => {
  const year_lost = document.querySelector("#year_lost");
  const year_today = new Date().getFullYear();
  const year_toStart = "2013";

  for (let year = year_today; year >= year_toStart; year--) {
    let option = document.createElement("option");
    option.value = year;
    option.text = year;
    year_lost.appendChild(option);
  }
};

const handleBack = () => {
  edit = false;
  clearFields();
  document.querySelector("#btn").innerText = "ADD";
  removeRequired();
  affidavit_table.style.display = "block";
  affidavit_con.style.display = "none";
};

const runDate = () => {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  date_created.value = `${year}-${month}-${day}`;
};

const handleAffidavitCon = (e) => {
  e.preventDefault();
  setRequired();
  affidavit_con.style.display = "flex";
  affidavit_table.style.display = "none";
};

const handleAddAffiant = () => {
  const addBtn = document.querySelector(".add-btn");
  const btn_val = account_hold.value;

  if (btn_val === "multiple") {
    addBtn.style.display = "block";
  } else {
    addBtn.style.display = "none";
    clearAffiantsFields();
    disableAddBtn();
  }
};

const disableAddBtn = () => {
  const addBtn = document.querySelector(".add-btn");
  addBtn.style.display = "none";
};

const hideContainer = () => {
  affidavit_con.style.display = "none";
  display_lists();
  generateYear();
};

const handleTyping = (e) => {
  e.preventDefault();
  e.target.value.toUpperCase();
};

const init = () => {
  runDate();
  disableAddBtn();
  document.addEventListener("DOMContentLoaded", hideContainer);
};

add.addEventListener("click", handleAffidavitCon);
back.addEventListener("click", handleBack);
affidavit_form_id.addEventListener("submit", handleSubmit);
account_lost.addEventListener("change", handleAccountLost);
account_hold.addEventListener("change", handleAddAffiant);
init();
