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

export type Collections = Collection[]

async function fetchCollectionNames(urns: string[]): Promise<Record<string, string>> {
  const url = `https://peer.decentraland.zone/lambdas/collections?id=${urns.map(encodeURIComponent).join(',')}`
  console.log('🛰️  Fetching collection names from:', url)
  
  const res = await fetch(url)
  const data = await res.json()
  console.log('📦 Collection name response:', data)

  const map: Record<string, string> = {}
  for (const collection of data.collections) {
    console.log(`✅ Found collection name: ${collection.id} -> ${collection.name}`)
    map[collection.id] = collection.name
  }
  return map
}

export async function getCollectionsFromCryptoWearables(collectionUrns: string[]): Promise<Collections> {
  console.log('🎯 Getting wearables for collection URNs:', collectionUrns)

  const wearables = await crypto.wearable.getListOfWearables({
    collectionIds: collectionUrns
  })

  console.log(`🧩 Wearables received (${wearables.length}):`)
  wearables.forEach((w, i) => {
    console.log(`  #${i + 1}:`, {
      id: w.id,
      name: w.i18n?.[0]?.text ?? 'unknown',
      thumbnail: w.thumbnail,
      baseUrl: w.baseUrl,
      rarity: w.rarity
    })
  })

  const grouped = new Map<string, Collection>()

  for (const wearable of wearables) {
    const collectionUrn = wearable.id.split(':').slice(0, 5).join(':')

    if (!grouped.has(collectionUrn)) {
      console.log(`🆕 New collection detected: ${collectionUrn}`)
      grouped.set(collectionUrn, {
        id: collectionUrn,
        name: 'Loading...',
        isApproved: true,
        owner: '',
        urn: collectionUrn,
        items: []
      })
    }

    const image = (wearable.baseUrl ?? 'https://peer.decentraland.org/content/contents/') + wearable.thumbnail

    grouped.get(collectionUrn)?.items.push({
      metadata: {
        wearable: { name: wearable.i18n?.[0]?.text ?? wearable.id }
      },
      image,
      price: '0',
      rarity: wearable.rarity ?? 'common',
      available: '1',
      maxSupply: '1',
      blockchainId: wearable.id,
      urn: wearable.id
    })
  }

  const collectionNameMap = await fetchCollectionNames(Array.from(grouped.keys()))

  for (const [urn, collection] of grouped.entries()) {
    const resolvedName = collectionNameMap[urn] ?? urn
    console.log(`📝 Updating collection name: ${urn} -> ${resolvedName}`)
    collection.name = resolvedName
  }

  console.log('📚 Final grouped collections:')
  for (const [urn, collection] of grouped.entries()) {
    console.log(`- ${collection.name} (${urn}): ${collection.items.length} items`)
  }

  return Array.from(grouped.values())
}
