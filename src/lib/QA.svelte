<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	counter += 1;
	let id: string = 'question-' + counter;
	export let question: string;
</script>

<div>
	<input {id} type="checkbox" class="group peer hidden" />
	<label for={id} class="cursor-pointer"
		><h3 class="rounded p-2">
			<span>⮚</span>
			{question}
		</h3></label
	>
	<div class="hidden px-2 peer-checked:block">
		<slot><p>Answer</p></slot>
	</div>
</div>

<!-- content-['︾'] content-['»'] -->
<!-- ⮛ -->
