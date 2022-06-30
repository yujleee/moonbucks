const $ = (seletctor) => document.querySelector(seletctor);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },

  getLocalStorage() {
    return JSON.parse(localStorage.getItem('menu'));
    // 문자로 저장했던걸 다시 json으로
  },
};

function App() {
  // 앱에서 변하는 것: 개수, 메뉴명
  this.menu = [];
  this.init = () => {
    if (store.getLocalStorage().length >= 1) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu
      .map((item, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${item.name}</span>
        <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">품절</button>
        <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">수정</button>
        <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">삭제</button></li>`;
      })
      .join('');

    $('#espresso-menu-list').innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    let menuCount = $('#espresso-menu-list').children.length;
    $('.menu-count').innerText = `총 ${menuCount++}개`;
  };

  const addMenuName = () => {
    if ($('#espresso-menu-name').value === '') {
      alert('메뉴 이름을 입력해주세요');
      return;
    }

    const newMenu = $('#espresso-menu-name').value;
    this.menu.push({ name: newMenu });
    store.setLocalStorage(this.menu);
    render();
    $('#espresso-menu-name').value = '';
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt(
      '수정할 메뉴명을 입력하세요',
      $menuName.innerText
    );
    this.menu[menuId].name = updatedMenuName;
    console.log(this.menu[menuId].name);
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuNAme = (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const menuId = e.target.closest('li').dataset.menuId;
      this.menu.splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest('li').remove();
      updateMenuCount(e);
    }
  };

  $('#espresso-menu-form').addEventListener('submit', (e) =>
    e.preventDefault()
  );

  $('#espresso-menu-submit-button').addEventListener('click', addMenuName);

  $('#espresso-menu-name').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addMenuName();
  });

  $('#espresso-menu-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-edit-button')) updateMenuName(e);
    if (e.target.classList.contains('menu-remove-button')) removeMenuNAme(e);
  });
}

const app = new App();
app.init();
