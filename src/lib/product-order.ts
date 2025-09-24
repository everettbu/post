// Define the desired product order by handle
// Products will appear in this order, with any unlisted products appearing at the end
// Simply rearrange these lines to change the order on your shop page!
export const PRODUCT_ORDER = [
  'joe-p-tee',                               // Joe P Tee
  'joe-b-birthday-card',                    // Joe B Birthday Card
  'joe-p-hand-towel',                       // Joe P Hand Towel
  'jose-p-tee',                              // Jose P Tee
  'joe-p-refreshing-hand-and-body-wash',    // Joe P Refreshing Hand and Body Wash
  'joe-p-mouse-pad',                         // Joe P Mouse Pad
  'joe-p-flip-flops',                       // Joe P Flip-Flops
  'archer-joe-framed-artwork',              // Archer Joe Framed Artwork
  'joe-p-teddy-bear-with-shirt',            // Joe P Teddy Bear with shirt
  'joe-p-boxer-briefs',                     // Joe P Boxer Briefs
  'joe-panties',                             // Joe (P)anties
  'joe-p-christmas-mug',                    // Joe P Christmas Mug
];

// Sort products based on the defined order
export function sortProductsByCustomOrder<T extends { handle: string }>(products: T[]): T[] {
  return [...products].sort((a, b) => {
    const indexA = PRODUCT_ORDER.indexOf(a.handle);
    const indexB = PRODUCT_ORDER.indexOf(b.handle);
    
    // If both products are in the order list
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only product A is in the order list, it comes first
    if (indexA !== -1) return -1;
    
    // If only product B is in the order list, it comes first
    if (indexB !== -1) return 1;
    
    // If neither is in the list, maintain original order
    return 0;
  });
}