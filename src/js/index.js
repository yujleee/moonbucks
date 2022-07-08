/* eslint-disable no-use-before-define */
// eslint-disable-next-line no-unused-vars
import { $ } from './util/dom';

const store = {
  setLocalStorage(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },

  getLocalStorage() {
    return JSON.parse(localStorage.getItem('menu'));
  },
};

function App() {
  // 현재 상태를 담을 this
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = 'espresso';

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }

    render();
  };

  const updateMenuCount = () => {
    const currentCount = $('#menu-list').children.length;
    $('.menu-count').innerText = `총 ${currentCount}개`;
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map(
        (menu, index) => `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name ${menu.soldOut ? 'sold-out' : ''}">${menu.name}</span>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">품절</button>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">수정</button>
      <button type="button"class="bg-gray-50 text-gray-500 text-sm menu-remove-button">삭제 </button></li>`
      )
      .join('');
    $('#menu-list').innerHTML = template;
    updateMenuCount();
  };

  const addMenu = () => {
    if ($('#menu-name').value.trim() === '') {
      alert('메뉴를 입력해주세요.');
      $('#menu-name').value = '';
      return;
    }

    const menuName = $('#menu-name').value;

    this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);
    render();
    $('#menu-name').value = '';
  };

  const updateMenu = (e) => {
    const { menuId } = e.target.closest('li').dataset;
    const menuName = e.target.closest('li').querySelector('.menu-name');
    const newMenu = prompt('메뉴 이름을 입력해주세요', menuName.innerText);

    this.menu[this.currentCategory][menuId].name = newMenu;
    store.setLocalStorage(this.menu);

    menuName.innerText = newMenu;
  };

  const removeMenu = (e) => {
    if (confirm('메뉴를 삭제하시겠습니까?')) {
      const { menuId } = e.target.closest('li').dataset;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest('li').remove();
      render();
    }
  };

  const soldOutMenu = (e) => {
    const { menuId } = e.target.closest('li').dataset;
    this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  $('#menu-form').addEventListener('submit', (e) => e.preventDefault());
  $('#menu-submit-button').addEventListener('click', addMenu);
  $('#menu-name').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addMenu();
  });

  $('#menu-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-edit-button')) {
      updateMenu(e);
      return;
    }
    if (e.target.classList.contains('menu-remove-button')) {
      removeMenu(e);
      return;
    }
    if (e.target.classList.contains('menu-sold-out-button')) soldOutMenu(e);
  });

  $('nav').addEventListener('click', (e) => {
    const isCategoryButton = e.target.classList.contains('cafe-category-name');
    if (isCategoryButton) {
      const category = e.target.dataset.categoryName;
      this.currentCategory = category;
      $('#category-title').innerText = `${e.target.innerText} 메뉴관리`;
      render();
    }
  });
}

const app = new App();
app.init();
