import Event from "./lib/pubsub.js";

class Dropdown extends Event {
  constructor (doc, options = {}) {
    super();
    if (typeof doc !== "string") {
      throw new TypeError('doc should be string');
    }
    this.value = "";
    this.dropdownValues = options.data;
    this.selectedIndex = null;
    this.doc = document.getElementById(doc);
    this.addHeader({placeHolder: options.placeholderText});
    this.inputBox = this.doc.querySelector('[data-dropdown-value]');
    this.dropdownListContainer = this.doc.querySelector('[data-dropdown-list-container]');
    this.attachEvents();
  }

  addHeader({placeHolder}) {
    let header = `<div class="dropdown-text">
    <input placeholder="${placeHolder}" type="text" data-dropdown-value>
  </div>
  <div class="dropdown-list" data-dropdown-list-container>
  </div>`;
    let headerDoc = document.createElement('div');
    headerDoc.innerHTML = header;
    this.doc.appendChild(headerDoc);
  }

  addDrodownList() {
    let doc = this.dropdownListContainer;
    doc.innerHTML = "";
    let str = ``;
    let ddrParentStr = `<ul data-dropdown-list>`;
    this.dropdownValues
      .filter(address => {
        const { value } = address;
        return this.selectedValue && value.toLowerCase().indexOf(this.selectedValue) >= 0 || value === this.selectedValue ;
      })
      .forEach((address, index) => {
        const { value } = address;
        str += `<li 
          ${index == this.selectedIndex ? "data-selected" : ""} 
          data-selected-index=${index} 
          data-dropdown-list-item
          data-dropdown-list-value="${value}"
          >
          ${value}
        </li>`;
      });

    if (this.selectedValue && !str) {
      str = `<div data-dropdown-empty>
      <span>No Items found :(</span>
      </div>`;
    }

    if (str.length) {
      str = `${ddrParentStr}${str}</ul>`;
    }
    doc.innerHTML = str;
    this.doc.appendChild(doc);
  }

  get selectedValue() {
    return this.value;
  }
  set selectedValue(value) {
    this.value = value;
  }

  getDropdownListContainer(){
    return document.querySelector('[data-dropdown-list]');
  }

  handleDownArrowKey() {
    const dropdown = this.getDropdownListContainer();
    if (dropdown) {
      if (this.dropdownExists()) {
        const selectedListItem = dropdown.querySelector('li[data-dropdown-list-item][data-selected]+li') || document.querySelector('li[data-dropdown-list-item]');
        this.publish('onListHovered', selectedListItem);
      }
    }
  }

  handleUpArrowKey() {
    const dropdown = this.getDropdownListContainer();
    if (dropdown) {
      if (this.dropdownExists()) {
        let selectedListItem = dropdown.querySelector('li[data-dropdown-list-item][data-selected]');
        const selectedIndex = selectedListItem && selectedListItem.dataset && parseInt(selectedListItem.dataset.selectedIndex) || 0;
        if (selectedListItem || selectedIndex > 1) {
          selectedListItem = dropdown.querySelector(`li[data-selected-index="${selectedIndex - 1}"]`);
        }
        else {
          selectedListItem = document.querySelector('li[data-dropdown-list-item]');
        }
        this.publish('onListHovered', selectedListItem);
      }
    }
  }

  dropdownExists() {
    return this.doc.querySelectorAll('li[data-dropdown-list-item]').length > 0;
  }

  attachEvents() {
    //Custom Events  
    this.subscribe('onDDRChanged', () => {
      this.addDrodownList();
      const eleToBringToView = this.dropdownListContainer.querySelector('li[data-selected]');
      eleToBringToView && eleToBringToView.scrollIntoView();
    });
    this.subscribe('onListHovered', (target) => {
      if (target && target.dataset && target.dataset.hasOwnProperty("dropdownListItem")) {
        this.selectedIndex = parseInt(target.dataset.selectedIndex);
        this.publish('onDDRChanged');
      }
    });
    this.subscribe('onListSelected', (target) => {
      if (target.dataset && target.dataset.hasOwnProperty("dropdownListItem")) {
        this.inputBox.value = this.selectedValue = target.dataset.dropdownListValue;
        this.publish('onDDRItemSelected',this.inputBox.value);
      }
    });
    this.subscribe('onDDRItemSelected', () => {
      this.dropdownListContainer.innerHTML = "";
    });
    this.subscribe('onSearch', (value) => {
      this.inputBox.value = value;
    });

    //Browser Events
    this.inputBox.addEventListener('keyup', (event) => {
      // @ts-ignore
      const { value } = event.target;
      this.selectedValue = value;
      this.publish('onDDRChanged');
    });
    
    this.inputBox.addEventListener('click',()=>{
      this.publish('onDDRChanged');
    });

    this.inputBox.addEventListener('keydown', (event) => {

      if (event.keyCode == '38') {        
        this.handleUpArrowKey();
      }
      else if (event.keyCode == '40') {        
        this.handleDownArrowKey();
        return false;
      }      
    });
    // this.doc.querySelector('[data-dropdown-list-container]').addEventListener('mouseover', (event) => {
    //   this.publish('onListHovered', event.target);
    // });
    this.doc.addEventListener('click', (e) => {
      this.publish('onListSelected', e.target);
    });
  };
};
window.Dropdown = Dropdown;

let data = [
  {
    "value": "Arunachal Pradesh"
  },
  {
    "value": "Assam"
  },
  {
    "value": "Bihar"
  },
  {
    "value": "Chhattisgarh"
  },
  {
    "value": "Goa"
  },
  {
    "value": "Gujarat"
  },
  {
    "value": "Haryana"
  },
  {
    "value": "Himachal Pradesh"
  },
  {
    "value": "Jharkhand"
  },
  {
    "value": "Karnataka"
  },
  {
    "value": "Kerala"
  },
  {
    "value": "Madhya Pradesh"
  },
  {
    "value": "Maharashtra"
  },
  {
    "value": "Manipur"
  },
  {
    "value": "Meghalaya"
  },
  {
    "value": "Mizoram"
  },
  {
    "value": "Nagaland"
  },
  {
    "value": "Odisha"
  },
  {
    "value": "Punjab"
  },
  {
    "value": "Rajasthan"
  },
  {
    "value": "Sikkim"
  },
  {
    "value": "Tamil Nadu"
  },
  {
    "value": "Telangana"
  },
  {
    "value": "Tripura"
  },
  {
    "value": "Uttar Pradesh"
  },
  {
    "value": "Uttarakhand"
  },
  {
    "value": "West Bengal"
  },
  {
    "value": "Andaman and Nicobar Islands"
  },
  {
    "value": "Chandigarh"
  },
  {
    "value": "Dadra and Nagar Haveli and Daman and Diu"
  },
  {
    "value": "Delhi"
  },
  {
    "value": "Jammu and Kashmir"
  },
  {
    "value": "Ladakh"
  },
  {
    "value": "Lakshadweep"
  },
  {
    "value": "Puducherry"
  },
  {
    "value": "States"
  },
  {
    "value": "Union territories"
  },
  {
    "value": "Geology"
  },
  {
    "value": "Landforms"
  },
  {
    "value": "Regions"
  },
  {
    "value": "Subdivisions"
  },
  {
    "value": "Environment and climate"
  },
  {
    "value": "Sovereign states"
  },
  {
    "value": "States with limitedrecognition"
  }
];

let ddr1 = new Dropdown("dropdown", {
  data,
  placeholderText: "Search Indian states by name"
}).subscribe('onDDRItemSelected',(value)=>{
  console.log('Selected Item', value);
});
