# Contributer / Developer's Guide

## Expo

Normal dev -> `npx expo start`
Development dev -> `APP_VARIANT=development npx expo start`

## EAS

Build dev client -> `eas build --profile development`
Test release -> `eas build --profile preview`
Prod release -> `eas build --profile production` + `eas submit --profile production`

OTA update prod -> `eas update --enviroment produciton`
OTA update development -> `eas update --enviroment development`

# Code base structure

```
src
  |- app // Expo react native app.
  |- components // Standalone, reusable tsx code elements.
  |- constants // App constants.
  |- hooks // Pure typescript hooks.
  |- lib // Standalone typescript logic.
```

# Git commits

We follow the [Convention Commits](https://www.conventionalcommits.org/en/v1.0.0/) style guide for commits, but with a small tweak: 
> Bulleted bodies as a style requirement, to enable easy scanning.


```
<type>(subject): <short description>

[optional body, bulletted]
```

Feel free to use the [Conventional Commits VSCode Extension](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits) to help enforce this formatting.