/* eslint-disable no-new */
import * as ui from 'dcl-ui-toolkit'
import { createMANAComponent } from './mana'
import { createStoreComponent } from './store'
import { openExternalUrl } from '~system/RestrictedActions'
import { type WearableMenuItem } from '../ui/menuItemWearable'

const STORE_CONTRACT_ADDRESS = '0xf64Dc33a192e056bb5f0e5049356a0498B502D50'
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function buy(collectionId: string, blockchainId: string, price: string, item?: WearableMenuItem) {
  const mana = createMANAComponent()
  const store = createStoreComponent()

  const balance = await mana.balance()
  const allowance = await mana.isApproved(STORE_CONTRACT_ADDRESS)

  console.log('balance', balance)
  console.log('allowance', allowance)

  if (+price > +balance) {
    // new UI.OkPrompt('Sorry, you do not have enough MANA', undefined, undefined, true)
    return
  }

  if (+price > 0 && +price > +allowance) {
    const approvePrompt = ui.createComponent(ui.OptionPrompt, {
      title: 'Approve MANA',
      text: 'Authorize the Store contract to operate MANA on your behalf',
      acceptLabel: 'Authorize',
      rejectLabel: 'Reject',
      useDarkTheme: true,
      startHidden: false, // visible desde el inicio
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onAccept: async () => {
        approvePrompt.hide()

        const loadingPrompt = ui.createComponent(ui.CustomPrompt, {
          style: ui.PromptStyles.DARKSLANTED,
          width: 200
        })

        loadingPrompt.addText({
          value: 'Please wait.\nThe transaction is being processed',
          size: 30
        })
        const loadingIcon = ui.createComponent(ui.LoadingIcon, { duration: 3 })
        loadingIcon.show()

        mana.approve(STORE_CONTRACT_ADDRESS).catch(() => {})
        // await delay(3000)

        loadingPrompt.hide()
        loadingIcon.hide()

        // Retry after approval
        await buy(collectionId, blockchainId, price, item)
      },

      onReject: () => {
        // await delay(200)
        const rejectPrompt = ui.createComponent(ui.OkPrompt, {
          text: 'You need to authorize the Store contract to be able to buy this item',
          onAccept: () => {
            rejectPrompt.hide()
          },
          acceptLabel: 'Ok',
          useDarkTheme: true
        })
        rejectPrompt.show()
      }
    })

    approvePrompt.show()
    return
  }

  const confirmMessage =
    +price === 0
      ? 'You are about to get an item for free'
      : `You are about to buy an item for ${fromWei(price, 'ether')} MANA`

  const confirmPrompt = ui.createComponent(ui.OptionPrompt, {
    title: '',
    text: confirmMessage,
    acceptLabel: 'Ok',
    rejectLabel: 'Cancel',
    useDarkTheme: true,
    startHidden: false,
    onAccept: () => {
      confirmPrompt.hide()

      const loadingPrompt = ui.createComponent(ui.CustomPrompt, {
        style: ui.PromptStyles.DARKSLANTED,
        width: 200
      })
      loadingPrompt.addText({
        value: 'Please wait.\nThe transaction is being processed',
        size: 30
      })
      const loadingIcon = ui.createComponent(ui.LoadingIcon, { duration: 3 })
      loadingIcon.show()

      const res = store.buy(collectionId, blockchainId, price)

      loadingPrompt.hide()
      loadingIcon.hide()
      // this need to be changed
      if (res !== null) {
        const successPrompt = ui.createComponent(ui.OptionPrompt, {
          title: 'Purchase succeeded!',
          text: 'You will need to refresh the page to see the wearable in your backpack.',
          acceptLabel: 'Ok',
          rejectLabel: 'PolygonScan',
          useDarkTheme: true,
          onAccept: () => {
            successPrompt.hide()
          },
          onReject: () => {
            void openExternalUrl({ url: `https://polygonscan.com/address/${STORE_CONTRACT_ADDRESS}` })
          }
        })

        successPrompt.show()

        item?.boughtOne()
      } else {
        const failedPrompt = ui.createComponent(ui.OkPrompt, {
          text: 'Purchase failed.\nPlease try again.',
          useDarkTheme: true,
          onAccept: () => {
            failedPrompt.hide()
          }
        })

        failedPrompt.show()
      }
    },
    onReject: () => {
      confirmPrompt.hide()
    }
  })

  confirmPrompt.show()

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    balance: fromWei(balance, 'ether'),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    allowance: fromWei(allowance.toString(), 'ether')
  }
}
// async function delay(ms: number): Promise<void> {
//   await new Promise((resolve) => {
//     const ent = engine.addEntity()
//   })
// }
function fromWei(value: string | number, unit: 'ether' = 'ether'): string {
  const divisor = 10n ** 18n
  const bigValue = BigInt(value)
  return (Number(bigValue) / Number(divisor)).toString()
}
