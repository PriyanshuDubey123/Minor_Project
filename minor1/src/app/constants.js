export const ITEMS_PER_PAGE = 10;

export function discountedPrice(item){
    console.log(item);
return Math.round(item.price*(1-item.discountPercentage/100));
}