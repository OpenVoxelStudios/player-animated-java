<script lang="ts">
	import { translate } from '../util/translation'
	import type { Valuable } from '../util/stores'
	
	export let modelType: Valuable<string>
</script>

<div class="dialog-wrapper">
	<div class="dialog_bar form_bar">
		<label class="name_space_left" for="model-type-select">
			{translate('dialog.stable_player_display.model_type.title')}
		</label>
		<select 
			id="model-type-select" 
			bind:value={$modelType}
			class="dark_bordered half form_input"
		>
			<option value="regular">
				{translate('dialog.stable_player_display.model_type.options.regular')}
			</option>
			<option value="split">
				{translate('dialog.stable_player_display.model_type.options.split')}
			</option>
		</select>
	</div>
	<div class="dialog_bar form_bar">
		<small class="text_subtle" style="margin-left: 10px;">
			{translate('dialog.stable_player_display.model_type.description')}
		</small>
	</div>
</div>

<style>
	.dialog-wrapper {
		padding: 10px;
	}
	
	.dialog_bar.form_bar {
		margin-bottom: 10px;
	}
</style>
