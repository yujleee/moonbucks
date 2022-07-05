/* eslint-disable no-use-before-define */
import { $ } from './utils/dom.js';
// import { store } from './store/store.js';
import menuApi from './api/menu.js';

/**
 * 스텝3 요구사항 => 요구하는 단위를 최소한으로 쪼개야 함. 도움 요청시에도 쉽게 요청하고 받을 수 있음
 * TODO 서버 요청
 * [x] 웹 서버를 띄운다
 * [x] 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
 * [x] 서버에 카테고리별 메뉴 리스트를 요청한다.
 * [x] 서버에 수정된 메뉴명을 업데이트 할 수 있도록 요청한다.
 * [x] 서버에 품절상태를 토글할 수 있도록 요청한다.
 * [x] 서버에 메뉴가 삭제 될 수 있도록 요청한다.
 *
 * TODO 리팩터링
 * [x] localStorage에 저장하는 로직은 지운다.
 * [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.
 *
 * TODO UX
 * [] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
 * [] 중복되는 메뉴는 추가할 수 없다.
 */

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

  const render = async () => {
    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(this.currentCategory);
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
    $('#menu-name').value = '';
    render();
  };

  const updateMenuName = async (e) => {
    const { menuId } = e.target.closest('li').dataset;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt('수정할 메뉴명을 입력하세요', $menuName.innerText);
    await menuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    render();
  };

  const removeMenuNAme = async (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const { menuId } = e.target.closest('li').dataset;
      await menuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const { menuId } = e.target.closest('li').dataset;
    await menuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains('cafe-category-name');
    if (isCategoryButton) {
      this.currentCategory = e.target.dataset.categoryName;
      $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  };

  const initEventListeners = () => {
    $('#menu-form').addEventListener('submit', (e) => e.preventDefault());

    $('#menu-submit-button').addEventListener('click', addMenuName);

    $('#menu-name').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addMenuName();
    });

    $('nav').addEventListener('click', changeCategory);

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
