/**
 * TODO localStorage read & write
 * [x] localStorage에 데이터를 저장한다.
 *  - [x] 메뉴를 추가할 때
 *  - [x] 메뉴를 수정할 때
 *  - [x] 메뉴를 삭제할 때
 * [x] localStorage에 있는 데이터를 읽어온다. => 데이터 저장 시에
 *
 * TODO 카테고리별 메뉴판 관리
 * [x] 에스프레소 메뉴판 관리
 * [x] 프라푸치노 메뉴판 관리
 * [x] 블렌디드 메뉴판 관리
 * [x] 티바나 메뉴판 관리
 * [x] 디저트 메뉴판 관리
 *
 * TODO 페이지 접근시 최초 데이터 read & rendering
 * [x] 페이지에 최초로 로딩할 때 localStorage에서 에스프레소 메뉴를 읽어온다.
 * [x] 에스프레소 메뉴를 페이지에 그려준다.
 *
 * TODO 품절
 * [x] 품절 버튼을 추가한다.
 * [x] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
 * [x] 클릭했을 때 가장 가까운 li 태그(해당 메뉴)에 sold-out class를 추가하여 상태를 변경한다.
 */

import { $ } from './utils/dom.js';
import { store } from './store/store.js';

function App() {
  // 앱에서 변하는 것: 개수, 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  // 현재 카테고리 상태관리
  this.currentCategory = 'espresso';

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `<li data-menu-id="${index}" class=" menu-list-item d-flex items-center py-2">
        <span class="${item.soldOut ? 'sold-out' : ''} w-100 pl-2 menu-name">${
          item.name
        }</span>
        <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">품절</button>
        <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">수정</button>
        <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">삭제</button></li>`;
      })
      .join('');

    $('#menu-list').innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    let menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    if ($('#menu-name').value === '') {
      alert('메뉴 이름을 입력해주세요');
      return;
    }

    const newMenu = $('#menu-name').value;
    this.menu[this.currentCategory].push({ name: newMenu });
    store.setLocalStorage(this.menu);
    render();
    $('#menu-name').value = '';
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt(
      '수정할 메뉴명을 입력하세요',
      $menuName.innerText
    );
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuNAme = (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const menuId = e.target.closest('li').dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut; // soldOut 속성 추가 boolean값으로 토글처럼 이용
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    $('#menu-form').addEventListener('submit', (e) => e.preventDefault());

    $('#menu-submit-button').addEventListener('click', addMenuName);

    $('#menu-name').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addMenuName();
    });

    $('nav').addEventListener('click', (e) => {
      const isCategoryButton =
        e.target.classList.contains('cafe-category-name');
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
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
        return;
      }
    });
  };
}

const app = new App();
app.init();
