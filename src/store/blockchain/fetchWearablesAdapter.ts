/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// import * as ui from 'dcl-ui-toolkit'

export type Collection = {
  id: string
  name: string
  isApproved: boolean
  owner: string
  urn: string
  items: Array<{
    metadata: {
      wearable?: { name: string }
      emote?: { name: string }
    }
    image: string
    price: string
    rarity: string
    available: string
    maxSupply: string
    blockchainId: string
    urn: string
  }>
}

export async function getCollectionNamesFromServer(collectionIds: string[]): Promise<string[]> {
  try {
    console.log('test 1')
    const response = await fetch('https://peer-testing.decentraland.org/lambdas/collections')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    if (!response.ok) {
      // createUI(response.status)
    }
    // createUI(response.status)
    console.log('test 2')
    const json = await response.json()
    const allCollections = json.collections
    console.log(allCollections, ' this log')
    // createUI(allCollections[1].name)
    const matchedNames = allCollections
      .filter((collection: { id: string; name: string }) => collectionIds.includes(collection.id))
      .map((collection: { name: string }) => collection.name)

    return matchedNames
  } catch (error) {
    console.error('Error fetching collections:', error)
    return []
  }
}
export async function buildCollectionObject(urn: string, name: string): Promise<Collection> {
  const wearables = await getListOfWearables({ collectionIds: [urn] })
  console.log(wearables, ' aqui')
  // createUI(wearables[0].image)
  const items = wearables.map((wearable) => ({
    metadata: {
      wearable:
        (wearable.category as string) === 'wearable' ? { name: wearable.i18n?.[0]?.text ?? wearable.id } : undefined,
      emote: (wearable.category as string) === 'emote' ? { name: wearable.i18n?.[0]?.text ?? wearable.id } : undefined
    },
    image: wearable.thumbnail,
    price: '',
    rarity: wearable.rarity ?? '',
    available: '1',
    maxSupply: '1',
    blockchainId: wearable.id.split(':').pop() ?? '',
    urn: wearable.id
  }))
  // createUI(items[1].urn)
  return {
    id: urn,
    name,
    isApproved: true,
    owner: '',
    urn,
    items
  }
}
// export function createUI(some: string | any): void {
//   console.log('CREATORRRR UI')

//   const announcement = ui.createComponent(ui.Announcement, { value: 'HERE' + some, duration: 2500 })
//   announcement.show()
// }

export async function getListOfWearables(filters: Record<string, string[] | string>): Promise<any[]> {
  const queryParams = convertObjectToQueryParamString(filters)
  const catalystUrl = await getCatalystUrl()
  return await fetch(`https://peer-testing.decentraland.org/lambdas/collections/wearables${queryParams}`)
    .then(async (res) => await res.json())
    .then((res) => res.wearables)
    .then((wearables) => wearables.map((wearable: any) => mapV2WearableIntoV1(catalystUrl, wearable)))
}

function convertObjectToQueryParamString(object: Record<string, any>): string {
  let result = ''
  for (const key in object) {
    const value = object[key]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!value) continue

    const name = key.endsWith('s') ? key.slice(0, -1) : key
    const values = Array.isArray(value) ? value.map(String) : [String(value)]

    result += result.length === 0 ? '?' : '&'
    result += `${name}=` + values.join(`&${name}=`)
  }
  return result
}

async function getCatalystUrl(): Promise<string> {
  // Podés ajustar esta lógica si querés elegir otro catalyst dinámicamente
  return 'https://peer-testing.decentraland.org'
}

function mapV2WearableIntoV1(catalystUrl: string, wearable: any): any {
  const baseUrl = catalystUrl + '/content/contents/'
  const thumbnail = wearable.thumbnail

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const isFullUrl = thumbnail.startsWith('http://') || thumbnail.startsWith('https://')

  return {
    ...wearable,
    baseUrl,
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    thumbnail: isFullUrl ? thumbnail : baseUrl + thumbnail
  }
}

export async function buildCollectionsFromMarketplaceAPI(contractAddresses: string[]): Promise<Collection[]> {
  const collections: Collection[] = []

  for (const address of contractAddresses) {
    try {
      const res = await fetch(`https://marketplace-api.decentraland.org/v1/items?contractAddress=${address}`)
      if (!res.ok) {
        console.log(`Failed to fetch items for contract: ${address}`)
        continue
      }

      const json = await res.json()
      const itemsRaw = json.data

      if (!itemsRaw || itemsRaw.length === 0) {
        console.log(`No items found for contract: ${address}`)
        continue
      }

      const collection: Collection = {
        id: address,
        name: itemsRaw[0].data?.wearable?.description ?? address,
        isApproved: true,
        owner: itemsRaw[0].creator ?? '',
        urn: address,
        items: itemsRaw.map((item: any) => ({
          metadata: {
            wearable: item.category === 'wearable' ? { name: item.name } : undefined,
            emote: item.category === 'emote' ? { name: item.name } : undefined
          },
          image: item.thumbnail,
          price: item.price || '',
          rarity: item.rarity || item.data?.wearable?.rarity || '',
          available: item.available || '0',
          maxSupply: '1',
          blockchainId: item.itemId || '',
          urn: item.urn
        }))
      }

      collections.push(collection)
    } catch (error) {
      console.error(`Error fetching collection at ${address}:`, error)
    }
  }

  return collections
}
