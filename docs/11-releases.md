# Releases and the download page

Users install KEEK from the download page, a static site in `site/` published with GitHub Pages:

    https://<owner>.github.io/<repo>/

The page detects the visitor's OS, and its download button links straight to the installer from the newest
GitHub Release. Installer file names never change, so these links always point to the latest version:

| File | For |
|---|---|
| `KEEK-Setup.exe` | Windows 10/11 x64 (NSIS installer) |
| `KEEK-mac.dmg` | macOS 12+, universal (Apple Silicon + Intel) |
| `KEEK-linux.AppImage` | Any x64 Linux |
| `KEEK-linux.deb` | Ubuntu / Debian |
| `KEEK-extension.zip` | The Chrome extension (load unpacked) |

## One-time setup

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Repo **Settings → Actions → General → Workflow permissions: Read and write**. The release job needs
   this to create releases.

## Publishing a version

```bash
git tag v1.0.1
git push origin v1.0.1
```

`.github/workflows/release.yml` builds on Windows, macOS and Linux runners. It stamps the version from the
tag into the app, zips the extension, and publishes everything as one release (about 15 minutes). You can
also start it from **Actions → Release → Run workflow** with a version number.

The download page (`.github/workflows/pages.yml`) redeploys whenever `site/` changes on `main`. It reads the
latest release from the GitHub API, so a new release doesn't require a redeploy.

## Signing

The builds are not signed with paid certificates yet:

- **Windows:** SmartScreen shows “Windows protected your PC” → *More info → Run anyway*.
- **macOS:** ad-hoc signed only. Users click *Open Anyway* in Privacy & Security, or run
  `xattr -cr /Applications/KEEK.app` if macOS calls the app damaged.

The page explains both steps. To remove the warnings:

- **macOS:** an Apple Developer ID ($99/year). Add the `CSC_LINK`, `CSC_KEY_PASSWORD`, `APPLE_ID`,
  `APPLE_APP_SPECIFIC_PASSWORD` and `APPLE_TEAM_ID` secrets, drop `-c.mac.identity=-` from the workflow,
  and add `"notarize": true` to `build.mac`.
- **Windows:** a code-signing certificate (or Azure Trusted Signing), passed as `WIN_CSC_LINK` /
  `WIN_CSC_KEY_PASSWORD`.
