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
		Uptime of this service is not guaranteed. Data is webscraped from the FAA and may be delayed or inaccurate. This is a personal project and is not affiliated with SpaceX or the FAA.
	</p>
	<p class="text-center text-gray-500 text-sm hidden sm:block">
		If this service is in conflict with any laws or regulations, please contact us at <a class="text-blue-500 underline" href="mailto:contact@optocloud.no">contact@optocloud.no</a> and we will take it down.
	</p>
  </div>
</AppShell>
