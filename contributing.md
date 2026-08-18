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