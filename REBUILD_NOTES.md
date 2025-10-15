# Deep Linking Rebuild Notes

**Date:** 2025-10-15
**Reverted to commit:** `e2eac3b0803de8a5a509c387ef823d6cb4f49473`
**Reason:** Multiple failed incremental fix attempts - complete rebuild strategy needed

---

## Why This Revert Was Necessary

After three release attempts (v2.4.6, v2.4.7, v2.4.8), deep linking functionality never worked despite addressing different symptoms each time. Each incremental fix targeted a specific issue but failed to solve the root problem.

### Failed Release Attempts

#### v2.4.6 - Electron Context Isolation Fix
**Problem Addressed:** `require('electron')` failing in renderer process
**Fix Attempted:**
- Created `preload.js` with `contextBridge.exposeInMainWorld()`
- Updated `main.js` to load preload script
- Changed `script.js` to use `window.electronAPI.onDeepLink()`

**Result:** Not verified - moved to Android issues before testing

#### v2.4.7 - Android Timing Issue Fix
**Problem Addressed:** Deep link listener registered too late (after DOMContentLoaded)
**Fix Attempted:**
- Registered Capacitor listener immediately on script load
- Added `getLaunchUrl()` to handle cold starts
- Added `setTimeout()` safeguards for nodeManager initialization

**Result:** FAILED - Android still showing "0 registered handlers" in app settings

#### v2.4.8 - Android Intent-Filter Registration
**Problem Addressed:** `android:autoVerify="true"` preventing custom scheme registration
**Fix Attempted:**
- Removed `android:autoVerify="true"` from AndroidManifest.xml intent-filter
- (Note: `autoVerify` is only for App Links with https:// and domain verification)

**Result:** FAILED - Still showing "0 registered handlers" after clean uninstall/reinstall

---

## Known Issues at Time of Revert

### 1. Deep Linking Not Working on Android
**Symptoms:**
- Links with `cfmnui://` scheme not clickable in messaging apps
- Android app settings show "0 registered links" for the app
- Intent-filter present in `AndroidManifest.xml` but not being recognized

**Possible Root Causes:**
- Capacitor sync (`npx cap sync`) may be overwriting manual `AndroidManifest.xml` changes
- Conflict between `capacitor.config.ts` settings and manual manifest configuration
- `androidScheme: 'https'` in `capacitor.config.ts` may interfere with custom scheme
- Intent-filter not being included in final APK build

**Evidence:**
- Manual check with `apk tool` found no `cfmnui` references in built APK
- `capacitor.config.ts` has `appUrlScheme: 'cfmnui'` which should auto-generate intent-filter
- Manual intent-filter added but not appearing in Android system

### 2. HTTPS Connection Failures
**Symptoms:**
- Node connections over HTTPS failing with "failed to fetch" error
- Issue appeared during v2.4.8 development/testing
- HTTP connections may or may not be affected

**Status:** Not fully diagnosed before revert requested

**Initial Investigation:**
- `network_security_config.xml` checked - looks correct with cleartext permitted
- Capacitor HTTP wrapper in `script.js` looks correct (lines 1-80)
- Suspected Capacitor HTTP plugin not loading properly

---

## Files Modified During Failed Attempts

### Created
- `preload.js` - Electron IPC bridge (removed by revert)

### Modified
- `package.json` - Version bumps (2.4.6 → 2.4.7 → 2.4.8), added preload.js to files, removed JSON files
- `index.html` - Version display updates
- `script.js` - Capacitor listener timing changes (lines ~3722-3746)
- `main.js` - Added preload script reference (line 21)
- `android/app/src/main/AndroidManifest.xml` - Removed `android:autoVerify="true"` from intent-filter

### Commits Reverted
1. `1522907` - "Fix Android intent-filter registration (v2.4.8)"
2. `d63b896` - "Fix Android deep linking timing issue (v2.4.7)"
3. `5e8928c` - "Fix deep linking on Electron and clean up package"

---

## Recommended Rebuild Strategy

### Phase 1: Deep Linking Investigation
1. **Understand Capacitor's Native Deep Linking**
   - Study how `appUrlScheme` in `capacitor.config.ts` generates intent-filters
   - Determine if manual `AndroidManifest.xml` edits are necessary or problematic
   - Test if `npx cap sync` overwrites manual manifest changes

2. **Verify Build Process**
   - Build APK and extract `AndroidManifest.xml` from built APK
   - Verify intent-filter is actually included in final build
   - Check Android documentation for custom URL scheme requirements

3. **Test Minimal Implementation**
   - Create test project with ONLY Capacitor + custom scheme
   - Verify deep linking works in isolation
   - Identify minimum working configuration

### Phase 2: Incremental Integration
1. **Start with Working Baseline**
   - Use commit `e2eac3b` as base (this commit)
   - Add ONLY deep linking code, no other changes
   - Test thoroughly before proceeding

2. **Electron Deep Linking First**
   - Implement and test Electron deep linking separately
   - Verify `preload.js` approach or find alternative
   - Ensure no regression in Electron functionality

3. **Android Deep Linking Second**
   - Implement Android deep linking with verified Capacitor approach
   - Build and test APK after each change
   - Verify "registered handlers" count in Android settings
   - Test actual deep link clicks in messaging apps

4. **Integration Testing**
   - Test both platforms after integration
   - Verify HTTPS connections still work
   - Test all sharing scenarios (app→app, app→web, QR codes)

### Phase 3: Testing Checklist
Before considering any release complete:

**Electron:**
- [ ] Deep link opens app when clicked
- [ ] `cfmnui://` URLs handled correctly
- [ ] Node data parsed and imported properly

**Android:**
- [ ] Android settings shows "1 registered link" (or more)
- [ ] Deep links clickable in messaging apps
- [ ] Cold start (app not running) deep links work
- [ ] Warm start (app in background) deep links work
- [ ] HTTPS node connections work
- [ ] HTTP node connections work
- [ ] Share functionality generates valid links

**Cross-Platform:**
- [ ] Share modal displays correct URLs
- [ ] QR codes scannable and functional
- [ ] Web fallback URLs work without app installed

---

## Technical Details to Consider

### Capacitor Configuration (`capacitor.config.ts`)
```typescript
plugins: {
  App: {
    appUrlScheme: 'cfmnui'  // Should auto-generate intent-filter
  }
}
server: {
  androidScheme: 'https',  // May interfere with custom scheme
  cleartext: true
}
```

**Questions:**
- Does `androidScheme: 'https'` conflict with `appUrlScheme: 'cfmnui'`?
- Should we use ONE approach (config OR manual manifest) not both?

### AndroidManifest.xml Intent-Filter
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="cfmnui" />
</intent-filter>
```

**Note:** Do NOT use `android:autoVerify="true"` - only for App Links (https://)

### Capacitor Listener Timing
```javascript
// Register IMMEDIATELY, not after DOMContentLoaded
if (typeof Capacitor !== 'undefined' && Capacitor.Plugins && Capacitor.Plugins.App) {
    // Handle warm starts
    Capacitor.Plugins.App.addListener('appUrlOpen', (data) => {
        handleDeepLink(data.url);
    });

    // Handle cold starts
    Capacitor.Plugins.App.getLaunchUrl().then(launchUrl => {
        if (launchUrl && launchUrl.url) {
            handleDeepLink(launchUrl.url);
        }
    });
}
```

### Electron Context Isolation
With `contextIsolation: true`, cannot use `require()` in renderer.

**Options:**
1. Use `preload.js` with `contextBridge` (attempted in v2.4.6)
2. Set `contextIsolation: false` (less secure but simpler)
3. Use alternative IPC approach

---

## Alternative Approaches to Consider

1. **Universal Links (App Links) Instead of Custom Scheme**
   - Use `https://` with domain verification
   - More reliable on modern Android/iOS
   - Requires domain control and verification files

2. **Capacitor-Only Approach**
   - Let Capacitor handle all deep linking configuration
   - Don't manually edit `AndroidManifest.xml`
   - Trust Capacitor's auto-generation

3. **Separate Electron and Capacitor Code Paths**
   - Different implementations for each platform
   - Avoid trying to unify incompatible approaches
   - Cleaner separation of concerns

---

## Current State After Revert

**Version:** 2.4.3 (from commit e2eac3b)
**Deep Linking Status:** Unknown (needs verification)
**HTTPS Status:** Should be working
**Known Working Features:**
- Web version fully functional
- Electron app launches and loads UI
- Android app launches and loads UI
- Node management and monitoring
- Local storage persistence

---

## Next Steps

1. **Verify current state at commit e2eac3b**
   - Does deep linking work? (probably not, but verify)
   - Does HTTPS work? (should work)
   - What's the baseline functionality?

2. **Research Capacitor deep linking best practices**
   - Official Capacitor documentation
   - Community examples and known issues
   - Android deep linking requirements

3. **Create test plan**
   - Define success criteria before starting
   - Create test cases for each scenario
   - Document expected behavior

4. **Implement with testing at each step**
   - Small, incremental changes
   - Test after each commit
   - Don't batch multiple changes together

---

## Lessons Learned

1. **Incremental fixes without understanding root cause will fail**
   - Three different fixes, none worked
   - Need to understand the problem fully before attempting fixes

2. **Verify changes are actually applied to final build**
   - `AndroidManifest.xml` edits may not persist to APK
   - Always check the built artifact, not just source files

3. **Test thoroughly before releasing**
   - "It should work" is not the same as "it works"
   - Manual testing on target platform is essential

4. **Platform differences require different approaches**
   - Electron and Capacitor handle things differently
   - Trying to unify them may create more problems

5. **Build process matters**
   - `npx cap sync` may overwrite manual changes
   - Need to understand the entire build pipeline

---

**Status:** Ready for complete rebuild with proper investigation and testing strategy
