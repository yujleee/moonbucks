const $ = (seletctor) => document.querySelector(seletctor);

function App() {
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
    const menuItemTemplete = (newMenu) => {
      return `<li data-menu-id="0" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${newMenu}</span>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">품절</button>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">수정</button>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">삭제</button>
    </li>`;
    };

    $('#espresso-menu-list').insertAdjacentHTML(
      'beforeend',
      menuItemTemplete(newMenu)
    );

    updateMenuCount();
    $('#espresso-menu-name').value = '';
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt(
      '수정할 메뉴명을 입력하세요',
      $menuName.innerText
    );
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuNAme = (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
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

App();
