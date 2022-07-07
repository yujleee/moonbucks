/* eslint-disable no-use-before-define */
// eslint-disable-next-line no-unused-vars
const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStroage(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },

  getLocalStorage() {
    return JSON.parse(localStorage.getItem('menu'));
  },
};

function App() {
  // 현재 상태를 담을 this
  this.menu = [];

  this.init = () => {
    if (store.getLocalStorage().length >= 1) {
      this.menu = store.getLocalStorage();
    }

    render();
  };

  const updateMenuCount = () => {
    const currentCount = $('#menu-list').children.length;
    $('.menu-count').innerText = `총 ${currentCount}개`;
  };

  const render = () => {
    const template = this.menu
      .map(
        (menu, index) => `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${menu.name}</span>
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

    this.menu.push({ name: menuName });
    store.setLocalStroage(this.menu);
    render();
    $('#menu-name').value = '';
  };

  const updateMenuName = (e) => {
    const { menuId } = e.target.closest('li').dataset;
    const menuName = e.target.closest('li').querySelector('.menu-name');
    const newMenu = prompt('메뉴 이름을 입력해주세요', menuName.innerText);

    this.menu[menuId].name = newMenu;
    store.setLocalStroage(this.menu);

    menuName.innerText = newMenu;
  };

  const removeMenuName = (e) => {
    if (confirm('메뉴를 삭제하시겠습니까?')) {
      e.target.closest('li').remove();
      updateMenuCount();
    }
  };

  $('#menu-form').addEventListener('submit', (e) => e.preventDefault());
  $('#menu-submit-button').addEventListener('click', addMenu);
  $('#menu-name').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addMenu();
  });

  $('#menu-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-edit-button')) updateMenuName(e);
    if (e.target.classList.contains('menu-remove-button')) removeMenuName(e);
  });
}

const app = new App();
app.init();
