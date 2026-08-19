## Store config

- [ ] App store privacy manifest
- [ ] Fill ~~eas.json +~~ submit.production
- [ ] Host privacy policy on github pages

## Listing config

- [ ] App overview for publishing
    - [ ] Apple: name 30 / subtitle 30 / keyword 100 / description 4k
    - [ ] Play Store: title 30 / short 80 / full 4k
- [ ] Ss 1320x2868, 5-6x
- [ ] Play store graphic 1024x500
- [ ] Apple privacy questionnaire + Play Data Safety form
    - Location collected + shared (with Open-Meteo)

## Feature todo

- [ ] Better equipment section
    - [ ] More equipment
    - [ ] Change UI selection
- [ ] Implement equipment clause to algorithm
    - [ ] Add "reasons" section as to why it was chosen (weighted ring?)
- [ ] Add more greetings
- [ ] Use image API to show object preview
- [ ] Sort suggestions by apparent magnitude / important stars
- [ ] Extract weather caching into its own hook / useContext
- [ ] Greetings => useMemo
- [ ] Update README to be more complete

## Feature wishlist (lower probability)

- [ ] Export "tonight" card
- [ ] Expo notifications?
- [ ] PostHog Analytics

## Done

- [x] Open-Meteo CC-BY attribution (settings)
- [x] Add designer/programmer credits on settings page
- [x] Add license + notice (Apache 2)
- [x] Weather caching
- [x] Reorganize
- [x] Add red filter toggle
- [x] Ios bundler identifier
- [x] Android package (lowercase-ify)
- [x] Write AI disclosure
- [x] Switch hand images to proper png transparent ones
- [x] Code review: unspaghetify code, and align naming schemes
    - [x] Config prettier better
    - [x] Scan repo for typos
    - [x] Check dependencies / dev dependencies
    - [x] Delete default 
- [x] Add app splash + icon (general app polish)
    - [x] Icon 1024x1024
    - [x] Splash 1024x1024
    - [x] Replace expo blue (#208AEF) in app.config.ts splash config
    - [x] Delete expo icon, replace with ios icon (dropped the layered Icon Composer icon, iOS now uses the flat icon.png like Android/web)