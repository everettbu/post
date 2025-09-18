import { adminClient } from './admin-client';

// Admin API Types
export interface Order {
  id: string;
  name: string;
  email: string;
  totalPrice: string;
  currencyCode: string;
  createdAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        quantity: number;
        variant: {
          id: string;
          title: string;
          price: string;
        };
      };
    }>;
  };
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  ordersCount: number;
  totalSpent: {
    amount: string;
    currencyCode: string;
  };
  createdAt: string;
}

export interface InventoryLevel {
  id: string;
  available: number;
  incoming: number;
  inventoryItem: {
    id: string;
    sku: string;
    tracked: boolean;
  };
}

// Order Management
export async function getOrders(first: number = 10) {
  if (!adminClient) {
    console.error('Admin client is not configured');
    return [];
  }

  const query = `
    query GetOrders($first: Int!) {
      orders(first: $first, reverse: true) {
        edges {
          node {
            id
            name
            email
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            createdAt
            displayFulfillmentStatus
            displayFinancialStatus
            lineItems(first: 10) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                    price
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const { data, errors } = await adminClient.request(query, {
      variables: { first },
    });

    if (errors) {
      console.error('Error fetching orders:', errors);
      return [];
    }

    return data?.orders?.edges?.map((edge: { node: Order }) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getOrder(orderId: string) {
  if (!adminClient) {
    console.error('Admin client is not configured');
    return null;
  }

  const query = `
    query GetOrder($id: ID!) {
      order(id: $id) {
        id
        name
        email
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        createdAt
        displayFulfillmentStatus
        displayFinancialStatus
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
                title
                price
              }
            }
          }
        }
        shippingAddress {
          address1
          address2
          city
          province
          country
          zip
        }
      }
    }
  `;

  try {
    const { data, errors } = await adminClient.request(query, {
      variables: { id: orderId },
    });

    if (errors) {
      console.error('Error fetching order:', errors);
      return null;
    }

    return data?.order || null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Customer Management
export async function getCustomers(first: number = 10) {
  if (!adminClient) {
    console.error('Admin client is not configured');
    return [];
  }

  const query = `
    query GetCustomers($first: Int!) {
      customers(first: $first, reverse: true) {
        edges {
          node {
            id
            email
            firstName
            lastName
            phone
            ordersCount
            totalSpentV2 {
              amount
              currencyCode
            }
            createdAt
          }
        }
      }
    }
  `;

  try {
    const { data, errors } = await adminClient.request(query, {
      variables: { first },
    });

    if (errors) {
      console.error('Error fetching customers:', errors);
      return [];
    }

    return data?.customers?.edges?.map((edge: { node: Customer }) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

// Inventory Management
export async function updateInventory(inventoryItemId: string, locationId: string, quantity: number) {
  if (!adminClient) {
    console.error('Admin client is not configured');
    return null;
  }

  const mutation = `
    mutation UpdateInventory($inventoryItemId: ID!, $locationId: ID!, $quantity: Int!) {
      inventorySetOnHandQuantities(
        input: {
          reason: "correction",
          setQuantities: [
            {
              inventoryItemId: $inventoryItemId,
              locationId: $locationId,
              quantity: $quantity
            }
          ]
        }
      ) {
        inventoryAdjustmentGroup {
          createdAt
          reason
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const { data, errors } = await adminClient.request(mutation, {
      variables: { inventoryItemId, locationId, quantity },
    });

    if (errors) {
      console.error('Error updating inventory:', errors);
      return null;
    }

    return data?.inventorySetOnHandQuantities || null;
  } catch (error) {
    console.error('Error updating inventory:', error);
    return null;
  }
}

// Product Management
interface ProductInput {
  title: string;
  descriptionHtml?: string;
  handle?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  variants?: Array<{
    price: string;
    sku?: string;
    title?: string;
  }>;
}

export async function createProduct(productInput: ProductInput) {
  if (!adminClient) {
    console.error('Admin client is not configured');
    return null;
  }

  const mutation = `
    mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          descriptionHtml
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
                sku
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const { data, errors } = await adminClient.request(mutation, {
      variables: { input: productInput },
    });

    if (errors) {
      console.error('Error creating product:', errors);
      return null;
    }

    return data?.productCreate?.product || null;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

export async function updateProduct(productId: string, productInput: ProductInput & { id?: string }) {
  if (!adminClient) {
    console.error('Admin client is not configured');
    return null;
  }

  const mutation = `
    mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
          descriptionHtml
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
                sku
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const { data, errors } = await adminClient.request(mutation, {
      variables: { input: { ...productInput, id: productId } },
    });

    if (errors) {
      console.error('Error updating product:', errors);
      return null;
    }

    return data?.productUpdate?.product || null;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

// Fulfillment
export async function createFulfillment(orderId: string, lineItems: Array<{ id: string; quantity: number }>) {
  if (!adminClient) {
    console.error('Admin client is not configured');
    return null;
  }

  const mutation = `
    mutation CreateFulfillment($orderId: ID!, $lineItems: [FulfillmentLineItemInput!]!) {
      fulfillmentCreate(
        input: {
          orderId: $orderId
          lineItems: $lineItems
          notifyCustomer: true
        }
      ) {
        fulfillment {
          id
          status
          trackingInfo {
            number
            url
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const { data, errors } = await adminClient.request(mutation, {
      variables: { orderId, lineItems },
    });

    if (errors) {
      console.error('Error creating fulfillment:', errors);
      return null;
    }

    return data?.fulfillmentCreate?.fulfillment || null;
  } catch (error) {
    console.error('Error creating fulfillment:', error);
    return null;
  }
}