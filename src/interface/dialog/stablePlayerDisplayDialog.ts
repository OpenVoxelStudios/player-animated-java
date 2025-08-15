import StablePlayerDisplayDialog from '../../components/stablePlayerDisplayDialog.svelte'
import { PACKAGE } from '../../constants'
import { Valuable } from '../../util/stores'
import { SvelteDialog } from '../../util/svelteDialog'
import { translate } from '../../util/translation'

export function openStablePlayerDisplayDialog(): Promise<{ modelType: string } | null> {
	return new Promise(resolve => {
		const modelType = new Valuable('regular')

		new SvelteDialog({
			id: `${PACKAGE.name}:stable_player_display_dialog`,
			title: translate('dialog.stable_player_display.title'),
			width: 400,
			component: StablePlayerDisplayDialog,
			props: {
				modelType,
			},
			onConfirm() {
				resolve({ modelType: modelType.get() })
			},
			onCancel() {
				resolve(null)
			},
		}).show()
	})
}
