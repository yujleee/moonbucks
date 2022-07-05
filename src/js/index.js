/* eslint-disable no-use-before-define */
import { $ } from './utils/dom.js';
// import { store } from './store/store.js';
import menuApi from './api/menu.js';

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = 'espresso';

  this.init = async () => {
    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(this.currentCategory);
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map(
        (item) => `<li data-menu-id="${item.id}" class=" menu-list-item d-flex items-center py-2">
          <span class="${item.isSoldOut ? 'sold-out' : ''} w-100 pl-2 menu-name">${item.name}</span>
          <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">품절</button>
          <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">수정</button>
          <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">삭제</button></li>`
      )
      .join('');

    $('#menu-list').innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const addMenuName = async () => {
    if ($('#menu-name').value === '') {
      alert('메뉴 이름을 입력해주세요');
      return;
    }

    const menuName = $('#menu-name').value;
    await menuApi.createMenu(this.currentCategory, menuName);

    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(this.currentCategory);
    $('#menu-name').value = '';
    render();
  };

  const updateMenuName = async (e) => {
    const { menuId } = e.target.closest('li').dataset;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt('수정할 메뉴명을 입력하세요', $menuName.innerText);
    await menuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(this.currentCategory);
    render();
  };

  const removeMenuNAme = async (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const { menuId } = e.target.closest('li').dataset;
      await menuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(this.currentCategory);
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const { menuId } = e.target.closest('li').dataset;
    await menuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(this.currentCategory);
    render();
  };

  const initEventListeners = () => {
    $('#menu-form').addEventListener('submit', (e) => e.preventDefault());

    $('#menu-submit-button').addEventListener('click', addMenuName);

    $('#menu-name').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addMenuName();
    });

    $('nav').addEventListener('click', async (e) => {
      const isCategoryButton = e.target.classList.contains('cafe-category-name');
      if (isCategoryButton) {
        this.currentCategory = e.target.dataset.categoryName;
        $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
        this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(this.currentCategory);
        render();
      }
    });

    $('#menu-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-edit-button')) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-remove-button')) {
        removeMenuNAme(e);
        return;
      }

      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenu(e);
      }
    });
  };
}

const app = new App();
app.init();
