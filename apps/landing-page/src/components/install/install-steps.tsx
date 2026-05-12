import { useState } from 'react'
import { CodeBlock } from '@/components/ui/code-block'
import {
  type Browser,
  buildCmd,
  cloneCmd,
  installCmd,
  loadInstructions,
  outputPath,
  type PackageManager,
  packageManagers
} from '@/data/install'
import { extensionVersion } from '@/data/version'
import { LoadSteps } from './load-steps'
import { Step } from './step'
import { Tabs } from './tabs'

const browsers: ReadonlyArray<Browser> = ['chrome', 'firefox']

export function InstallSteps() {
  const [browser, setBrowser] = useState<Browser>('chrome')
  const [pm, setPm] = useState<PackageManager>('pnpm')
  const load = loadInstructions[browser]
  const browserLabel = browser === 'chrome' ? 'Chrome' : 'Firefox'

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-4">
        <Tabs options={browsers} value={browser} onChange={setBrowser} />
        <Tabs options={packageManagers} value={pm} onChange={setPm} />
      </div>

      <Step
        n={1}
        title="Clone the repo"
        body="Get the source code from GitHub."
      >
        <CodeBlock label="terminal" code={cloneCmd} />
      </Step>

      <Step
        n={2}
        title="Install dependencies"
        body={`Requires Node.js 22+. Pick whichever package manager you prefer. Extension version: v${extensionVersion}.`}
      >
        <CodeBlock label="terminal" code={installCmd[pm]} />
      </Step>

      <Step
        n={3}
        title={`Build for ${browserLabel}`}
        body={`Outputs a production build to ${outputPath[browser]}.`}
      >
        <CodeBlock label="terminal" code={buildCmd[pm][browser]} />
      </Step>

      <Step
        n={4}
        title={`Load it in ${browserLabel}`}
        body={
          browser === 'chrome'
            ? 'Chrome accepts unpacked MV3 extensions during development. The install persists across browser restarts.'
            : 'Firefox loads MV2 with DNR as a temporary add-on. It will unload when Firefox restarts — repeat this step to reload.'
        }
      >
        <LoadSteps steps={load.steps} />
        <div className="mt-4">
          <CodeBlock label="browser url" code={load.url} />
        </div>
      </Step>

      <div className="rounded-md border border-accent/25 bg-accent/[0.06] p-4 text-[13px] leading-relaxed text-fg-muted">
        <strong className="text-accent">Done.</strong> Open any tab, click the
        Shrink icon, pick a device. Your last device and settings are
        remembered.
      </div>
    </div>
  )
}
