<script lang="ts">
import '../app.postcss';
  import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
  <slot />
  <div slot="footer">
	<p class="text-center text-gray-500 text-sm">
		Made with ❤️ by <a class="text-blue-500 underline" href="https://x.com/optocloud">OptoCloud</a>
	</p>
	<p class="text-center text-gray-500 text-sm hidden sm:block">
		Uptime of this service is not guaranteed. Data is webscraped from the FAA and may be delayed or inaccurate. This is a personal project and is not affiliated with SpaceX or the FAA.
	</p>
	<p class="text-center text-gray-500 text-sm hidden sm:block">
		Please do not hesitate to reach out if you have any questions or concerns, you can contact me at <a class="text-blue-500 underline" href="mailto:contact@optocloud.no">contact@optocloud.no</a>
	</p>
  </div>
</AppShell>
