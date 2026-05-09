import { registerDeletableHandlerPatch } from 'blockbench-patch-manager'
import { openStablePlayerDisplayDialog } from '../dialogs/stablePlayerDisplay/stablePlayerDisplay'
import { activeProjectIsBlueprintFormat } from '../formats/blueprint'
import type { AnyRenderedNode, IRenderedRig } from '../systems/rigRenderer'
import { localize as translate } from '../util/lang'

export function SPD_hasParent(node: AnyRenderedNode, nodeMap: IRenderedRig['nodes']): boolean {
	let currentUuid = node.parent
	while (currentUuid && currentUuid !== 'root') {
		const current = nodeMap[currentUuid]
		if (!current) break
		if (
			current.name === 'stable_player_display' ||
			current.name === 'split_stable_player_display'
		) {
			return true
		}
		currentUuid = current.parent
	}
	return false
}

export function SPD_isRegular(cube: AnyRenderedNode, nodeMap: IRenderedRig['nodes']): boolean {
	let currentUuid = cube.parent
	while (currentUuid && currentUuid !== 'root') {
		const current = nodeMap[currentUuid]
		if (current) {
			if (current.name === 'stable_player_display') {
				return true
			} else if (current.name === 'split_stable_player_display') {
				return false
			}
			currentUuid = current.parent
		} else {
			break
		}
	}
	return false
}

export const SPD_OFFSETS = {
	head: 0,
	right_arm: -1024,
	left_arm: -2048,
	torso: -3072,
	right_leg: -4096,
	left_leg: -5120,
	right_forearm: -6144.0,
	left_forearm: -7168.0,
	waist: -8192.0,
	lower_right_leg: -9216.0,
	lower_left_leg: -10240.0,
}

export const SPD_PART_NAMES_LIST = [
	'head',
	'left_arm',
	'left_forearm',
	'right_arm',
	'right_forearm',
	'torso',
	'waist',
	'left_leg',
	'lower_left_leg',
	'right_leg',
	'lower_right_leg',
] as const

export const SPD_PART_NAMES: ReadonlySet<string> = new Set(SPD_PART_NAMES_LIST)

export const SPD_GROUP_NAMES: ReadonlySet<string> = new Set([
	'stable_player_display',
	'split_stable_player_display',
])

export function eulerDegreesToQuaternion(
	rx: number,
	ry: number,
	rz: number
): [number, number, number, number] {
	const x = (rx * Math.PI) / 180
	const y = (ry * Math.PI) / 180
	const z = (rz * Math.PI) / 180
	const c1 = Math.cos(x / 2)
	const c2 = Math.cos(y / 2)
	const c3 = Math.cos(z / 2)
	const s1 = Math.sin(x / 2)
	const s2 = Math.sin(y / 2)
	const s3 = Math.sin(z / 2)
	return [
		s1 * c2 * c3 + c1 * s2 * s3,
		c1 * s2 * c3 - s1 * c2 * s3,
		c1 * c2 * s3 + s1 * s2 * c3,
		c1 * c2 * c3 - s1 * s2 * s3,
	]
}

type Node = {
	name: string
	position: [number, number, number]
	size: [number, number, number]
	origin: [number, number, number]
	children?: Node[]
}

const PLAYER_PARTS: {
	regular: Node[]
	split: Node[]
} = {
	regular: [
		{
			name: 'torso',
			position: [0, 23, 0],
			size: [8, 12, 4],
			origin: [0, 11, 0],
			children: [
				{ name: 'head', position: [0, 31, 0], size: [8, 8, 8], origin: [0, 23, 0] },
				{ name: 'right_arm', position: [6, 23, 0], size: [4, 12, 4], origin: [4, 23, 0] },
				{
					name: 'left_arm',
					position: [-6, 23, 0],
					size: [4, 12, 4],
					origin: [-4, 23, 0],
				},
			],
		},
		{ name: 'right_leg', position: [2, 12, 0], size: [4, 12, 4], origin: [2, 12, 0] },
		{ name: 'left_leg', position: [-2, 12, 0], size: [4, 12, 4], origin: [-2, 12, 0] },
	],
	split: [
		{
			name: 'torso',
			position: [0, 23.5, 0],
			size: [8, 6, 4],
			origin: [0, 17.5, 0],
			children: [
				{ name: 'head', position: [0, 31.5, 0], size: [8, 8, 8], origin: [0, 23.5, 0] },
				{
					name: 'right_arm',
					position: [6, 23.5, 0],
					size: [4, 6, 4],
					origin: [4, 23.5, 0],
					children: [
						{
							name: 'right_forearm',
							position: [6, 17.5, 0],
							size: [4, 6, 4],
							origin: [6, 17.5, 0],
						},
					],
				},
				{
					name: 'left_arm',
					position: [-6, 23.5, 0],
					size: [4, 6, 4],
					origin: [-4, 23.5, 0],
					children: [
						{
							name: 'left_forearm',
							position: [-6, 17.5, 0],
							size: [4, 6, 4],
							origin: [-6, 17.5, 0],
						},
					],
				},
			],
		},
		{
			name: 'waist',
			position: [0, 17.5, 0],
			size: [8, 6, 4],
			origin: [0, 17.5, 0],
			children: [
				{
					name: 'right_leg',
					position: [2, 12, 0],
					size: [4, 6, 4],
					origin: [2, 12, 0],
					children: [
						{
							name: 'lower_right_leg',
							position: [2, 6, 0],
							size: [4, 6, 4],
							origin: [2, 6, 0],
						},
					],
				},
				{
					name: 'left_leg',
					position: [-2, 12, 0],
					size: [4, 6, 4],
					origin: [-2, 12, 0],
					children: [
						{
							name: 'lower_left_leg',
							position: [-2, 6, 0],
							size: [4, 6, 4],
							origin: [-2, 6, 0],
						},
					],
				},
			],
		},
	],
}

async function createStablePlayerDisplay(modelType: string) {
	const parts = PLAYER_PARTS[modelType as keyof typeof PLAYER_PARTS]
	if (!parts) {
		console.error(`Unknown model type: ${modelType}`)
		return
	}

	Undo.initEdit({ outliner: true, elements: [], selection: true })

	selected.forEachReverse((el: any) => el.unselect())
	Group.first_selected && Group.first_selected.unselect()

	const rootGroup = getCurrentGroup()
	const playerGroup = new Group({
		name: modelType == 'regular' ? 'stable_player_display' : 'split_stable_player_display',
		origin: [0, 0, 0],
	}).init()

	playerGroup.export = true

	if (rootGroup instanceof Group) {
		playerGroup.addTo(rootGroup)
	}

	const createCube = (part: Node, parent: Group) => {
		const partGroup = new Group({
			name: part.name,
			origin: part.origin,
		}).init()

		partGroup.export = true
		partGroup.addTo(parent)

		const cube = new Cube({
			name: part.name,
			from: [
				part.position[0] - part.size[0] / 2,
				part.position[1] - part.size[1],
				part.position[2] - part.size[2] / 2,
			],
			to: [
				part.position[0] + part.size[0] / 2,
				part.position[1],
				part.position[2] + part.size[2] / 2,
			],
			origin: part.origin,
		}).init()

		cube.export = true
		cube.addTo(partGroup)

		if (part.children) {
			part.children.forEach(child => createCube(child, partGroup))
		}
	}

	parts.forEach(part => createCube(part, playerGroup))

	playerGroup.select()

	Undo.finishEdit('Create Stable Player Display', {
		outliner: true,
		elements: selected,
		selection: true,
	})

	return playerGroup
}

export const CREATE_ACTION = registerDeletableHandlerPatch({
	id: `animated_java:action/create-stable-player-display`,
	create() {
		const action = new Blockbench.Action(`animated_java:action/create-stable-player-display`, {
			name: translate('action.create_stable_player_display.title'),
			icon: 'accessibility_new',
			category: 'animated_java',
			condition() {
				return (
					activeProjectIsBlueprintFormat() && Mode.selected.id === Modes.options.edit.id
				)
			},
			async click() {
				const result = await openStablePlayerDisplayDialog()
				if (!result) return
				await createStablePlayerDisplay(result.modelType)
			},
		})

		BarItems.add_element.side_menu.addAction(action, 3)

		return action
	},
})

export { createStablePlayerDisplay }
