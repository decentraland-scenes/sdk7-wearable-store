import * as crypto from 'dcl-crypto-toolkit'

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
    const response = await fetch('https://peer-testing.decentraland.org/lambdas/collections')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const json = await response.json()
    const allCollections = json.collections

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
  const wearables = await crypto.wearable.getListOfWearables({ collectionIds: [urn] })

  const items = wearables.map((wearable) => ({
    metadata: {
      wearable:
        (wearable.category as string) === 'wearable' ? { name: wearable.i18n?.[0]?.text ?? wearable.id } : undefined,
      emote: (wearable.category as string) === 'emote' ? { name: wearable.i18n?.[0]?.text ?? wearable.id } : undefined
    },
    image: wearable.thumbnail,
    price: '',
    rarity: wearable.rarity ?? '', // ✅ forzamos string
    available: '1',
    maxSupply: '1',
    blockchainId: wearable.id.split(':').pop() ?? '',
    urn: wearable.id
  }))

  return {
    id: urn,
    name,
    isApproved: true,
    owner: '',
    urn,
    items
  }
}
