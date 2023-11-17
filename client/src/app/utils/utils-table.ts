/* ------------------------------ SCROLL TOP ---------------------------*/
export const SCROLL_TOP = (className: string, top: number) => {
  let arr = document.getElementsByClassName(className);
  if (arr && arr.length) {
    arr[0].scrollTop = top ? top : 0;
  }
};

/* ------------------------------ SET HEIGHT TABLE ---------------------------*/
export const SET_HEIGHT = (viewId: string, bottom: number, attr: string) => {
  let id = viewId ? viewId : 'view';

  setTimeout(() => {
    let e = document.getElementById(id);
    let button = document.getElementById('back-top');

    if (e) {
      // let attrKey = attr as keyof typeof e;
      let distanceToTop = e.getBoundingClientRect().top + (bottom ? bottom : 20);
      let vh = window.innerHeight;

      if (vh > 450) {
        e.style.maxHeight = vh - distanceToTop + 'px';
        // e.style[attr ? attr : 'maxHeight'] = vh - distanceToTop + 'px';
      }

      if (button) {
        button.style.top = 90 + '%';
        button.style.right = 3 + '%';
      }
    }
  }, 500);
};