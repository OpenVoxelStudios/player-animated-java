import { observable } from 'svelte-observable-store'
import { SvelteDialog } from 'svelte-patching-tools/blockbench'
import { PACKAGE } from '../../constants'
import { localize as translate } from '../../util/lang'
import StablePlayerDisplayDialog from './stablePlayerDisplay.svelte'

export function openStablePlayerDisplayDialog(): Promise<{ modelType: string } | null> {
	return new Promise(resolve => {
		const modelType = observable('regular')

		new SvelteDialog({
			id: `${PACKAGE.name}:stablePlayerDisplay`,
			title: translate('dialog.stable_player_display.title'),
			width: 400,
			component: StablePlayerDisplayDialog,
			props: {
				modelType,
			},
			disableKeybinds: true,
			onConfirm() {
				resolve({ modelType: modelType.get() })
			},
			onCancel() {
				resolve(null)
			},
		}).show()
	})
}
