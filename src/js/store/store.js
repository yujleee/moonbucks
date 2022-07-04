export const store = {
  setLocalStorage(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },

  getLocalStorage() {
    return JSON.parse(localStorage.getItem('menu'));
    // 문자로 저장했던걸 다시 json으로
  },
};
