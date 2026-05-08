export class IntentionalExportError extends Error {
	constructor(
		message: string,
		public messageBoxOptions?: MessageBoxOptions,
		public messageBoxCallback?: Parameters<typeof Blockbench.showMessageBox>[1]
	) {
		super(message)
		this.name = 'IntentionalExportError'
	}
}

export class IntentionalExportErrorFromInvalidFile extends IntentionalExportError {
	constructor(filePath: string, public originalError: Error) {
		const parsed = PathModule.parse(filePath)
		super(
			`Failed to read file <code title="${filePath}">${parsed.base}</code>:\n\n` +
				'```\n' +
				originalError +
				'\n```',
			{
				commands: {
					open_file: {
						text: 'Open File Location',
						icon: 'folder_open',
					},
				},
			},
			button => {
				if (button === 'open_file') {
					shell.showItemInFolder(filePath)
				}
			}
		)
		this.name = 'IntentionalExportErrorFromInvalidFile'
	}
}

