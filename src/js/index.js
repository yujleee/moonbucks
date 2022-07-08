/* eslint-disable no-use-before-define */
// eslint-disable-next-line no-unused-vars
import { $ } from './util/dom.js';

const BASE_URL = 'http://localhost:3000/api';

const menuApi = {
  async getAllMenu(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },

  async addMenu(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      console.error(response);
    }
  },

  async updateMenu(category, name, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      console.error(response);
    }
  },

  async removeMenu(category, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error(response);
    }
  },

  async toggleSoldOutMenu(category, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, {
      method: 'PUT',
    });

    if (!response.ok) {
      console.error(response);
    }
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

  this.init = async () => {
    this.menu[this.currentCategory] = await menuApi.getAllMenu(this.currentCategory);
    render();
  };

  const updateMenuCount = () => {
    const currentCount = $('#menu-list').children.length;
    $('.menu-count').innerText = `총 ${currentCount}개`;
  };

  const render = async () => {
    this.menu[this.currentCategory] = await menuApi.getAllMenu(this.currentCategory);
    const template = this.menu[this.currentCategory]
      .map(
        (menu) => `<li data-menu-id="${menu.id}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${menu.isSoldOut ? 'sold-out' : ''}">${menu.name}</span>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">품절</button>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">수정</button>
      <button type="button"class="bg-gray-50 text-gray-500 text-sm menu-remove-button">삭제 </button></li>`
      )
      .join('');
    $('#menu-list').innerHTML = template;
    updateMenuCount();
  };

  const addMenu = async () => {
    if ($('#menu-name').value.trim() === '') {
      alert('메뉴를 입력해주세요.');
      $('#menu-name').value = '';
      return;
    }

    const menuName = $('#menu-name').value;
    await menuApi.addMenu(this.currentCategory, menuName);
    $('#menu-name').value = '';
    render();
  };

  const updateMenu = async (e) => {
    const { menuId } = e.target.closest('li').dataset;
    const menuName = e.target.closest('li').querySelector('.menu-name');
    const newMenu = prompt('메뉴 이름을 입력해주세요', menuName.innerText);

    await menuApi.updateMenu(this.currentCategory, newMenu, menuId);
    menuName.innerText = newMenu;
    render();
  };

  const removeMenu = async (e) => {
    if (confirm('메뉴를 삭제하시겠습니까?')) {
      const { menuId } = e.target.closest('li').dataset;
      await menuApi.removeMenu(this.currentCategory, menuId);
      e.target.closest('li').remove();
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const { menuId } = e.target.closest('li').dataset;
    await menuApi.toggleSoldOutMenu(this.currentCategory, menuId);
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
