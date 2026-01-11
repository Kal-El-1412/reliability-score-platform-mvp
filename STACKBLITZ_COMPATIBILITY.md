# Stackblitz Compatibility Guide

## Issue: Turbopack WASM Error

When opening this project in Stackblitz, you may encounter:

```
Error: `turbo.createProject` is not supported by the wasm bindings.
```

### Root Cause

- **Next.js 16+** enables Turbopack by default in development mode
- **Stackblitz** uses WASM bindings (`@next/swc-wasm-nodejs`) instead of native binaries
- **Turbopack's** advanced features like `turbo.createProject` are not supported in WASM mode

### Solution Applied ✅

The project is now configured for Stackblitz compatibility:

#### 1. Disabled Turbopack in Dev Script

**File**: `/frontend/package.json`

```json
{
  "scripts": {
    "dev": "next dev --no-turbo"
  }
}
```

The `--no-turbo` flag forces Next.js to use Webpack instead of Turbopack.

#### 2. Configuration Note

**File**: `/frontend/next.config.js`

Added documentation comment explaining the Stackblitz compatibility requirement.

### Impact

- ✅ **Stackblitz**: Works perfectly with WASM bindings
- ✅ **Local Development**: Uses Webpack (slightly slower but more stable)
- ✅ **Production Builds**: Unaffected (always uses optimized compiler)
- ⚠️ **Dev Performance**: Slightly slower than Turbopack, but more compatible

### Alternative: Enable Turbopack Locally

If you want to use Turbopack in your local environment (not Stackblitz):

```bash
# Run locally with Turbopack
cd frontend
next dev

# Or create a separate script
npm run dev:turbo
```

Then add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --no-turbo",
    "dev:turbo": "next dev"
  }
}
```

### Testing the Fix

After the fix, the project should:

1. ✅ Start successfully in Stackblitz
2. ✅ No WASM binding errors
3. ✅ Hot reload works correctly
4. ✅ All routes and pages load properly

### Additional Notes

- The fix ensures **broad environment compatibility**
- Webpack is the stable, battle-tested bundler for Next.js
- Turbopack is newer and faster but has platform limitations
- This configuration prioritizes **compatibility over speed**

### References

- [Next.js Turbopack Documentation](https://nextjs.org/docs/app/api-reference/turbopack)
- [Stackblitz WASM Limitations](https://developer.stackblitz.com/platform/api/javascript-sdk)
- [Next.js CLI Options](https://nextjs.org/docs/app/api-reference/next-cli)
