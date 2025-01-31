import {
  readBlockConfig,
} from '../../scripts/lib-franklin.js';
import ffetch from '../../scripts/ffetch.js';
import { createList, createDropdown } from '../../scripts/list.js';

function formatDateFullYear(unixDateString) {
  return new Date(unixDateString * 1000).getFullYear();
}

function createFilters(options) {
  const date = Array.from(new Set(options.data.map((n) => n.filterYear)));
  return [
    createDropdown(date, options.activeFilters.year, 'year', 'Select Year'),
  ];
}

function prepareEntry(entry, showDescription, viewMoreText) {
  entry.filterYear = formatDateFullYear(entry.date);
  if (!showDescription) {
    entry.description = '';
  }
  if (viewMoreText) {
    entry.viewMoreText = viewMoreText;
  }
}

export async function createOverview(
  block,
  options,
) {
  block.innerHTML = '';
  options.data.forEach(
    (entry) => prepareEntry(entry, options.showDescription, options.viewMoreText),
  );
  await createList(
    createFilters(options),
    options,
    block);
}

export async function fetchData(type) {
  const data = await ffetch('/query-index.json')
    .sheet(type)
    .all();
  return data;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const options = {
    limitPerPage: parseInt(config.limitPerPage, 10) || 10,
    limitForPagination: parseInt(config.limitForPagination, 9) || 9,
    showDescription: false,
    viewMoreText: '',
    panelTitle: 'Filter By :',
  };
  options.activeFilters = new Map();
  options.activeFilters.set('year', '');
  options.activeFilters.set('page', 1);

  options.data = await fetchData('news');
  await createOverview(
    block,
    options);
}
