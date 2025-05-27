const STORE_CONTRACT_ADDRESS = '0xf64Dc33a192e056bb5f0e5049356a0498B502D50'

export const allCollections = async (): Promise<Response> => {
  return await fetchGraph({
    operationName: 'Wearables',
    variables: {
      first: 1000,
      skip: 0
    },
    query: `
      query Wearables($first: Int, $skip: Int) {
        collections(first: $first, skip: $skip) {
          id
          name
          isApproved
          minters
          owner
          urn
          items {
            image
            price
            rarity
            available
            maxSupply
            blockchainId
            urn
          }
        }
      }
    `
  })
    .then(async (r) => await r.json())
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    .then((r) => (r.data ? r.data : r))
    .catch((error) => {
      console.log(error)
    })
}

export const storeCollections = async (
  storeAddress: string = STORE_CONTRACT_ADDRESS,
  isApproved: boolean = true
): Promise<any> => {
  const result = await fetchGraph({
    operationName: 'Wearables',
    variables: {
      first: 1000,
      skip: 0,
      storeAddress
    },
    query: `
      query Wearables($first: Int, $skip: Int, $storeAddress: String) {
        collections(
          first: $first,
          skip: $skip,
          where: {
            minters_contains: [$storeAddress],
            isApproved: ${isApproved}
          }
        ) {
          id
          name
          isApproved
          owner
          urn
          items {
            metadata {
              wearable { name }
              emote { name }
            }
            image
            price
            rarity
            available
            maxSupply
            blockchainId
            urn
          }
        }
      }
    `
  })

  const json = await result.json()
  console.log(json)
  return json.data as { collections: Collections }
}

export const collection = async (collectionURN: string): Promise<string | undefined> => {
  const result = await fetchGraph({
    operationName: 'Wearables',
    variables: {
      first: 1,
      skip: 0,
      urn: collectionURN
    },
    query: `
      query Wearables($first: Int, $skip: Int, $urn: String) {
        collections(
          first: $first,
          skip: $skip,
          where: { urn: $urn }
        ) {
          id
          name
          isApproved
          owner
          urn
          items {
            metadata {
              wearable { name }
              emote { name }
            }
            image
            price
            rarity
            available
            maxSupply
            blockchainId
            urn
          }
        }
      }
    `
  })

  const json = await result.json()
  console.log(json)

  if (json.data !== null) {
    return json.data.collections[0]
  } else {
    return undefined
  }
}

export const item = async (itemURN: string): Promise<Response> => {
  return await fetchGraph({
    operationName: 'Wearables',
    variables: {
      first: 1000,
      skip: 0,
      urn: itemURN
    },
    query: `
      query Wearables($first: Int, $skip: Int, $urn: String) {
        items(
          first: $first,
          skip: $skip,
          where: { urn: $urn }
        ) {
          image
          price
          rarity
          available
          maxSupply
          blockchainId
          urn
        }
      }
    `
  })
    .then(async (r) => await r.json())
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    .then((r) => (r.data ? r.data : r))
    .catch((error) => {
      console.log(error)
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
async function fetchGraph(request: Object): Promise<Response> {
  return await fetch('https://api.thegraph.com/subgraphs/name/decentraland/collections-matic-mainnet', {
    method: 'POST',
    body: JSON.stringify(request)
  })
}

export type Collection = {
  id: string
  items: Array<{
    available: string
    blockchainId: string
    image: string
    maxSupply: string
    price: string
    rarity: string
    urn: string
    metadata: Metadata
  }>
  name: string
  owner: string
  urn: string
}

type WearableMetadata = {
  wearable: {
    name: string
  }
}

type EmoteMetadata = {
  emote: {
    name: string
  }
}

type Metadata = WearableMetadata | EmoteMetadata

export type Collections = Collection[]
