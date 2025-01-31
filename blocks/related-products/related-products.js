import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import { createCard } from '../card/card.js';

export default async function decorate(block) {
  const relatedProductsMeta = getMetadata('related-products');
  const relatedProductsTitles = relatedProductsMeta.split(',').map((item) => item.trim());
  const relatedCategoriesMeta = getMetadata('related-categories');
  const relatedCategoriesTitles = relatedCategoriesMeta.split(',').map((item) => item.trim());

  const allProductTitles = [...relatedProductsTitles, ...relatedCategoriesTitles];

  const products = await ffetch('/query-index.json')
    .sheet('products')
    .filter((product) => allProductTitles.includes(product.h1))
    .all();

  const categories = await ffetch('/query-index.json')
    .sheet('categories')
    .filter((category) => relatedCategoriesTitles.includes(category.h1))
    .all();

  const allItems = [...products, ...categories];

  const cardRenderer = await createCard({
    descriptionLength: 75,
    c2aLinkStyle: true,
    defaultButtonText: 'Details',
  });

  allItems.forEach((product) => {
    product.type = product.category;
    if (product.subCategory && !['0', 'Other'].includes(product.subCategory)) {
      product.type = product.subCategory;
    } else if (product.category && !['0', 'Other'].includes(product.category)) {
      product.type = product.category;
    } else {
      product.type = product.h1;
    }
    block.append(cardRenderer.renderItem(product));
  });

  return block;
}
