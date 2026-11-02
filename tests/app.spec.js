import { test, expect } from '@playwright/test';

test('mock API with users list', async ({ page }) => {
  await page.route('*/**/users', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        users: [
          { id: 1, email: 'alice@example.com', firstName: 'Alice', lastName: 'Smith' },
          { id: 2, email: 'bob@example.com',   firstName: 'Bob',   lastName: 'Jones' },
        ],
      }),
    });
  });

  await page.goto('https://http.hexlet.app/js-playwright/users-list');

  await expect(page.getByText('Alice Smith')).toBeVisible();
  await expect(page.getByText('Bob Jones')).toBeVisible();
  await expect(page.getByText('alice@example.com')).toBeVisible();
});

test('mock API with 403 response', async ({ page }) => {
  await page.route('*/**/users', (route) => {
    route.fulfill({ status: 403 });
  });

  await page.goto('https://http.hexlet.app/js-playwright/users-list');

  const header = page.getByRole('heading', { name: 'Доступ ограничен' });
  await expect(header).toBeVisible();
});