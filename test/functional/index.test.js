import { Selector } from 'testcafe'

const host = process.env.HOST || 'localhost'
const MAIN_PAGE = `http://${host}:3000`

// eslint-disable-next-line no-unused-expressions, no-undef
fixture`Todo`.beforeEach(async t => {
  await t.setNativeDialogHandler(() => true)
  await t.navigateTo(MAIN_PAGE)
})

test('should list be empty', async t => {
  await t.expect(await Selector("[aria-label='todos']").find("[aria-label='todo']").count).eql(0)
})

test('should add first todo', async t => {
  await t
    .typeText(await Selector('input[type=text]'), 'Test 1')
    .pressKey('enter')

  await t
    .expect(
      await Selector("[data-text-as-pseudo-element='Test 1']").count
    )
    .eql(1)
})

test('should add second todo', async t => {
  await t
    .typeText(await Selector('input[type=text]'), 'Test 2')
    .pressKey('enter')
  
  await t
    .expect(
      await Selector("[data-text-as-pseudo-element='Test 1']").count
    )
    .eql(1)
    
  await t
    .expect(
      await Selector("[data-text-as-pseudo-element='Test 2']").count
    )
    .eql(1)
})

test('should toggle first todo', async t => {
  await t
    .expect(await Selector("[aria-label='switch']").find(`[data-text-as-pseudo-element='${String.fromCharCode(0x2713)}']`).count)
    .eql(0)

  await t.click(await Selector("[aria-label='switch']").nth(0))
  
  await t
    .expect(await Selector("[aria-label='switch']").find(`[data-text-as-pseudo-element='${String.fromCharCode(0x2713)}']`).count)
    .eql(1)
})

test('should toggle first todo', async t => {
  await t
    .expect(await Selector("[aria-label='switch']").find(`[data-text-as-pseudo-element='${String.fromCharCode(0x2713)}']`).count)
    .eql(1)
  
  await t.click(await Selector("[aria-label='switch']").nth(0))
  
  await t
    .expect(await Selector("[aria-label='switch']").find(`[data-text-as-pseudo-element='${String.fromCharCode(0x2713)}']`).count)
    .eql(2)
})

test('should remove first todo', async t => {
  await t.expect(await Selector("[aria-label='todos']").find("[aria-label='todo']").count).eql(2)

  await t.click(await Selector(`[data-text-as-pseudo-element='${String.fromCharCode(0x00d7)}']`).nth(0))
  
  await t.expect(await Selector("[aria-label='todos']").find("[aria-label='todo']").count).eql(1)
})

test('should remove second todo', async t => {
  await t.expect(await Selector("[aria-label='todos']").find("[aria-label='todo']").count).eql(1)

  await t.click(await Selector(`[data-text-as-pseudo-element='${String.fromCharCode(0x00d7)}']`).nth(0))
  
  await t.expect(await Selector("[aria-label='todos']").find("[aria-label='todo']").count).eql(0)
})
