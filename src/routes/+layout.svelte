<script lang="ts">
import '../app.postcss';
  import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
  <slot />
  <div slot="footer">
	<p class="text-center text-gray-500 text-sm">
		Made with ❤️ by OptoCloud
	</p>
	<p class="text-center text-gray-500 text-sm hidden sm:block">
		Uptime of this service is not guaranteed. Data is webscraped from the FAA and may be delayed or inaccurate. This is not an official SpaceX service. This is a fan project.
	</p>
  </div>
</AppShell>
