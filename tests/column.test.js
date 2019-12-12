import Column from '../src/js/model/column';

it('Valid sort direction', () => {
  let col = new Column(
    false,
    false,
    "test",
    true,
    "test",
    // ascending true
    true
  );
  expect(col.ascending).toEqual(true);
  expect(col.descending).toEqual(false);

  let col2 = new Column(
    false,
    false,
    "test",
    true,
    "test",
    // ascending false
    false
  );
  expect(col2.ascending).toEqual(false);
  expect(col2.descending).toEqual(true);
});

it('Opposite sort', () => {
  let col = new Column(
    false,
    false,
    "test",
    true,
    "test",
    // ascending true
    true
  );
  col.oppositeSort();
  expect(col.ascending).toEqual(false);
  expect(col.descending).toEqual(true);
});

it('Reset sort', () => {
  let col = new Column(
    false,
    false,
    "test",
    true,
    "test",
    // ascending true
    true
  );
  col.oppositeSort();
  col.resetSort();
  expect(col.ascending).toEqual(true);
  expect(col.descending).toEqual(false);
});

it('Test checkbox', () => {
  let col = new Column(
    true
  );
  expect(col.classes).toHaveProperty('listable-th-checkbox');
});

it('Test column name', () => {
  let col = new Column(
    false,
    false,
    "test",
    true,
    "test",
    // ascending true
    true
  );
  expect(col.classes).toHaveProperty('listable-th-col-test');
});