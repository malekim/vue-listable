import Column from '../src/js/entity/Column'

test('Valid sort direction', () => {
  const col = new Column(
    false,
    false,
    'test',
    true,
    'test',
    // ascending true
    true
  )
  expect(col.ascending).toEqual(true)
  expect(col.descending).toEqual(false)

  const col2 = new Column(
    false,
    false,
    'test',
    true,
    'test',
    // ascending false
    false
  )
  expect(col2.ascending).toEqual(false)
  expect(col2.descending).toEqual(true)
})

test('Opposite sort', () => {
  const col = new Column(
    false,
    false,
    'test',
    true,
    'test',
    // ascending true
    true
  )
  col.oppositeSort()
  expect(col.ascending).toEqual(false)
  expect(col.descending).toEqual(true)
})

test('Reset sort', () => {
  const col = new Column(
    false,
    false,
    'test',
    true,
    'test',
    // ascending true
    true
  )
  col.oppositeSort()
  col.resetSort()
  expect(col.ascending).toEqual(true)
  expect(col.descending).toEqual(false)
})

test('Test checkbox', () => {
  const col = new Column(
    true,
    false,
    'test',
    true,
    'test',
    // ascending true
    true
  )
  expect(col.classes).toHaveProperty('listable-th-checkbox')
})

test('Test column name', () => {
  const col = new Column(
    false,
    false,
    'test',
    true,
    'test',
    // ascending true
    true
  )
  expect(col.classes).toHaveProperty('listable-th-col-test')
})
