export const MAX_COMPARE_ITEMS = 3;

export function getTitleFromNode(item) {
  return item.getAttribute('data-title');
}

export function getPathFromNode(item) {
  return item.getAttribute('data-path');
}

export function getSelectedItems() {
  return [...document.querySelectorAll('.compare-button .compare-checkbox.selected')]
    .filter((value, index, self) => index === self.findIndex((t) => (
      getTitleFromNode(t) === getTitleFromNode(value)
    ),
    ))
    .map((item) => getTitleFromNode(item));
}

export function getItemPath(itemTitle) {
  return [...document.querySelectorAll('.compare-button .compare-checkbox')]
    .filter((value) => getTitleFromNode(value) === itemTitle)[0]
    .getAttribute('data-path');
}

export function unselectAllComparedItems() {
  [...document.querySelectorAll('.compare-button .compare-checkbox.selected')]
    .forEach((item) => item.classList.remove('selected'));
}

export function updateCompareButtons(selectedItemTitles) {
  // update all compare buttons
  const allCompareCheckboxes = [...document.querySelectorAll('.compare-button .compare-checkbox')];
  allCompareCheckboxes.forEach((item) => {
    const buttonParent = item.parentNode;
    item.classList.remove('selected');
    buttonParent.querySelector('.compare-count').innerHTML = '0';
    const currentProductTitle = getTitleFromNode(item);
    if (selectedItemTitles.includes(currentProductTitle)) {
      item.classList.add('selected');
      buttonParent.querySelector('.compare-count').innerHTML = selectedItemTitles.length;
    }
  });
}

export function unselectSpecificComparedItem(itemPath) {
  const item = document.querySelector(`.compare-checkbox[data-path="${itemPath}"]`);
  item.classList.remove('selected');

  const selectedItemTitles = getSelectedItems();
  updateCompareButtons(selectedItemTitles);
}
