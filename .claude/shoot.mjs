// README screenshot shooter: drives the running dsh web server at :3080 and
// captures the hero + conversation surfaces in both themes into assets/abyss/.
import { mkdirSync } from 'node:fs'

// Resolve playwright through apps/web (the package that declares it).
const { chromium } = await import(
  new URL('../apps/web/node_modules/playwright/index.mjs', import.meta.url).href
)

const OUT = new URL('../assets/abyss/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()

async function dismissNotice(page) {
  const btn = page.getByRole('button', { name: '继续' })
  try {
    await btn.waitFor({ state: 'visible', timeout: 4000 })
    await btn.click()
    await page.waitForTimeout(400)
  } catch { /* notice not shown (already acknowledged in this storage state) */ }
}

async function shoot(colorScheme, tag) {
  const ctx = await browser.newContext({
    viewport: { width: 1560, height: 975 },
    deviceScaleFactor: 2,
    colorScheme,
    // The client resolves its locale from the browser; pin zh so the shots
    // match the product's default Chinese copy.
    locale: 'zh-CN',
  })
  const page = await ctx.newPage()
  await page.goto('http://127.0.0.1:3080', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  await dismissNotice(page)

  // The host injects the durable theme preference; when it is not `system`
  // the emulated colorScheme is ignored, so pin the DOM fields the presenter
  // owns and keep them pinned against a later presenter write.
  await page.evaluate((wantDark) => {
    const apply = () => {
      document.documentElement.style.colorScheme = wantDark ? 'dark' : 'light'
      document.body.toggleAttribute('data-ds-dark-theme', wantDark)
    }
    apply()
    new MutationObserver(apply).observe(document.body, {
      attributes: true,
      attributeFilter: ['data-ds-dark-theme'],
    })
  }, colorScheme === 'dark')
  await page.waitForTimeout(400)

  // Hero empty state (a fresh context always lands on the new-session hero).
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}hero-${tag}.png` })

  // Open the seeded fib session from the sidebar and capture the stream.
  const session = page.getByText('读取并运行fib.py并点评').first()
  try {
    await session.waitFor({ state: 'visible', timeout: 5000 })
    await session.click()
    await page.waitForTimeout(1500)
    // Scroll to the top of the log: the tool-call cards (Think/Glob/Bash/Read)
    // are the centerpiece of the redesign and sit right under the first turn.
    await page.mouse.move(780, 400)
    await page.mouse.wheel(0, -30000)
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${OUT}conversation-${tag}.png` })
  } catch (e) {
    console.error(`session shot (${tag}) skipped:`, e.message)
  }

  // Composer close-up: focus the input so the ring shows, clip around it.
  try {
    const input = page.locator('textarea').last()
    await input.click({ timeout: 3000 })
    await input.fill('帮我把这个项目重构成插件化架构，先给出迁移计划')
    await page.waitForTimeout(400)
    const box = await input.boundingBox()
    if (box) {
      await page.screenshot({
        path: `${OUT}composer-${tag}.png`,
        clip: {
          x: Math.max(0, box.x - 60),
          y: Math.max(0, box.y - 40),
          width: Math.min(1560 - Math.max(0, box.x - 60), box.width + 120),
          height: Math.min(975 - Math.max(0, box.y - 40), box.height + 150),
        },
      })
    }
  } catch (e) {
    console.error(`composer shot (${tag}) skipped:`, e.message)
  }

  await ctx.close()
}

await shoot('light', 'light')
await shoot('dark', 'dark')
await browser.close()
console.log('done ->', OUT)
