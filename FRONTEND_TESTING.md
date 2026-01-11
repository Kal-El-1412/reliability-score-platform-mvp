# Frontend Verification System

This document explains the frontend smoke testing setup for the Reliability Score Platform.

## Overview

The frontend uses **Playwright** for automated smoke testing to verify that:
- The Next.js dev server starts successfully
- Key pages render without errors
- Critical UI elements are present and visible

## Quick Start

### Run Smoke Tests from Root

```bash
npm run test:frontend:smoke
```

### Run Smoke Tests from Frontend Directory

```bash
cd frontend
npm run test:smoke
```

### System Requirements

Playwright requires system libraries to run Chromium. If you encounter errors about missing `libnspr4.so` or similar libraries, see `/frontend/tests/SETUP.md` for installation options.

**For CI/CD**: GitHub Actions can install dependencies automatically (see workflow file)
**For Local Development**: May require `sudo` to install system libraries or use Docker

## What Gets Tested

The smoke tests verify:

1. **Homepage Redirect** - Root path redirects to login or dashboard
2. **Login Page** - All form elements and links are present
3. **Register Page** - Registration UI renders correctly
4. **Page Metadata** - Pages have proper titles

## Test Structure

```
frontend/
├── playwright.config.ts    # Playwright configuration
├── tests/
│   ├── smoke.spec.ts       # Smoke test suite
│   └── README.md           # Test documentation
└── package.json            # Includes test:smoke script
```

## Configuration Details

### Playwright Config (`frontend/playwright.config.ts`)

- **Base URL**: `http://localhost:3000`
- **Test Timeout**: 60 seconds
- **Auto-start Server**: Yes (starts `npm run dev` automatically)
- **Browser**: Chromium (can extend to Firefox, WebKit)
- **CI Retries**: 2 attempts on failure

### Web Server

Playwright automatically starts the Next.js dev server before running tests:

```typescript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120000,
}
```

## CI/CD Integration

### GitHub Actions Workflow

Location: `.github/workflows/frontend-smoke.yml`

**Triggers:**
- Push to main/master branches
- Pull requests

**Steps:**
1. Checkout repository
2. Setup Node.js 20
3. Install frontend dependencies
4. Install Playwright browsers
5. Run smoke tests
6. Upload test reports and screenshots on failure

**Artifacts:**
- `playwright-report/` - HTML test report
- `test-results/` - Screenshots and traces from failed tests

## Running Tests Locally

### First Time Setup

```bash
# Install frontend dependencies
cd frontend
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Run Tests

```bash
# With UI (useful for debugging)
cd frontend
npx playwright test --ui

# Headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Run specific test
npx playwright test smoke.spec.ts
```

## Test Results

After running tests, view the HTML report:

```bash
cd frontend
npx playwright show-report
```

## Adding New Smoke Tests

When adding critical new pages or features:

1. Open `frontend/tests/smoke.spec.ts`
2. Add a new test:

```typescript
test('new feature page loads', async ({ page }) => {
  await page.goto('/new-feature');

  // Check page loaded
  await expect(page.getByRole('heading', { name: /Feature Title/i }))
    .toBeVisible();

  // Check key elements exist
  await expect(page.getByRole('button', { name: /Action/i }))
    .toBeVisible();
});
```

3. Keep tests fast and simple (under 5 seconds each)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in playwright.config.ts
```

### Tests Timeout

If tests timeout waiting for server:

1. Check `frontend/.env.local` has correct API URL
2. Increase timeout in `playwright.config.ts`:

```typescript
webServer: {
  timeout: 180000, // 3 minutes
}
```

### Browser Installation Issues

```bash
# Reinstall browsers with dependencies
npx playwright install --with-deps chromium
```

## Best Practices

1. **Keep tests focused** - Each test should verify one clear thing
2. **Use semantic selectors** - Prefer `getByRole`, `getByLabel` over CSS selectors
3. **Make tests independent** - Tests should not depend on each other
4. **Keep tests fast** - Smoke tests should complete in under 30 seconds total
5. **Don't test business logic** - Smoke tests verify UI renders, not functionality

## What Smoke Tests Do NOT Cover

Smoke tests are NOT comprehensive e2e tests. They don't:

- Test authentication flows
- Make real API calls
- Test form submissions
- Validate business logic
- Test complex user journeys

For comprehensive testing, implement separate e2e test suites.

## Environment Variables

Tests use the following environment variable:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/v1
```

Set in `frontend/.env.local` for local development.

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
- [Frontend Tests README](./frontend/tests/README.md)
