<template>
	<div class="nav-breadcrumb-wrap">
			<div class="container">
				<nav class="nav-breadcrumb">
					<div class="nav-breadcrumb-left">
						<a href="/">Home</a>
						<slot></slot>
					</div>
				</nav>
			</div>
		</div>
</template>

<script>
		export default {
		name: 'NavBread'
	}
</script>

<style scoped>
	.nav-breadcrumb{
		background-color: gainsboro;
		overflow: hidden;
		padding-left: 10px;
	}
	.nav-breadcrumb-left{
		float: left;
	}
</style>