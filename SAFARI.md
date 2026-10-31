# Omni Tools for Safari

The Safari-ready extension source is in `OmniTools - Safari`.

## Quick test on macOS

Safari 26 and newer can load the folder directly:

1. Open **Safari > Settings > Advanced** and enable features for web developers.
2. Open **Safari > Settings > Developer** and allow unsigned extensions.
3. Click **Add Temporary Extension…** and select `OmniTools - Safari` or run
   `./build-safari.sh` first and select the generated ZIP from `output/`.
4. Enable **Omni Tools**, grant access to `omni.top-academy.ru`, and reload the
   Omni page.

Safari removes a temporary extension after 24 hours or when Safari quits.

## Permanent macOS/iOS package

Install the full Xcode application, select it with `xcode-select`, then run:

```sh
./package-safari.sh
```

The script uses Apple's Safari Web Extension Packager to create an Xcode project
in `Safari App`. Open that project, choose your signing team, and run the macOS
or iOS app target. An Apple Developer membership is needed for device testing or
App Store distribution, but not for local temporary testing on macOS.

Alternatively, run `./build-safari.sh` and upload the generated ZIP to the
Safari Web Extension Packager in App Store Connect. Apple can create the
containing Xcode package there without a local Xcode installation. Signing and
distribution still use the publisher's Apple Developer team.

## Safari-specific changes

- Removed unused `webRequest` permission.
- Removed the unsupported `downloads` permission. Downloads fall back to the
  page's normal anchor download behavior.
- Fixed API namespace selection in the popup and background cache bridge so the
  callback-based code works with Safari's `chrome` compatibility namespace.
