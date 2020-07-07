// Storage Controller
const StorageCtrl = (function () {
  // Public methods
  return {
    storeItem: function (item) {
      let items;
      // Check if any items in local storage
      if (localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set local storate
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in local storage
        items = JSON.parse(localStorage.getItem('items'));
        // Push new item
        items.push(item);
        // Reset local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    }
  }
})();


// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const state = {
    // items: [
    //   // { id: 0, name: 'Coliflower Dinner', calories: 550 },
    //   // { id: 1, name: 'Cookie', calories: 300 },
    //   // { id: 2, name: 'Marinaded Tofu with Rice', calories: 850 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function () {
      return state.items;
    },
    addItem: function (name, calories) {
      let ID;
      // Create ID
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Push the new item to items array
      state.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      // Loop through the items
      state.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      // Colories to number
      calories = parseInt(calories);

      let found = null;

      state.items.forEach(item => {
        if (item.id === state.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function (id) {
      // Get ids
      ids = state.items.map(item => item.id);

      // Get index
      const index = ids.indexOf(id);

      // Remove item firn the array
      state.items.splice(index, 1);
    },
    clearAllItems: function () {
      state.items = [];
    },
    setCurrentItem: function (item) {
      state.currentItem = item;
    },
    getCurrentItem: function () {
      return state.currentItem;
    },
    getTotalCalories: function () {
      let total = 0

      // Loop through items and add up the total amount of their calories
      state.items.forEach(item => {
        total += item.calories;
      });

      // Set total calories in data structure
      state.totalCalories = total;

      // Return total
      return state.totalCalories;
    },
    logData: function () {
      return state;
    }
  }
})();



// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    delBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearAllBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // Public methods
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function (item) {
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(item => item.remove());
    },
    showTotalCalories: function (cal) {
      document.querySelector(UISelectors.totalCalories).textContent = cal;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.delBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.delBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function () {
      return UISelectors;
    }
  }
})();


// Get UI selectors (global scope)
const UISelectors = UICtrl.getSelectors();


// App Controller
const AppCtrl = (function (ItemCtrl, UICtrl, StorageCtrl) {
  // Load event listeners
  const loadEventListeners = function () {

    // Add item event
    ['click', 'keypress'].forEach(evt => {
      document.querySelector(UISelectors.addBtn).addEventListener(evt, itemAddSubmit)
    });

    // Edit icon click-event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Delete button event
    document.querySelector(UISelectors.delBtn).addEventListener('click', itemDeleteSubmit);

    // Clear All button event
    document.querySelector(UISelectors.clearAllBtn).addEventListener('click', clearAllItemsClick);

    // Disable Enter button in editing mode
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  }

  // Add item submit
  const itemAddSubmit = function (e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to the UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localStorage
      StorageCtrl.storeItem(newItem)

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Item edit/Event to go to item edit menu 
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id (item-0, item-1...)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split('-');

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get the actual item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  const itemUpdateSubmit = function (e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    e.preventDefault();
  }

  const itemDeleteSubmit = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    e.preventDefault();
  }

  // Clear all items event 
  const clearAllItemsClick = function () {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Remove from local storage
    StorageCtrl.clearItemsFromStorage();
  }

  // Public methods
  return {
    init: function () {
      // Clear edit state / set initial state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Populate list with items
      UICtrl.populateItemList(items);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
AppCtrl.init();